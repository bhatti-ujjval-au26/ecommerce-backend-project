const { Console } = require("console");

class ApiFeatures{
    constructor(query, queryString){
        this.query = query;
        this.queryString = queryString;
    }
    search(){
        const keyword = this.queryString.keyword?{
            name:{
                $regex:this.queryString.keyword,
                $options:"i",  
            }
        }
        :{};


        this.query = this.query.find({...keyword});
        return this;
    }
    filter(){
        const querycopy = {...this.queryString};
       
        //remove some fields
        const removeFields = ['page','keyword','limit'];
        removeFields.forEach(key => delete querycopy[key]); 

        //filter for price and reting  

        let  queryStr = JSON.stringify(querycopy);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
        
        this.query = this.query.find(JSON.parse(queryStr));
        return this;
    }
    pagination(resultPerPage){
        const currentPage = Number(this.queryString.page) || 1;
        const skip = resultPerPage * (currentPage - 1);
        this.query = this.query.limit(resultPerPage).skip(skip);
        return this;
    }
}
module.exports = ApiFeatures;