require('dotenv').config();

const os = require('os');
const cluster = require('cluster');
const logger = require('./src/logger');
const express = require('express');
const compression = require('compression');
const bodyParser = require('body-parser');
const expressWinston = require('express-winston');
const Sentry = require('@sentry/node');
const Tracing = require('@sentry/tracing');
const helmet = require('helmet');
const cors = require('cors');
const corsOptions = require('./src/cors-options');
const swaggerHeaders = require('./src/swagger/headers.swagger');
const swaggerUi = require('swagger-ui-express');
const swaggerOptions = require('./src/swagger/options.swagger');
const createCollections = require('./src/collections');
const controller = require('./src/controller');
const errorHandler = require('./src/error-handler');

(async () => {
    // Default Directus collections & schema
    // await createCollections();

    const init = async () => {
        const app = express();

        app.use(bodyParser.json());

        app.use(expressWinston.logger({
            winstonInstance: logger,
            meta: false,
            expressFormat: true,
            colorize: true
        }));

        if (process.env.SENTRY_DSN) {
            Sentry.init({
                dsn: process.env.SENTRY_DSN,
                integrations: [
                    new Sentry.Integrations.Http({ tracing: true }),
                    new Tracing.Integrations.Express({ app }),
                ],
                tracesSampleRate: 1.0,
            });
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

        app.use(express.static('public'));
        app.use('/docs', swaggerHeaders, swaggerUi.serve, swaggerUi.setup(swaggerOptions));
        app.post('/ads', controller.getAds);

        app.use(Sentry.Handlers.errorHandler());
        app.use(errorHandler);

        app.listen(process.env.EXPRESS_PORT, () => {
            logger.info(`Express app listening on port ${process.env.EXPRESS_PORT}`);
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