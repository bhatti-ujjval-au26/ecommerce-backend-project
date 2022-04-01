const Product = require('../models/productmodels');
const ErrorHander = require('../utils/errorhandler');
const catchasyncerror = require('../middleware/catchasyncerror');
const ApiFeatures = require('../utils/apifeatures');

//create product
exports.createProduct = catchasyncerror(async (req, res,next) => {
    req.body.user = req.user.id;
    const product = await Product.create(req.body);
    res.status(201).json({
        status: 'success',
        product
    });
});
    

// get Aall products
exports.getAllProducts =catchasyncerror( async (req, res,next) => {
    const resultPerPage = 5;
    const productcount = await Product.countDocuments();
    const apiFeature = new ApiFeatures(Product.find(), req.query).search().filter().pagination(resultPerPage);
    const products = await apiFeature.query;
    res.status(200).json({
        status: 'success',
        products
    });
});

//get product details
exports.getProductDetails =catchasyncerror( async (req, res,next) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        return next(new ErrorHander("product not found" , 404));
        
    }
    res.status(200).json({
        status: 'success',
        product,
        productcount: product.length,
    });
});


//update product -- admin
exports.updateProduct =catchasyncerror( async (req, res,next) => {
    let product = await Product.findById(req.params.id);
    if (!product) {
        return next(new ErrorHander("product not found" , 404));
        
    }
    product = await Product.findByIdAndUpdate(req.params.id, req.body, {new: true,runValidators:true,useFindAndModify:false,});
    res.status(200).json({
        status: 'success',
        product
    });
});

//delete product -- admin
exports.deleteProduct =catchasyncerror( async (req, res,next) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        return next(new ErrorHander("product not found" , 404));
        
    }
    await Product.deleteOne();
    res.status(200).json({
        status: 'success',
        message: 'Product deleted'
    });
});