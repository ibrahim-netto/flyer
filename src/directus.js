const { Directus } = require('@directus/sdk');

const directus = new Directus(process.env.DIRECTUS_PUBLIC_URL, {
    auth: {
        staticToken: process.env.DIRECTUS_TOKEN
    }
});

module.exports = directus;