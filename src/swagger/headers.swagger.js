const { PROJECT_NAME } = require('../constants');

module.exports = (req, res, next) => {
    res.set('X-Project', `${PROJECT_NAME}-docs`);
    next();
}