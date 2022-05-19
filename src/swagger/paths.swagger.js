module.exports = {
    paths: {
        '/ads': {
            post: {
                description: 'Request ads.',
                operationId: 'requestAds',
                parameters: [{
                    name: 'href',
                    in: 'body',
                    schema: {
                        type: 'string',
                        maxLength: 200
                    },
                    description: 'Page href.',
                    example: 'https://www.virail.com',
                    required: true
                }, {
                    name: 'language',
                    in: 'body',
                    schema: {
                        type: 'string',
                        maxLength: 20
                    },
                    description: 'Ad language.',
                    example: 'en-US'
                }, {
                    name: 'placements',
                    in: 'body',
                    schema: {
                        type: 'array',
                        minItems: 1,
                        maxItems: 100,
                        items: {
                            type: 'string',
                            maxLength: 200
                        }
                    },
                    description: 'Ad placement.',
                    example: ['default-top'],
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