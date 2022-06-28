const components = require('./components.swagger');
const paths = require('./paths.swagger');

const { PROJECT_NAME, VERSION, EXPRESS_PORT } = require('../constants');

const options = {
    openapi: '3.0.0',
    info: {
        title: PROJECT_NAME,
        version: VERSION,
        description: '',
        license: {
            name: 'GPL-3.0-or-later',
        },
        contact: {
            name: 'Ibrahim Netto',
            url: 'https://github.com/ibrahim-netto/flyer',
            email: 'ibrahim.netto@virail.com',
        },
    },
    schemes: ['http', 'https'],
    consumes: ['application/json'],
    produces: ['application/json'],
    servers: [ {
        url: process.env.EXPRESS_PUBLIC_URL
    }],
    tags: {},
    ...components,
    ...paths
};

module.exports = options;