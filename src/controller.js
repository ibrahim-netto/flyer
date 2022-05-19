const directus = require('./directus');
const validator = require('./validator');
const validateGetAdsEndpoint = validator.getSchema('get-ads');

module.exports.getAds = async (req, res, next) => {
    try {
        const { body } = req;

        if (!validateGetAdsEndpoint(body)) {
            res.status(422).json({
                status: 'error',
                message: 'Schema validation error',
                errors: validateGetAdsEndpoint.errors
            });
            return;
        }

        const url = new URL(body.href);

        const query = {
            filter: {
                hostname: url.hostname,
                pathname: url.pathname,
                language: body.language,
                placeholder: {
                    _in: [body.placeholders]
                }
            }
        }
        const { data: ads } = await directus.items('ads').readByQuery(query);

        res.json({ status: 'success', data: ads });
    } catch (err) {
        next(err);
    }
}