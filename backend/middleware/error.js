const ErrorHander = require('../utils/errorhandler');


module.exports = (err, req, res, next) => {
    err.code = err.code || 500;
    err.message = err.message || 'Internal Server Error';

    //worong mongodb id error
    if (err.name === 'CastError') {
        const message = `Resource not found with id ${err.value}`;
        err = new ErrorHander(message, 404);
    } 

    //mongoose duplicate key error
    if (err.code === 11000) {
        const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
        err = new ErrorHander(message, 400);
    }
    //wrong jwt token
    if (err.name === 'JsonWebTokenError') {
        const message = `Invalid token`;
        err = new ErrorHander(message, 401);
    }
    //jwt expired error
    if (err.name === 'TokenExpiredError') {
        const message = `Token expired`;
        err = new ErrorHander(message, 401);
    }
    

    res.status(err.code).json({
        status: 'fail',
        message: err.message
    });
}