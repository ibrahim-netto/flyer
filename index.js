require('dotenv').config();

const os = require('os');
const cluster = require('cluster');
const logger = require('./src/logger');
const express = require('express');
const compression = require('compression');
const bodyParser = require('body-parser');
const expressWinston = require('express-winston');
const Sentry = require('@sentry/node');
const helmet = require('helmet');
const cors = require('cors');
const corsOptions = require('./src/cors-options');
const swaggerHeaders = require('./src/swagger/headers.swagger');
const swaggerUi = require('swagger-ui-express');
const swaggerOptions = require('./src/swagger/options.swagger');
const checkDirectus = require('./src/check-directus');
const directusLogin = require('./src/directus-login');
const applySchema = require('./src/schemas/directus/schema');
const postgreTriggers = require('./src/postgre-triggers');
const controller = require('./src/controller');
const errorHandler = require('./src/error-handler');

const {
    EXPRESS_PORT,
    ENDPOINT_VERSION,
    ENDPOINT_NAME,
    CLIENT_FILE_NAME
} = require('./src/constants');

(async () => {
    /*
        Set static token, default schema & load example data
     */
    await checkDirectus();
    await directusLogin();
    await applySchema();
    await postgreTriggers();

    const init = async () => {
        const app = express();

        app.use(bodyParser.json());

        app.use(expressWinston.logger({
            winstonInstance: logger,
            expressFormat: true,
            colorize: true,
            meta: true,
            metaField: null,
            dynamicMeta: (req) => {
                const meta = {};

                if (req) {
                    meta.ip = req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || req.ip
                }

                return meta;
            }
        }));

        if (process.env.SENTRY_DSN) {
            Sentry.init({
                dsn: process.env.SENTRY_DSN
            });
            app.use(Sentry.Handlers.requestHandler());
        }

        if (!!+process.env.EXPRESS_GZIP) {
            /*
                For use on servers without reverse-proxy
             */
            app.use(compression());
        }

        if (!!+process.env.EXPRESS_CORS) {
            app.use(cors(corsOptions));
        }

        if (!!+process.env.EXPRESS_HELMET) {
            /*
                For use on servers without reverse-proxy
             */
            app.use(helmet({
                referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
                crossOriginResourcePolicy: { policy: 'cross-origin' }
            }));
        }

        if (process.env.NODE_ENV === 'development') {
            app.use(express.static('public'));
        }

        app.get(`/${CLIENT_FILE_NAME}.js`, (req, res) => {
            res.sendFile(`dist/${CLIENT_FILE_NAME}.min.js`, { root: './public' });
        });
        app.get('/robots.txt', (req, res) => {
            res.sendFile('robots.txt', { root: './public' });
        });

        app.use('/docs', swaggerHeaders, swaggerUi.serve, swaggerUi.setup(swaggerOptions));

        app.post(`/api/${ENDPOINT_VERSION}/${ENDPOINT_NAME}`, controller.getAds);
        app.post(`/api/${ENDPOINT_VERSION}/click`, controller.adClick);

        if (process.env.SENTRY_DSN) {
            app.use(Sentry.Handlers.errorHandler());
        }
        app.use(errorHandler);

        app.listen(EXPRESS_PORT, () => {
            logger.info(`Express app listening on port ${EXPRESS_PORT}`);
        });
    };

    const clusterWorkerSize = (!!+process.env.NODE_CLUSTER) ? os.cpus().length : 1;

    if (clusterWorkerSize > 1) {
        if (cluster.isMaster) {
            for (let i = 0; i < clusterWorkerSize; i++) {
                cluster.fork();
            }

            cluster.on('exit', (worker) => {
                logger.info(`Worker ${worker.id} has exited`);
            });
        } else {
            init();
        }
    } else {
        init();
    }
})();