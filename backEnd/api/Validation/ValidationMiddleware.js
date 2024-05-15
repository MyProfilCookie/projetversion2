const {validationResult} = require('express-validator');
const createHttpError = require('http-errors');

exports.inputValidationMiddleware = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    next();
};