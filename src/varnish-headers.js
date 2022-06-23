const { PROJECT_NAME, VERSION } = require('./constants');

module.exports = (req, res, next) => {
    res.append('X-Project', PROJECT_NAME);
    res.append('X-ProjectVersion', VERSION);

    next();
}