module.exports = {
    components: {
        schemas: {
            Placement: {
                type: 'object',
                description: 'Ad placement.',
                properties: {
                    name: {
                        type: 'string',
                        description: 'Ad page placement name.',
                        example: 'default-top'
                    },
                    filters: {
                        type: 'object',
                        description: 'Ad filters.',
                        example: { tld: 'it' },
                        additionalProperties: true
                    }
                },
                required: [
                    'name'
                ]
            },
            Ad: {
                type: 'object',
                description: 'Ad result.',
                properties: {
                    id: {
                        type: 'integer',
                        description: 'Ad id.',
                        example: 1
                    },
                    name: {
                        type: 'string',
                        description: 'Ad name.',
                        example: 'default-top-ad'
                    },
                    placement: {
                        type: 'string',
                        description: 'Ad page placement name.',
                        example: 'default-top'
                    },
                    html: {
                        type: 'string',
                        description: 'Ad HTML code.',
                        example: '<div><h1>Default Top Ad Title</h1></div>'
                    }
                },
                required: [
                    'id',
                    'name',
                    'placement',
                    'html'
                ]
            },
            AnyValue: {
                description: 'Can be anything: string, number, array, object, etc., including `null`.',
                example: {
                    value: -300,
                    msg: 'Invalid value',
                    param: 'href',
                    location: 'query'
                }
            }
        },
        requestBodies: {
            RequestAds: {
                type: 'object',
                description: 'Ad click body.',
                properties: {
                    placements: {
                        type: 'array',
                        description: 'Ad placements.',
                        minItems: 1,
                        maxItems: 100,
                        items: {
                            $ref: '#/components/schemas/Placement'
                        },
                        example: [{ name: 'default-top', filters: { tld: 'it' } }]
                    }
                },
                required: [
                    'placements'
                ]
            },
            AdClick: {
                type: 'object',
                description: 'Request ads body.',
                properties: {
                    ad: {
                        type: 'object',
                        description: 'Clicked ad.',
                        properties: {
                            id: {
                                type: 'integer',
                                description: 'Ad id.',
                                example: 1
                            },
                            name: {
                                type: 'string',
                                description: 'Ad name.',
                                example: 'default-top-ad'
                            },
                            placement: {
                                type: 'string',
                                description: 'Ad page placement name.',
                                example: 'default-top'
                            }
                        },
                        required: [
                            'id',
                            'name',
                            'placement'
                        ]
                    },
                    url: {
                        type: 'string',
                        description: 'Origin page URL.',
                        example: 'https://www.orario-treni.it/stazione/milano-centrale'
                    },
                    referrer: {
                        type: 'string',
                        description: 'Origin page referrer.',
                        example: 'https://www.orario-treni.it/'
                    }
                },
                required: [
                    'ad',
                    'url',
                    'referrer'
                ]
            }
        },
        responses: {
            RequestAds: {
                type: 'object',
                description: 'Ads request response.',
                properties: {
                    status: {
                        type: 'string',
                        description: 'Response status.',
                        example: 'success',
                        enum: ['success'],
                        default: 'success'
                    },
                    data: {
                        type: 'array',
                        description: 'Ad results.',
                        items: {
                            $ref: '#/components/schemas/Ad'
                        }
                    }
                }
            },
            AdClick: {
                type: 'object',
                description: 'Ad click response.',
                properties: {
                    status: {
                        type: 'string',
                        description: 'Response status.',
                        example: 'success',
                        enum: ['success'],
                        default: 'success'
                    }
                }
            },
            Error: {
                type: 'object',
                description: 'Error response.',
                properties: {
                    status: {
                        type: 'string',
                        description: 'Response status.',
                        example: 'error',
                        enum: ['error'],
                        default: 'error'
                    },
                    message: {
                        type: 'string',
                        description: 'Response message.',
                        example: 'Validation error'
                    },
                    errors: {
                        type: 'array',
                        description: 'Error list.',
                        items: {
                            $ref: '#/components/schemas/AnyValue'
                        }
                    }
                }
            }
        }
    }
}