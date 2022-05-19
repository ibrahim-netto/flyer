const directus = require('./directus');
const logger = require('./logger');

const { ADS_COLLECTION } = require('./constants');

module.exports = async () => {
    const collection = await directus.collections.readOne(ADS_COLLECTION);

    console.log();

    // if(!collection) {
    //     await directus.createCollection({
    //         collection: ADS_COLLECTION,
    //         note: 'Ads collection',
    //         fields: [{
    //             field: "id",
    //             type: "integer",
    //             datatype: "int",
    //             interface: "primary_key",
    //             primary_key: true,
    //             auto_increment: true,
    //             length: 10,
    //             signed: false
    //         }]
    //     });
    // }
}