const schema = {
    type: 'object',
    properties: {
        ad: {
            type: 'object',
            properties: {
                id: {
                    type: 'integer'
                },
                name: {
                    type: 'string',
                    maxLength: 200
                },
                placement: {
                    type: 'string',
                    maxLength: 200
                },
            },
            required: [
                'id',
                'name',
                'placement'
            ],
            additionalProperties: false
        },
        url: {
            type: 'string',
            maxLength: 200
        },
        referrer: {
            type: 'string',
            maxLength: 200
        }
    },
    required: [
        'ad',
        'url',
        'referrer'
    ],
    additionalProperties: false
};

module.exports = schema;