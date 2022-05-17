const placeholder = {
    type: 'object',
    properties: {
        name: {
            type: 'string',
            maxLength: 200
        },
        selector: {
            type: 'string',
            maxLength: 200
        }
    },
    required: [
        'name',
        'selector'
    ],
    additionalProperties: false
};

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
            items: placeholder
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
        // 'placeholders'
    ],
    additionalProperties: false
};

module.exports = schema;