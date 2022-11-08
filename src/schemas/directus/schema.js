const fs = require('fs/promises');
const path = require('path');
const directus = require('../../directus-write');
const logger = require('../../logger');
const { setCollectionLayoutColumnsOrder } = require('../../utils');
const metadataFields = require('./metadata.fields');

const adsData = require('./example-data/ads.data.json');
const placementsData = require('./example-data/placements.data.json');
const templatesData = require('./example-data/templates.data.json');
const filtersData = require('./example-data/filters.data.json');

const {
    PROJECT_NAME,
    PROJECT_HOMEPAGE,
    ADS_COLLECTION,
    PLACEMENTS_COLLECTION,
    TEMPLATES_COLLECTION,
    FILTERS_COLLECTION,
    CLICKS_COLLECTION
} = require('../../constants');

module.exports = async () => {
    /*
        Skip if collection ADS_COLLECTION exists
     */
    if (await collectionExists(ADS_COLLECTION)) {
        logger.info(`Collection ${ADS_COLLECTION} found. Skipping importing db schema, relations, example data and project settings.`);
        return;
    }

    logger.info('Importing started...');

    /*
        Apply project settings, description, colors, etc.
     */
    logger.info('Applying project settings, description, colors, etc...');
    await setProjectSettings();

    /*
        Create collections
     */
    logger.info('Create collections...');
    await createAdsCollection(ADS_COLLECTION);
    await createPlacementsCollection(PLACEMENTS_COLLECTION);
    await createTemplatesCollection(TEMPLATES_COLLECTION);
    await createFiltersCollection(FILTERS_COLLECTION);
    await createClicksCollection(CLICKS_COLLECTION);

    /*
        Set relations
    */
    logger.info('Setting relations...');
    await setRelation(ADS_COLLECTION, 'placement', PLACEMENTS_COLLECTION);
    await setRelation(ADS_COLLECTION, 'template', TEMPLATES_COLLECTION);
    await setRelation(ADS_COLLECTION, 'image', 'directus_files');
    await setRelation(TEMPLATES_COLLECTION, 'preview', 'directus_files');
    await setRelation(FILTERS_COLLECTION, 'ad', ADS_COLLECTION);
    await setRelation(CLICKS_COLLECTION, 'ad', ADS_COLLECTION);

    const collections = [
        ADS_COLLECTION,
        PLACEMENTS_COLLECTION,
        TEMPLATES_COLLECTION,
        FILTERS_COLLECTION,
    ];

    for (const collection of collections) {
        await Promise.all([
            await setRelation(collection, 'user_created', 'directus_users'),
            await setRelation(collection, 'user_updated', 'directus_users')
        ]);
    }
    /*
        CLICKS_COLLECTION don't have user_updated field.
     */
    await setRelation(CLICKS_COLLECTION, 'user_created', 'directus_users');

    /*
        Apply collection columns order
     */
    const userId = await directus.users.me.read().then(user => user.id);
    await setCollectionLayoutColumnsOrder(ADS_COLLECTION, ['name', 'status', 'placement.name', 'template.name'], userId);
    await setCollectionLayoutColumnsOrder(PLACEMENTS_COLLECTION, ['name', 'description'], userId);
    await setCollectionLayoutColumnsOrder(TEMPLATES_COLLECTION, ['name', 'variables', 'html'], userId);
    await setCollectionLayoutColumnsOrder(FILTERS_COLLECTION, ['ad.name', 'ad.placement.name', 'variables'], userId);
    await setCollectionLayoutColumnsOrder(CLICKS_COLLECTION, ['ad.name', 'url', 'ip'], userId);

    /*
        Load example data
    */
    logger.info(`Importing example data...`);
    await directus.items(PLACEMENTS_COLLECTION).createMany(placementsData);
    await directus.items(TEMPLATES_COLLECTION).createMany(templatesData);
    await directus.items(ADS_COLLECTION).createMany(adsData);
    await directus.items(FILTERS_COLLECTION).createMany(filtersData);

    logger.info('Importing finished.');
}

