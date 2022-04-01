const app = require('./app');
const dotenv = require('dotenv');
const connectdatbase = require('./config/database');
const errormiddleware = require('./middleware/error');


//handling uncaught exception
process.on('uncaughtException', (exception) => {
    console.log(`error: ${exception.message}`);
    console.log(`shutting down...`);
    process.exit(1);
});





//coneect to database   
connectdatbase();



//middleware error
app.use(errormiddleware);





//config 
dotenv.config({path:"backend/config/config.env"});




app.listen(process.env.PORT,()=>{
    console.log(`Server is running on port http://localhost:${process.env.PORT}`);
});


