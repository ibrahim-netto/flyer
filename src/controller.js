const _ = require('lodash');
const fetch = require('node-fetch');
const Handlebars = require('handlebars');
const postgrePool = require('./postgre-pool');
const directus = require('./directus');
const validator = require('./validator');
const validateGetAdsEndpoint = validator.getSchema('get-ads');
const validateAdClickEndpoint = validator.getSchema('ad-click');
const validateGetImageEndpoint = validator.getSchema('get-image');
const plugins = require('./plugins');

const {
    ADS_COLLECTION,
    FILTERS_COLLECTION,
    CLICKS_COLLECTION,
    ENDPOINT_VERSION,
    ENDPOINT_NAME
} = require('./constants');

module.exports.getAds = async (req, res, next) => {
    try {
        // if (!validateGetAdsEndpoint(req.query)) {
        //     res.status(422).json({
        //         status: 'error',
        //         message: 'Schema validation error',
        //         errors: validateGetAdsEndpoint.errors
        //     });
        //     return;
        // }

        const names = Array.isArray(req.query.placement) ? req.query.placement : [req.query.placement];
        const filters = Array.isArray(req.query.filters) ? req.query.filters : [req.query.filters];
        const placements = names.map((name, i) => {
            return {
                name,
                filters: filters[i] ? JSON.parse(filters[i]) : null
            }
        });

        /*
            Query to look for ads with the matching placements
         */
        const adsQuery = {
            filter: {
                status: {
                    _eq: 'published'
                },
                placement: {
                    name: {
                        _in: placements.map(entry => entry.name)
                    }
                }
            },
            fields: [
                'id',
                'name',
                'status',
                'placement.name',
                'template.html',
                'variables'
            ],
            limit: -1 // return all results
        };

        /*
            Query to look for priority ads with the matching placements & filter variables
        */
        const filtersQuery = {
            filter: {
                _and: [{
                    ad: {
                        status: {
                            _eq: 'published'
                        }
                    }
                }, {
                    ad: {
                        placement: {
                            name: {
                                _in: placements.map(entry => entry.name)
                            }
                        }
                    }
                }]
            },
            fields: [
                'ad.id',
                'ad.name',
                'ad.status',
                'ad.placement.name',
                'ad.template.html',
                'ad.variables',
                'variables'
            ],
            limit: -1 // return all results
        };

        const [adsQueryResponse, filtersQueryResponse] = await Promise.all([
            directus.items(ADS_COLLECTION).readByQuery(adsQuery)
                .then(response => response.data),
            directus.items(FILTERS_COLLECTION).readByQuery(filtersQuery)
                .then(response => response.data)
        ]);

        /*
            Convert from Directus { key: 'foo', value: 'bar' } format to { foo: 'bar' } format
        */
        filtersQueryResponse.forEach(filter => {
            filter.variables = Object.fromEntries(filter.variables.map(v => [v.key, v.value]));
        });

        /*
            The order of grouped values is determined by the order they occur in collection
         */
        const adsGroupByPlacement = _.groupBy(adsQueryResponse, 'placement.name');

        const ads = placements.map(placement => {
            const { name, filters } = placement;

            if (filters && adsGroupByPlacement[name]?.length > 1) {
                /*
                    Check if there is a priority ad returned by the filters query
                */
                const priorityAd = filtersQueryResponse.find(filter => {
                    return filter.ad.placement.name === name && _.isEqual(filters, filter.variables);
                });

                if (priorityAd) return priorityAd.ad;
            }

            /*
                If there's no priority ad and there are multiple ads for one placement, return the
                first ad of the group
            */
            return adsGroupByPlacement[name] ? adsGroupByPlacement[name][0] : null;
        });

        const data = ads
            .filter(ad => !!ad)
            .map(ad => {
                const template = Handlebars.compile(ad.template.html);
                /*
                    Convert from Directus { key: 'foo', value: 'bar' } format to
                    { foo: 'bar' } format
                */
                const values = Object.fromEntries(ad.variables.map(v => {
                    if (v.value === '$AD_IMAGE_SRC') {
                        v.value = `${process.env.EXPRESS_PUBLIC_URL}/api/${ENDPOINT_VERSION}/${ENDPOINT_NAME}/${ad.id}/image`;
                    }

                    return [v.key, v.value];
                }));
                const html = template(values);

                const parsed = {
                    id: ad.id,
                    name: ad.name,
                    placement: ad.placement.name,
                    html
                };

                if (req.query.raw) {
                    parsed.template = ad.template.html;
                    parsed.variables = values;
                }

                return parsed;
            });

        res.json({ status: 'success', data });
    } catch (err) {
        next(err);
    }
}

