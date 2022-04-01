const mongoose = require('mongoose');


const connectdatbase = ( ) => {

    mongoose.connect("mongodb+srv://ujjval:12345@cluster0.o3jqs.mongodb.net/Ecommers?retryWrites=true&w=majority",{
        useNewUrlParser:true,useUnifiedTopology:true})
        .then((data)=>{
            console.log(`Database is connected:${data.connections.host}`);
        }
        )
        .catch(err=>{
            console.log(err);
        }
        )
    }
    

module.exports = connectdatbase;
