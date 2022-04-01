const ErrorHander = require('../utils/errorhandler');
const catchasyncerror = require('../middleware/catchasyncerror');
const User = require('../models/usermodels'); 
const sendToken = require('../utils/jwttoken');
const sendEmail = require('../utils/sendemail');
const { error } = require('console');
const crypto = require('crypto');
const req = require('express/lib/request');

//register user
exports.registerUser = catchasyncerror(async (req, res,next) => {
    const{name,email,password} = req.body;
    const user = await User.create({
        name,
        email,
        password,
        avatar:{
            public_id:'this is a semple id',
            url:'profilepicurl'
        }

    });
    sendToken(user,201,res);
    return res.redirect()
});

//login user
exports.loginUser = catchasyncerror(async (req, res,next) => {
    const{email,password} = req.body;
    //check if user have provided email and password
    if(!email || !password){
        return next(new ErrorHander('Please provide email and password',400));
    }
    const user = await User.findOne({email}).select('+password');

    if(!user){
        return next(new ErrorHander('Invalid credentials',401));
    }

    const ispasswordmatch = await user.comparePassword(password);
    if(!ispasswordmatch){
        return next(new ErrorHander('Invalid credentials',401));
    }
    sendToken(user,200,res);
    
});

//logout user
exports.logout = catchasyncerror(async (req, res,next) => {
    res.cookie('token',null,{
        expires:new Date(Date.now()),
        httpOnly:true
    });


    res.status(200).json({
        status:'success',
        message : 'Logged out successfully'

    });
});

//forgot password
exports.forgotPassword = catchasyncerror(async (req, res,next) => {
     const user = await User.findOne({email:req.body.email});
        if(!user){
            return next(new ErrorHander('There is no user with that email',404));
        }
        //generate token
        const resetToken = user.getResetPasswordToken();
        await user.save({validateBeforeSave:false});
        //send email with token
        const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;
        const message = `your password reset token is: \n\n ${resetPasswordUrl}\n\nif you did not request this, please ignore this email and your password will remain unchanged.`; 
        try{
            await sendEmail({
                email:user.email,
                subject:'Password reset token',
                message
            });
            res.status(200).json({
                status:'success',
                message:`Email sent to ${user.email} successfully`
            });
        }catch(err){
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save({validateBeforeSave:false});
            return next(new ErrorHander("not velid ",500));
        }

});


//RESET PASSWORD
exports.resetPassword = catchasyncerror(async (req, res,next) => {
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire:{$gt:Date.now()}
    });
    if(!user){
        return next(new ErrorHander('Invalid token',400));
    }
    if (req.body.password !== req.body.confirmPassword ){
        return next(new ErrorHander('pass dose not match',400));

    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    sendToken(user,200,res);    
});


//get user details
exports.getUserDetails = catchasyncerror(async (req, res,next) => {
    const user = await User.findById(req.user.id)
    res.status(200).json({
        status:'success',
        data:{
            user
        }
    });
});

//update user password
exports.updatePassword = catchasyncerror(async (req, res,next) => {
    const user = await User.findById(req.user.id).select('+password');
    const ispasswordmatch = await user.comparePassword(req.body.oldPassword);
    if(!ispasswordmatch){
        return next(new ErrorHander('Invalid password',401));
    }
    if (req.body.newPassword !== req.body.confirmPassword ){
        return next(new ErrorHander('pass dose not match',400));

    }
    user.password = req.body.newPassword;
    await user.save();
    sendToken(user,200,res);
});

//update user profile
exports.updateProfile = catchasyncerror(async (req, res,next) => {
    const newUserData = {
        name:req.body.name,
        email:req.body.email
    };

    const user = await User.findByIdAndUpdate(req.user.id,newUserData,{
        new:true,
        runValidators:true,
        useFindAndModify:false,
    });
    res.status(200).json({
        status:'success',
    });
});


//get all users
exports.getAllUsers = catchasyncerror(async (req, res,next) => {
    const users = await User.find();
    res.status(200).json({
        status:'success',
        data:{
            users
        }
    });
});

//get single user --admin
exports.getSingleUser = catchasyncerror(async (req, res,next) => {
    const user = await User.findById(req.params.id);
    if (!user){
        return next(new ErrorHander(`user with id ${req.params.id} not found`,404));
    }

    res.status(200).json({
        status:'success',
        data:{
            user
        }
    });
});




//update user role--admin
exports.updateUserRoal = catchasyncerror(async (req, res,next) => {
    const newUserData = {
        name:req.body.name,
        email:req.body.email,
        role:req.body.role
    };

    const user = await User.findByIdAndUpdate(req.params.id,newUserData,{
        new:true,
        runValidators:true,
        useFindAndModify:false,
    });
    res.status(200).json({
        status:'success',
    });
});

//delete user --admin
exports.deleteUser = catchasyncerror(async (req, res,next) => {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user){
        return next(new ErrorHander(`user with id ${req.params.id} not found`,404));
    }
    await user.remove();

    res.status(200).json({
        status:'success',
        message:'user deleted successfully'
    });
});

