const { ENDPOINT_NAME } = require('../constants');

module.exports = {
    paths: {
        [`/api/v1/${ENDPOINT_NAME}`]: {
            get: {
                operationId: 'requestAds',
                description: 'Request ads.',
                example: 'default-top',
                parameters: [{
                    in: 'query',
                    name: 'name',
                    description: 'Ad page placement name.',
                    example: 'default-top',
                    schema: {
                        oneOf: [{
                            type: 'string',
                            maxLength: 200
                        }, {
                            type: 'array',
                            minItems: 1,
                            maxItems: 100,
                            items: {
                                type: 'string',
                                maxLength: 200,
                            }
                        }]
                    },
                    required: true
                }, {
                    in: 'query',
                    name: 'filters',
                    description: 'Ad filters in JSON string format.',
                    example: `{ tld: 'it' }`,
                    schema: {
                        oneOf: [{
                            type: 'string',
                            maxLength: 2000
                        }, {
                            type: 'array',
                            minItems: 1,
                            maxItems: 100,
                            items: {
                                type: 'string',
                                maxLength: 2000
                            }
                        }]
                    },
                    required: false
                }],
                responses: {
                    '200': {
                        description: 'Request ads result.',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/responses/RequestAds'
                                }
                            }
                        }
                    },
                    '422': {
                        description: 'Validation error.',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/responses/Error'
                                }
                            }
                        }
                    }
                }
            }
        },
        [`/api/v1/${ENDPOINT_NAME}/{id}/click`]: {
            get: {
                operationId: 'adClick',
                description: 'Ad click.',
                parameters: [{
                    in: 'path',
                    name: 'id',
                    description: 'Ad id.',
                    example: '6ecd8c99-4036-403d-bf84-cf8400f67836',
                    schema: {
                        type: 'string'
                    },
                    required: true
                }],
                responses: {
                    '302': {
                        description: 'Ad click partner redirect.'
                    },
                    '422': {
                        description: 'Validation error.',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/responses/Error'
                                }
                            }
                        }
                    }
                }
            }
        },
        [`/api/v1/${ENDPOINT_NAME}/{id}/image`]: {
            get: {
                operationId: 'getImage',
                description: 'Get image.',
                parameters: [{
                    in: 'path',
                    name: 'id',
                    description: 'Ad id.',
                    example: '6ecd8c99-4036-403d-bf84-cf8400f67836',
                    schema: {
                        type: 'string'
                    },
                    required: true
                }],
                responses: {
                    '200': {
                        description: 'Image file.',
                        content: {
                            'image': {
                                schema: {
                                    // type: 'string',
                                    format: 'binary'
                                }
                            }
                        }
                    },
                    '422': {
                        description: 'Validation error.',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/responses/Error'
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}