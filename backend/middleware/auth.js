const ErrorHander = require('../utils/errorhandler');
const catchAsyncError = require('./catchasyncerror');
const jwt = require('jsonwebtoken');
const User = require('../models/usermodels');
const req = require('express/lib/request');
const res = require('express/lib/response');


exports.isAuthenticatedUser = catchAsyncError(async(req,res,next)=>{
    const {token} = req.cookies;
    if(!token){
        return next(new ErrorHander("Please Login First",401));
    }
    const decodedData = jwt.verify(token,process.env.JWT_SECRET);
    req.user = await User.findById(decodedData.id);
    next();
});


exports.authorizeRoles = (...roles)=>{
    return (req,res,next)=>{
        if(!roles.includes(req.user.role)){
         return next(
             new ErrorHander (
                 `Role:${req.user.role} is not authorized to access this route`,
                 403
                ));
        }
        next();
    }
}