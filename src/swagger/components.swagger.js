module.exports = {
    components: {
        schemas: {
            Ad: {
                type: 'object',
                description: 'Ad result.',
                properties: {
                    id: {
                        type: 'string',
                        description: '',
                        example: ''
                    },
                    placement: {
                        type: 'string',
                        description: '',
                        example: 'default-top'
                    },
                    language: {
                        type: 'string',
                        description: '',
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
                        description: '',
                        example: ''
                    },
                    html: {
                        type: 'string',
                        description: '',
                        example: ''
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