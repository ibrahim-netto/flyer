const Handlebars = require('handlebars');
const directus = require('./directus');
const validator = require('./validator');
const validateGetAdsEndpoint = validator.getSchema('get-ads');

const { ADS_COLLECTION } = require('./constants');

module.exports.getAds = async (req, res, next) => {
    try {
        if (!validateGetAdsEndpoint(req.query)) {
            res.status(422).json({
                status: 'error',
                message: 'Schema validation error',
                errors: validateGetAdsEndpoint.errors
            });
            return;
        }

        /*
            @TODO this query can return more than one Ad for one placement. Needs Fn to choose Ad priority in this cases.
            @TODO fallback in case language not found
            @TODO fallback placement not found
         */
        const query = {
            filter: {
                placement: {
                    _in: Array.isArray(req.query.placements) ? req.query.placements : [req.query.placements]
                },
                language: req.query.language
            },
            fields: [
                'id',
                'placement',
                'language',
                'placeholder.id',
                'placeholder.html',
                'variables'
            ]
        };
        const { data: ads } = await directus.items(ADS_COLLECTION)
            .readByQuery(query);

        ads.forEach(ad => {
            const template = Handlebars.compile(ad.placeholder.html);
            const values = Object.fromEntries(ad.variables.map(v => [v.key, v.value]));
            ad.placeholder.html = template(values);

            delete ad.variables; // Remove from response
        });

        res.json({ status: 'success', data: ads });
    } catch (err) {
        next(err);
    }
}