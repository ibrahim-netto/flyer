const directus = require('../directus');
const fetch = require('node-fetch');
const logger = require('../logger');
const placeholderFields = require('./placeholders.fields.json');
const placeholdersData = require('./placeholders.data.json');
const adFields = require('./ads.fields.json');
const adsData = require('./ads.data.json');

const { ADS_COLLECTION, PLACEHOLDERS_COLLECTION } = require('../constants');

module.exports = async () => {
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${directus.auth.token}`
    };

    let placeholdersCollectionExists, adsCollectionExists;

    /*
        Directus API have a strange behavior of retuning a permission error
        when a collection is not found.
    */
    await directus.collections.readOne(PLACEHOLDERS_COLLECTION)
        .then(() => placeholdersCollectionExists = true)
        .catch(() => placeholdersCollectionExists = false);

    await directus.collections.readOne(ADS_COLLECTION)
        .then(() => adsCollectionExists = true)
        .catch(() => adsCollectionExists = false);

    if (!placeholdersCollectionExists) {
        logger.info(`Creating ${PLACEHOLDERS_COLLECTION} collection...`);

        const fields = placeholderFields.map(v => {
            v.collection = PLACEHOLDERS_COLLECTION;

            /*
                After copying the schema, we need to set the right collection / table names, and
                also deleting the meta IDs
             */
            if (v?.schema?.table) v.schema.table = PLACEHOLDERS_COLLECTION;
            if (v?.meta?.collection) v.meta.collection = PLACEHOLDERS_COLLECTION;
            delete v?.meta?.id;

            return v;
        });

        const body = {
            collection: PLACEHOLDERS_COLLECTION,
            schema: {
                schema: 'public',
                name: PLACEHOLDERS_COLLECTION,
                comment: null
            },
            meta: {
                collection: PLACEHOLDERS_COLLECTION,
                icon: null,
                note: null,
                display_template: null,
                hidden: false,
                singleton: false,
                translations: null,
                archive_field: null,
                archive_app_filter: true,
                archive_value: null,
                unarchive_value: null,
                sort_field: null,
                accountability: 'all',
                color: null,
                item_duplication_fields: null,
                sort: null,
                group: null,
                collapse: 'open'
            },
            fields
        };

        /*
            Latest Directus Javascript SDK doesn't have any methods for creating new collections
            So we have to fallback to HTTP requests
         */
        await fetch(`${process.env.DIRECTUS_PUBLIC_URL}/collections`, {
            method: 'post',
            headers,
            body: JSON.stringify(body),
        }).then(response => response.json());

        logger.info(`Importing ${PLACEHOLDERS_COLLECTION} data...`);
        await directus.items(PLACEHOLDERS_COLLECTION).createMany(placeholdersData);
    }

    if (!adsCollectionExists) {
        logger.info(`Creating ${ADS_COLLECTION} collection...`);

        const fields = adFields.map(v => {
            v.collection = ADS_COLLECTION;

            if (v.field === 'placeholder') v.schema.foreign_key_table = PLACEHOLDERS_COLLECTION;
            if (v?.schema?.table) v.schema.table = PLACEHOLDERS_COLLECTION;
            if (v?.meta?.collection) v.meta.collection = PLACEHOLDERS_COLLECTION;
            delete v?.meta?.id;

            return v;
        });

        const body = {
            collection: ADS_COLLECTION,
            schema: {
                schema: 'public',
                name: ADS_COLLECTION,
                comment: null
            },
            meta: {
                collection: ADS_COLLECTION,
                icon: null,
                note: null,
                display_template: null,
                hidden: false,
                singleton: false,
                translations: null,
                archive_field: null,
                archive_app_filter: true,
                archive_value: null,
                unarchive_value: null,
                sort_field: null,
                accountability: 'all',
                color: null,
                item_duplication_fields: null,
                sort: null,
                group: null,
                collapse: 'open'
            },
            fields
        };

        await fetch(`${process.env.DIRECTUS_PUBLIC_URL}/collections`, {
            method: 'post',
            headers,
            body: JSON.stringify(body),
        }).then(response => response.json());

        /*
            Latest Directus Javascript SDK doesn't have any methods for creating setting relations
            Also, even if described on the fields JSON array, relations need to be set on another call
            So we have to fallback to HTTP requests
         */
        logger.info(`Setting ${ADS_COLLECTION} collection 'placeholder' field relation to ${PLACEHOLDERS_COLLECTION} collection...`);
        const relation = {
            collection: ADS_COLLECTION,
            field: 'placeholder',
            related_collection: PLACEHOLDERS_COLLECTION,
            meta: { 'sort_field': null },
            schema: { 'on_delete': 'NO ACTION' }
        }

        await fetch(`${process.env.DIRECTUS_PUBLIC_URL}/relations`, {
            method: 'post',
            headers,
            body: JSON.stringify(relation),
        }).then(response => response.json());

        logger.info(`Importing ${ADS_COLLECTION} data...`);
        await directus.items(ADS_COLLECTION).createMany(adsData);
    }
}