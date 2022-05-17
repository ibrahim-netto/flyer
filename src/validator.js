const Ajv = require('ajv');
const addFormats = require('ajv-formats');

const ajv = new Ajv();
addFormats(ajv);

ajv.addSchema(require('./schemas/endpoints/get-ads.schema'), 'get-ads');

module.exports = ajv;