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

        const ads = await directus.items('ads').readByQuery({
            filter: {
                hostname: url.hostname,
                pathname: url.pathname,
                language: body.language
            }
        });

        res.json({ status: 'success', ads: ads });
    } catch (err) {
        next(err);
    }
}