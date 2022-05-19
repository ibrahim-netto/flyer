module.exports = (req, res, next) => {
    res.set('X-Project', 'virail-adserver-docs');
    next();
}