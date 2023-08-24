const mongoose = require("mongoose");

const productData = new mongoose.Schema({
     
    imageData:{
        type:Buffer
    },
    ProductUniqId:{
      type:String,
      trim:true,
    },
    productId:{
      type:String,
      trim:true,
      
      uniquie:true
      
    },
  description: {
    type: String,
    trim: true,
    require: true,
  },
  price: {
    type: String,
    trim: true,
    require: true,
  },
  item: {
    type: String,
    trim: true,
    require: true,
  },
  product: {
    type: String,
    trim: true,
    require: true,
    
    
  },

  size: {
    type: Number,
    trim: true,
    require: true,
  },
  weight: {
    type: Number,
    trim: true,
    require: true,
  },
  quantity: {
    type: Number,
    trim: true,
    require: true,
  },




});


const uploadData= new mongoose.model("productData",productData)

module.exports=uploadData
