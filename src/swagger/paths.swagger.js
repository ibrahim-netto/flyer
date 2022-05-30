module.exports = {
    paths: {
        '/api/ads': {
            get: {
                description: 'Request ads.',
                operationId: 'requestAds',
                parameters: [{
                    name: 'href',
                    in: 'query',
                    schema: {
                        type: 'string',
                        maxLength: 200,
                        example: 'https://www.virail.com'
                    },
                    description: 'Page href.',
                    required: true
                }, {
                    name: 'language',
                    in: 'query',
                    schema: {
                        type: 'string',
                        maxLength: 20,
                        example: 'en-US'
                    },
                    description: 'Ad language.'
                }, {
                    name: 'placements',
                    in: 'query',
                    schema: {
                        type: 'array',
                        minItems: 1,
                        maxItems: 100,
                        items: {
                            type: 'string',
                            maxLength: 200
                        },
                        example: ['default-top']
                    },
                    description: 'Ad placement.'
                }],
                responses: {
                    '200': {
                        description: 'Ads request result.',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/responses/AdsRequest'
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