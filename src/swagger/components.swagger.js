module.exports = {
    components: {
        schemas: {
            Ad: {
                type: 'object',
                description: 'Ad result.',
                properties: {
                    id: {
                        type: 'string',
                        description: 'UUID.',
                        example: '33c1860b-02e6-401f-8a64-85bf10bf1597'
                    },
                    placement: {
                        type: 'string',
                        description: 'Ad page placement identifier.',
                        example: 'default-top'
                    },
                    language: {
                        type: 'string',
                        description: 'Ad language.',
                        example: 'en-US'
                    },
                    placeholder: {
                        $ref: '#/components/schemas/Placeholder'
                    }
                }
            },
            Placeholder: {
                type: 'object',
                description: 'Ad placeholder.',
                properties: {
                    id: {
                        type: 'string',
                        description: 'Unique identifier.',
                        example: 'default-top'
                    },
                    html: {
                        type: 'string',
                        description: 'HTML code with optional template variables.',
                        example: '<h1>{{ text }}</h1>'
                    }
                }
            },
            AnyValue: {
                description: 'Can be anything: string, number, array, object, etc., including `null`.',
                example: {
                    value: -300,
                    msg: 'Invalid value',
                    param: 'lat',
                    location: 'query'
                }
            }
        },
        requestBodies: {
            AdsRequest: {
                type: 'object',
                description: 'Ad request body.',
                properties: {
                    href: {
                        type: 'string',
                        maxLength: 200,
                        example: 'https://www.virail.com'
                    },

                }
            }
        },
        responses: {
            AdsRequest: {
                type: 'object',
                description: 'Ad request response.',
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