const mongoose = require('mongoose');
const { required } = require('nodemon/lib/config');

const productschema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Product name is required"],
        trime:true
    },
    description:{
        type:String,
        required:[true,"Product description is required"]
    },
    price:{
        type:Number,
        required:[true,"product price"],
        maxlength:[5,"Price should be less than 10 digits"]
    },
    ratings:
    {
        type:Number,
        difult:0
    },
    images:{
        public_id:{
        type:String,
        required:[true,"Image is required"]
        },
        url:{
            type:String,
            required:[true,"Image url is required"]
        }
    },
    category:{
        type:String,
        required:[true,"Category is required"]
    },
    stock:{
        type:Number,
        required:[true,"Stock is required"],
        maxlength:[4,"Stock should be less than 3 digits"],
        default:1
    },
    numOfReviews:{
        type:Number,
        default:0
    },
    reviews:[
        {
            user:{
                type:mongoose.Schema.ObjectId,
                ref:'User',
                required:[true,"User is required"],
            },
            name:{
                type:String,
                required:[true,"Name is required"]
            },
            rating:{
                type:Number,
                required:[true,"Rating is required"]
            },
            comment:{
                type:String,
                required:[true,"Comment is required"]
            }
        }
    ],

    user:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:[true,"User is required"]
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})


module.exports = mongoose.model('Product',productschema);


