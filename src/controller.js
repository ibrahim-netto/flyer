const _ = require('lodash');
const Handlebars = require('handlebars');
const directus = require('./directus');
const validator = require('./validator');
const validateGetAdsEndpoint = validator.getSchema('get-ads');

const { ADS_COLLECTION, FILTERS_COLLECTION } = require('./constants');

module.exports.getAds = async (req, res, next) => {
    try {
        if (!validateGetAdsEndpoint(req.body)) {
            res.status(422).json({
                status: 'error',
                message: 'Schema validation error',
                errors: validateGetAdsEndpoint.errors
            });
            return;
        }

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
                        _in: req.body.placements.map(entry => entry.name)
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
                                _in: req.body.placements.map(entry => entry.name)
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

        const ads = req.body.placements.map(placement => {
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
                const values = Object.fromEntries(ad.variables.map(v => [v.key, v.value]));
                const html = template(values);

                return {
                    placement: ad.placement.name,
                    html
                }
            });

        res.json({ status: 'success', data });
    } catch (err) {
        next(err);
    }
}