module.exports.adClick = async (req, res, next) => {
    /*
        Set shared context
    */
    if (!req.data) req.data = {};

    try {
        if (!validateAdClickEndpoint(req.params)) {
            res.status(422).json({
                status: 'error',
                message: 'Schema validation error',
                errors: validateAdClickEndpoint.errors
            });
            return;
        }

        const { id } = req.params;
        const userAgent = req.get('user-agent');
        const referrer = req.get('Referrer');

        /*
            Avoid couting clicks without referrer header
         */
        if (!referrer) {
            res.status(400).json({ status: 'error', message: 'Bad request' });
            return;
        }

        const doc = await directus.items(ADS_COLLECTION).readOne(id, {
            fields: ['id', 'variables', 'redirect', 'plugins']
        });

        if (!doc) {
            res.status(404).json({ status: 'error', message: 'Resource not found' });
            return;
        }

        req.data.doc = doc;

        for (const plugin of doc?.plugins) {
            const name = plugin.replace('.plugin.js', '');
            if (plugins[name].hook !== 'adClick') continue;
            /*
                Run plugin
             */
            await plugins[name](req);
        }

        /*
            Using postgree client to use transactions for count increment
         */
        const postgreClient = await postgrePool.connect();
        const query = `
            UPDATE ${ADS_COLLECTION}
            SET click_count = click_count + 1
            WHERE id = '${id}';
        `;
        await postgreClient.query(query);
        postgreClient.release();

        /*
            Insert entry on 'clicks' collection
         */
        await directus.items(CLICKS_COLLECTION).createOne({
            ad: id,
            referrer,
            userAgent,
            ip: req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || req.ip
        });

        res.redirect(doc.redirect);
    } catch (err) {
        next(err);
    }
}

module.exports.getImage = async (req, res, next) => {
    try {
        if (!validateGetImageEndpoint(req.params)) {
            res.status(422).json({
                status: 'error',
                message: 'Schema validation error',
                errors: validateGetImageEndpoint.errors
            });
            return;
        }

        const { id } = req.params;
        /*
            You don't have permission to access this response if ad id not found (Directus behavior)
         */
        const doc = await directus.items(ADS_COLLECTION).readOne(id, { fields: ['image'] });
        if (!doc) {
            res.status(404).json({ status: 'error', message: 'Resource not found' });
            return;
        }

        const headers = {
            'Authorization': `Bearer ${directus.auth.token}`
        };
        const response = await fetch(`${process.env.EXPRESS_DIRECTUS_API_URL}/assets/${doc.image}`, {
            method: 'GET',
            headers
        });

        if (!response.ok) throw new Error(response.statusText);

        const responseHeaders = [
            'content-type',
            'accept-ranges',
            'content-length'
        ];
        responseHeaders.forEach(header => res.set(header, response.headers.get(header)));

        /*
            Pipe stream from fecth to Express response
         */
        response.body.pipe(res);
    } catch (err) {
        next(err);
    }
}

// https://www.thetrainline.com/book/results?lang={{lang}}&currency={{currency}}&origin={{origin}}&destination={{destination}}&outwardDate={{outwardDate}}&outwardDateType=departAfter&selectExactTime=true&journeySearchType=single&directSearch=false