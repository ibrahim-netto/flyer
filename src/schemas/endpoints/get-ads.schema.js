const schema = {
    type: 'object',
    properties: {
        href: {
            type: 'string',
            format: 'uri'
        },
        language: {
            type: 'string',
            maxLength: 20
        },
        placeholders: {
            type: 'array',
            minItems: 1,
            maxItems: 100,
            items: {
                type: 'string',
                maxLength: 200
            }
        },
        // For future implementation
        session_id: {
            type: 'string',
            maxLength: 200
        }
    },
    required: [
        'href',
        'language',
        'placeholders'
    ],
    additionalProperties: false
};

module.exports = schema;