async function collectionExists(collectionName) {
    try {
        await directus.collections.readOne(collectionName);
        return true;
    } catch (err) {
        /*
            Directus SDK have a strange behavior of retuning a permission error
            when a collection is not found.
        */
        if (err.message === `You don't have permission to access this.`) return false;
        throw err;
    }
}

async function setProjectSettings() {
    const customCss = await fs.readFile(path.join(__dirname, 'custom.css'), 'utf8');

    const settings = {
        project_name: PROJECT_NAME,
        project_url: PROJECT_HOMEPAGE,
        default_language: 'en-US',
        project_color: '#e3ba51',
        custom_css: customCss
    }

    return directus.settings.update(settings);
}

async function createAdsCollection(adsCollectionName) {
    const collection = {
        collection: adsCollectionName,
        fields: [{
            field: 'id',
            type: 'uuid',
            meta: {
                hidden: false,
                readonly: true,
                interface: 'input',
                special: ['uuid']
            },
            schema: {
                is_primary_key: true,
                length: 36,
                has_auto_increment: false
            }
        }, {
            field: 'sort',
            type: 'integer',
            schema: {},
            meta: {
                interface: 'input',
                hidden: true,
                special: null
            },
        }, {
            field: 'name',
            type: 'string',
            schema: {
                is_nullable: false,
                is_unique: true
            },
            meta: {
                interface: 'input',
                special: null,
                required: true,
                options: {
                    trim: true
                },
                display: 'formatted-value'
            }
        }, {
            field: 'status',
            type: 'string',
            schema: {
                is_nullable: false,
                default_value: 'draft'
            },
            meta: {
                interface: 'select-dropdown',
                special: null,
                required: true,
                options: {
                    choices: [{
                        text: 'draft',
                        value: 'draft'
                    }, {
                        text: 'published',
                        value: 'published'
                    }, {
                        text: 'archived',
                        value: 'archived'
                    }]
                },
                display: 'labels'
            }
        }, {
            field: 'description',
            type: 'text',
            schema: {
                is_nullable: true
            },
            meta: {
                interface: 'input-multiline',
                special: null,
                required: false,
                options: {
                    trim: true
                }
            }
        }, {
            field: 'placement',
            type: 'integer',
            schema: {
                is_nullable: false
            },
            meta: {
                interface: 'select-dropdown-m2o',
                special: ['m2o'],
                required: true,
                options: {
                    template: '{{name}}'
                }
            }
        }, {
            field: 'template',
            type: 'integer',
            schema: {
                is_nullable: false
            },
            meta: {
                interface: 'select-dropdown-m2o',
                special: ['m2o'],
                required: true,
                options: {
                    template: '{{name}}'
                }
            }
        }, {
            field: 'image',
            type: 'uuid',
            schema: {
                is_nullable: true
            },
            meta: {
                interface: 'file-image',
                special: ['file'],
                required: false,
                options: {
                    crop: false
                }
            }
        }, {
            field: 'variables',
            type: 'json',
            schema: {
                is_nullable: true
            },
            meta: {
                interface: 'list',
                special: ['cast-json'],
                required: false,
                options: {
                    template: '{{key}} => {{value}}',
                    fields: [{
                        field: 'key',
                        name: 'key',
                        type: 'string',
                        meta: {
                            field: 'key',
                            type: 'string',
                            interface: 'input',
                            options: {
                                trim: true
                            }
                        }
                    }, {
                        field: 'value',
                        name: 'value',
                        type: 'text',
                        meta: {
                            field: 'value',
                            type: 'text',
                            interface: 'input-multiline',
                            options: {
                                trim: true
                            }
                        }
                    }]
                },
                display: 'formatted-json-value',
                display_options: {
                    format: '{{key}} => {{value}}'
                }
            }
        }, {
            field: 'redirect',
            type: 'string',
            schema: {
                is_nullable: false
            },
            meta: {
                interface: 'input',
                special: null,
                required: true,
                options: {
                    trim: true
                },
                display: 'formatted-value'
            }
        }, {
            field: 'click_count',
            type: 'integer',
            schema: {
                is_nullable: false,
                default_value: 0
            },
            meta: {
                interface: 'input',
                required: true,
                readonly: true,
                display: 'related-values',
                display_options: {
                    template: '{{name}}'
                },
            }
        },
            ...metadataFields
        ],
        schema: {
            is_nullable: false
        },
        meta: {
            singleton: false,
            sort: 1,
            sort_field: 'sort'
        }
    };

    return directus.collections.createOne(collection);
}

