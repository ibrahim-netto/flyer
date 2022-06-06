const path = require('path');
const { readFileSync } = require('fs');

const packageJson = readFileSync ?
    JSON.parse(readFileSync(path.join(process.cwd(), 'package.json')).toString()) :
    {};

module.exports.VERSION = packageJson.version;
module.exports.EXPRESS_PORT = 3000;
module.exports.CHECK_DIRECTUS_INTERVAL = 1000 * 10;
/*
    Initially, ENDPOINT_NAME and CLIENT_FILE_NAME wasn't options to be set, and the default value was 'ads'.
    But to avoid adBlockers, now this two variables can be set to any value.
 */
module.exports.ENDPOINT_NAME = 'flyer';
module.exports.CLIENT_FILE_NAME = 'flyer';
module.exports.ADS_COLLECTION = 'ads';
module.exports.PLACEHOLDERS_COLLECTION = 'placeholders';