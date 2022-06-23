const Ajv = require('ajv');
const addFormats = require('ajv-formats');

const ajv = new Ajv();
addFormats(ajv);

ajv.addSchema(require('./schemas/endpoints/get-ads.schema'), 'get-ads');
ajv.addSchema(require('./schemas/endpoints/ad-click.schema'), 'ad-click');
ajv.addSchema(require('./schemas/endpoints/get-image.schema'), 'get-image');

module.exports = ajv;