async function createPlacementsCollection(placementsCollectionName) {
    const collection = {
        collection: placementsCollectionName,
        fields: [{
            field: 'id',
            type: 'integer',
            schema: {
                is_primary_key: true,
                has_auto_increment: true
            },
            meta: {
                hidden: true,
                readonly: true,
                interface: 'input',
                special: null,
                required: true
            }
        }, {
            field: 'name',
            type: 'string',
            schema: {
                is_nullable: false,
                is_unique: true
            },
            meta: {
                interface: 'input',
                special: null,
                required: true,
                options: {
                    trim: true
                },
                display: 'formatted-value'
            }
        }, {
            field: 'description',
            type: 'text',
            schema: {
                is_nullable: true
            },
            meta: {
                interface: 'input-multiline',
                special: null,
                required: false,
                options: {
                    trim: true
                }
            }
        },
            ...metadataFields
        ],
        schema: {},
        meta: {
            singleton: false,
            sort: 2
        }
    };

    return directus.collections.createOne(collection);
}

async function createTemplatesCollection(templatesCollectionName) {
    const collection = {
        collection: templatesCollectionName,
        fields: [{
            field: 'id',
            type: 'integer',
            schema: {
                is_primary_key: true,
                has_auto_increment: true
            },
            meta: {
                hidden: true,
                readonly: true,
                interface: 'input',
                special: null,
                required: true
            }
        }, {
            field: 'name',
            type: 'string',
            schema: {
                is_nullable: false,
                is_unique: true
            },
            meta: {
                interface: 'input',
                special: null,
                required: true,
                options: {
                    trim: true
                },
                display: 'formatted-value'
            }
        }, {
            field: 'preview',
            type: 'uuid',
            schema: {
                is_nullable: true
            },
            meta: {
                interface: 'file-image',
                required: false,
                special: ['file']
            },
        }, {
            field: 'description',
            type: 'text',
            meta: {
                interface: 'input-multiline',
                special: null,
                required: false,
                options: {
                    trim: true
                }
            },
            schema: {
                is_nullable: true
            }
        }, {
            field: 'variables',
            type: 'json',
            schema: {
                is_nullable: true
            },
            meta: {
                interface: 'list',
                special: ['cast-json'],
                required: false,
                options: {
                    template: '{{key}} - {{description}}',
                    fields: [{
                        field: 'key',
                        name: 'key',
                        type: 'string',
                        meta: {
                            field: 'key',
                            type: 'string',
                            interface: 'input',
                            options: {
                                trim: true
                            }
                        }
                    }, {
                        field: 'description',
                        name: 'description',
                        type: 'text',
                        meta: {
                            field: 'description',
                            type: 'text',
                            interface: 'input-multiline',
                            options: {
                                trim: true
                            }
                        }
                    }]
                },
                display: 'formatted-json-value',
                display_options: {
                    format: '{{key}} - {{description}}'
                }
            }
        }, {
            field: 'html',
            type: 'text',
            schema: {
                is_nullable: false
            },
            meta: {
                interface: 'input-code',
                special: null,
                required: true,
                options: {
                    language: 'htmlmixed',
                    trim: true
                }
            }
        },
            ...metadataFields
        ],
        schema: {
            is_nullable: false
        },
        meta: {
            singleton: false,
            sort: 3
        }
    };

    return directus.collections.createOne(collection);
}

