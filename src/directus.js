const { Directus } = require('@directus/sdk');
const logger = require('./logger');

const directus = new Directus(process.env.DIRECTUS_PUBLIC_URL, {
    // transport: {
    //     headers: {
    //         'Authorization': `Bearer ${process.env.DIRECTUS_TOKEN}`
    //     }
    // }
    auth: {
        staticToken: process.env.DIRECTUS_TOKEN
    }
});

module.exports = directus;