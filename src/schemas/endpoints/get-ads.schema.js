const schema = {
    type: 'object',
    properties: {
        href: {
            type: 'string',
            format: 'uri',
            maxLength: 200
        },
        language: {
            type: 'string',
            maxLength: 20
        },
        placements: {
            oneOf: [{
                type: 'array',
                minItems: 1,
                maxItems: 100,
                items: {
                    type: 'string',
                    maxLength: 200
                }
            }, {
                type: 'string',
                maxLength: 200
            }]
        }
    },
    required: [
        'href',
        'language',
        'placements'
    ],
    additionalProperties: false
};

module.exports = schema;