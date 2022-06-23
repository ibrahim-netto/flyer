const schema = {
    type: 'object',
    properties: {
        id: {
            type: 'string',
            maxLength: 200
        }
    },
    required: [
        'id'
    ],
    additionalProperties: false
};

module.exports = schema;