const EventEmitter = require('events');
const { setCollectionLayoutColumnsOrder } = require('./utils');

const {
    ADS_COLLECTION,
    PLACEMENTS_COLLECTION,
    TEMPLATES_COLLECTION,
    FILTERS_COLLECTION
} = require('./constants');

const eventEmitter = new EventEmitter();

/*
    Listen for new users, apply collection columns order
 */
eventEmitter.on('new_user', async user => {
    await Promise.all([
        setCollectionLayoutColumnsOrder(ADS_COLLECTION, ['name', 'status', 'placement.name', 'template.name'], user.id),
        setCollectionLayoutColumnsOrder(PLACEMENTS_COLLECTION, ['name', 'description'], user.id),
        setCollectionLayoutColumnsOrder(TEMPLATES_COLLECTION, ['name', 'variables', 'html'], user.id),
        setCollectionLayoutColumnsOrder(FILTERS_COLLECTION, ['ad.name', 'ad.placement.name', 'variables'], user.id)
    ]);
});

module.exports = eventEmitter;