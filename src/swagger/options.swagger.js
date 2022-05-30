const components = require('./components.swagger');
const paths = require('./paths.swagger');

const { VERSION, EXPRESS_PORT } = require('../constants');

const options = {
    openapi: '3.0.0',
    info: {
        title: 'Virail AdServer',
        version: VERSION,
        description: '',
        license: {
            name: 'GPL-3.0-or-later',
        },
        contact: {
            name: 'Ibrahim Netto',
            url: 'https://www.virail.com/',
            email: 'ibrahim.netto@virail.com',
        },
    },
    schemes: ['http', 'https'],
    consumes: ['application/json'],
    produces: ['application/json'],
    servers: [ {
        url: `http://localhost:${EXPRESS_PORT}`,
        description: 'Local server'
    }],
    tags: {},
    ...components,
    ...paths
};

module.exports = options;