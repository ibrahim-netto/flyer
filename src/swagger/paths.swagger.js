const { ENDPOINT_NAME } = require('../constants');

module.exports = {
    paths: {
        [`/api/v1/${ENDPOINT_NAME}`]: {
            post: {
                operationId: 'requestAds',
                description: 'Request ads.',
                parameters: [],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/requestBodies/RequestAds'
                            }
                        }
                    }
                },
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
        '/api/v1/click': {
            post: {
                operationId: 'adClick',
                description: 'Ad click.',
                parameters: [],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/requestBodies/AdClick'
                            }
                        }
                    }
                },
                responses: {
                    '200': {
                        description: 'Ad click result.',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/responses/AdClick'
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
        '/api/v1/images/{id}': {
            get: {
                operationId: 'getImage',
                description: 'Get image.',
                parameters: [{
                    in: 'path',
                    name: 'id',
                    schema: {
                        type: 'string'
                    },
                    required: true,
                    description: 'ID of the image to get.'
                }],
                responses: {
                    '200': {
                        description: 'Image file.',
                        content: {
                            'image': {
                                schema: {
                                    type: 'string',
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