const schema = {
    type: 'object',
    properties: {
        name: {
            oneOf: [{
                type: 'string',
                maxLength: 200
            }, {
                type: 'array',
                minItems: 1,
                maxItems: 100,
                items: {
                    type: 'string',
                    maxLength: 200
                }
            }]
        },
        filters: {
            oneOf: [{
                type: 'string',
                maxLength: 200
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
        raw: {
            type: 'boolean'
        }
    },
    required: [
        'name'
    ],
    additionalProperties: false
};

module.exports = schema;