module.exports = {
    components: {
        schemas: {
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