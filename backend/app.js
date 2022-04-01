const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');


app.use (express.json());
app.use(cookieParser());



//route import
const product = require('./routes/productroute');
const user = require('./routes/userroute');
const order = require('./routes/orderroute');

app.use("/api/v1",product);  
app.use("/api/v1",user);
app.use("/api/v1",order);




module.exports = app;