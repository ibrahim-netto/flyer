const Ajv = require('ajv');
const addFormats = require('ajv-formats');

const ajv = new Ajv();
addFormats(ajv);

ajv.addSchema(require('./schemas/endpoints/get-ads.schema'), 'get-ads');
ajv.addSchema(require('./schemas/endpoints/ad-click.schema'), 'ad-click');

module.exports = ajv;