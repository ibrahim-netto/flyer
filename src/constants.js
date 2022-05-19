const path = require('path');
const { readFileSync } = require('fs');

const packageJson = JSON.parse(readFileSync(path.join(process.cwd(), 'package.json')).toString());

module.exports.VERSION = packageJson.version;
module.exports.ADS_COLLECTION = 'ads';