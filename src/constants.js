const packageJson = require('../package.json');

module.exports.PROJECT_NAME = packageJson.name;
module.exports.PROJECT_HOMEPAGE = packageJson.homepage;
module.exports.VERSION = packageJson.version;
module.exports.EXPRESS_PORT = 3000;
module.exports.CHECK_DIRECTUS_INTERVAL = 1000 * 10;

/*
    Initially, ENDPOINT_NAME and CLIENT_FILE_NAME wasn't options to be set, and the default value was 'ads'.
    But to avoid adBlockers, now these two variables can be set to any value.
 */
module.exports.ENDPOINT_VERSION = 'v1';
module.exports.ENDPOINT_NAME = 'flyer';
module.exports.CLIENT_FILE_NAME = 'flyer';

module.exports.ADS_COLLECTION = 'ads';
module.exports.PLACEMENTS_COLLECTION = 'placements';
module.exports.TEMPLATES_COLLECTION = 'templates';
module.exports.FILTERS_COLLECTION = 'filters';
module.exports.CLICKS_COLLECTION = 'clicks';