const path = require('path');
const { readFileSync } = require('fs');

const packageJson = JSON.parse(readFileSync(path.join(process.cwd(), 'package.json')).toString());

module.exports.VERSION = packageJson.version;
module.exports.EXPRESS_PORT = 3000;
module.exports.ADS_COLLECTION = 'ads';
module.exports.PLACEHOLDERS_COLLECTION = 'placeholders';