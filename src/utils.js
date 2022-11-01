const directus = require('./directus');
const fetch = require('node-fetch');

module.exports.setCollectionLayoutColumnsOrder = async (collection, columnsOrder, user) => {
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${directus.auth.token}`
    };

    const preset = {
        user,
        layout_query: { tabular: { fields: columnsOrder } },
        layout_options: { tabular: { widths: {} } },
        collection: collection
    }

    return fetch(`${process.env.EXPRESS_DIRECTUS_SLAVE_API_URL}/presets`, {
        headers,
        body: JSON.stringify(preset),
        'method': 'POST'
    });
}