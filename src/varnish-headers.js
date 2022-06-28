const { PROJECT_NAME, VERSION } = require('./constants');

module.exports.varnishProjectHeaders = (req, res, next) => {
    res.append('X-Project', PROJECT_NAME);
    res.append('X-ProjectVersion', VERSION);

    next();
}

module.exports.varnishCacheHeaders = (req, res, next) => {
    res.append('X-TTL', +process.env.VARNISH_TTL_HEADER || 30);
    res.append('X-Grace', +process.env.VARNISH_GRACE_HEADER || 90);

    next();
}