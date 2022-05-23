const directus = require('../directus');
const logger = require('../logger');
const adFields = require('./ads.fields.json');
const placeholderFields = require('./placeholders.fields.json');

const { ADS_COLLECTION, PLACEHOLDERS_COLLECTION } = require('../constants');

module.exports = async () => {
    try {
        const [
            adsCollection,
            placeholdersCollection
        ] = await Promise.all([
            directus.collections.readOne(ADS_COLLECTION),
            directus.collections.readOne(PLACEHOLDERS_COLLECTION)
        ]);
    } catch (err) {
        console.log();
    }

    const [
        adsCollection,
        placeholdersCollection
    ] = await Promise.all([
        directus.collections.readOne(ADS_COLLECTION),
        directus.collections.readOne(PLACEHOLDERS_COLLECTION)
    ]);

    if (!adsCollection) {
        logger.info(`Creating ${ADS_COLLECTION} collection...`);

        const fields = adFields.map(v => {
            v.collection = ADS_COLLECTION;

            if (v.field === 'placeholder')
                v.schema.foreign_key_table = PLACEHOLDERS_COLLECTION;

            return v;
        });

        await directus.createCollection({
            collection: ADS_COLLECTION,
            note: 'Ads collection',
            fields
        });
    }

    if (!placeholdersCollection) {
        logger.info(`Creating ${PLACEHOLDERS_COLLECTION} collection...`);

        const fields = placeholderFields.map(v => {
            v.collection = PLACEHOLDERS_COLLECTION;
            return v;
        });

        await directus.createCollection({
            collection: PLACEHOLDERS_COLLECTION,
            note: 'Placeholders collection',
            fields
        });
    }
}