const { Pool } = require('pg');

/*
    For development, expose postgree docker-compose service port to the host, and
    change client host to 'localhost'
 */
const postgrePool = new Pool({
    host: process.env.DIRECTUS_DB_HOST,
    port: process.env.DIRECTUS_DB_PORT,
    user: process.env.DIRECTUS_DB_USER,
    password: process.env.DIRECTUS_DB_PASSWORD,
    database: process.env.DIRECTUS_DB_DATABASE,
    max: 20, // set pool max size to 20
    idleTimeoutMillis: 1000, // close idle clients after 1 second
    connectionTimeoutMillis: 1000, // return an error after 1 second if connection could not be established
    maxUses: 7500
});

module.exports = postgrePool;