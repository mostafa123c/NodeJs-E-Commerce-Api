const mongoose = require("mongoose");

//1-create schema
const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true , "Category name is required"],
        unique : [true , "Category must be unique"],
        minlength : [3 , "Too short category name"],
        maxlength : [32 , "Too long category name"]
    },
    //A and B => shopping.com/a-and-b
    slug: {
        type: String,
        lowercase : true
    },

    image : String,
    
} , {timestamps : true} );


//2-create model
const CategoryModel = mongoose.model("Category" , categorySchema);

module.exports = CategoryModel;