async function createFiltersCollection(filtersCollectionName) {
    const collection = {
        collection: filtersCollectionName,
        fields: [{
            field: 'id',
            type: 'integer',
            schema: {
                is_primary_key: true,
                has_auto_increment: true
            },
            meta: {
                hidden: true,
                readonly: true,
                interface: 'input',
                special: null,
                required: true
            }
        }, {
            field: 'ad',
            type: 'uuid',
            schema: {
                is_nullable: false
            },
            meta: {
                interface: 'select-dropdown-m2o',
                special: ['m2o'],
                required: true,
                options: {
                    template: '{{name}}'
                }
            }
        }, {
            field: 'variables',
            type: 'json',
            schema: {
                is_nullable: false
            },
            meta: {
                interface: 'list',
                special: ['cast-json'],
                required: true,
                options: {
                    template: '{{key}} => {{value}}',
                    fields: [{
                        field: 'key',
                        name: 'key',
                        type: 'string',
                        meta: {
                            field: 'key',
                            type: 'string',
                            interface: 'input',
                            options: {
                                trim: true
                            }
                        }
                    }, {
                        field: 'value',
                        name: 'value',
                        type: 'text',
                        meta: {
                            field: 'value',
                            type: 'text',
                            interface: 'input-multiline',
                            options: {
                                trim: true
                            }
                        }
                    }]
                },
                display: 'formatted-json-value',
                display_options: {
                    format: '{{key}} => {{value}}'
                }
            }
        },
            ...metadataFields
        ],
        schema: {
            is_nullable: false
        },
        meta: {
            singleton: false,
            sort: 4
        }
    };

    return directus.collections.createOne(collection);
}

async function createClicksCollection(clicksCollectionName) {
    const collection = {
        collection: clicksCollectionName,
        fields: [{
            field: 'id',
            type: 'integer',
            schema: {
                is_primary_key: true,
                has_auto_increment: true
            },
            meta: {
                hidden: true,
                readonly: true,
                interface: 'input',
                special: null,
                required: true
            }
        }, {
            field: 'ad',
            type: 'uuid',
            schema: {
                is_nullable: false
            },
            meta: {
                readonly: true,
                interface: 'select-dropdown-m2o',
                special: ['m2o'],
                required: true,
                options: {
                    template: '{{name}}'
                }
            }
        }, {
            field: 'referrer',
            type: 'string',
            schema: {
                is_nullable: true
            },
            meta: {
                readonly: true,
                interface: 'input',
                special: null,
                required: false,
                options: {
                    trim: true
                },
                display: 'formatted-value'
            }
        }, {
            field: 'userAgent',
            type: 'string',
            schema: {
                is_nullable: false
            },
            meta: {
                readonly: true,
                interface: 'input',
                special: null,
                required: true,
                options: {
                    trim: true
                },
                display: 'formatted-value'
            }
        }, {
            field: 'ip',
            type: 'string',
            schema: {
                is_nullable: false
            },
            meta: {
                readonly: true,
                interface: 'input',
                special: null,
                required: true,
                options: {
                    trim: true
                },
                display: 'formatted-value'
            }
        },
            metadataFields.find(v => v.field === 'user_created'),
            metadataFields.find(v => v.field === 'date_created')
        ],
        schema: {
            is_nullable: false
        },
        meta: {
            singleton: false,
            sort: 5
        }
    };

    return directus.collections.createOne(collection);
}

async function setRelation(collection, field, relatedCollection, onDelete = 'SET NULL') {
    const relation = {
        collection: collection,
        field: field,
        related_collection: relatedCollection,
        meta: {
            sort_field: null
        },
        schema: {
            on_delete: onDelete
        }
    };

    return directus.relations.createOne(relation);
}
