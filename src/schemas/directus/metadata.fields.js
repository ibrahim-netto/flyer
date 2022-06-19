module.exports = [{
    field: 'user_created',
    type: 'uuid',
    meta: {
        special: ['user-created'],
        interface: 'select-dropdown-m2o',
        options: {
            template: '{{avatar.$thumbnail}} {{first_name}} {{last_name}}'
        },
        display: 'user',
        readonly: true,
        hidden: false,
        width: 'half'
    },
    schema: {}
}, {
    field: 'date_created',
    type: 'timestamp',
    meta: {
        special: ['date-created'],
        interface: 'datetime',
        readonly: true,
        hidden: false,
        width: 'half',
        display: 'datetime',
        display_options: {
            relative: true
        }
    },
    schema: {}
}, {
    field: 'user_updated',
    type: 'uuid',
    meta: {
        special: ['user-updated'],
        interface: 'select-dropdown-m2o',
        options: {
            template: '{{avatar.$thumbnail}} {{first_name}} {{last_name}}'
        },
        display: 'user',
        readonly: true,
        hidden: false,
        width: 'half'
    },
    schema: {}
}, {
    field: 'date_updated',
    type: 'timestamp',
    meta: {
        special: ['date-updated'],
        interface: 'datetime',
        readonly: true,
        hidden: false,
        width: 'half',
        display: 'datetime',
        display_options: {
            relative: true
        }
    },
    schema: {}
}];