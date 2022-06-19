const schema = {
    type: 'object',
    properties: {
        placements: {
            type: 'array',
            minItems: 1,
            maxItems: 25,
            items: {
                type: 'object',
                properties: {
                    name: {
                        type: 'string',
                        maxLength: 100
                    },
                    filters: {
                        type: 'object',
                        /*
                            For security reasons, it's a good pratice to define what properties are available, and do not allow
                            additional properties.
                         */
                        properties: {},
                        additionalProperties: true,
                        nullable: true,
                    }
                },
                required: [
                    'name'
                ],
                additionalProperties: false
            }
        }
    },
    required: [
        'placements'
    ],
    additionalProperties: false
};

module.exports = schema;