const mongoose = require("mongoose");

const InvoiceData =  new mongoose.Schema({
     
     AmountPaid:{
      type: String,
      trim: true,
      require: true,
     },
  productIdArr:{
    type:Array,
    trim:true,
    require:true,
    uniquie:true
    
  },
Status: {
  type: String,
  trim: true,
  require: true,
},
GSTNumber: {
  type: String,
  trim: true,
  require: true,
},
Name: {
  type: String,
  trim: true,
  require: true,
},


InvoiceProduct:[  
  {
  ProductId:{
    type:String,
    trim:true,
    require:true,
    uniquie:true
    
  },
Description: {
  type: String,
  trim: true,
  require: true,
},
Price: {
  type: String,
  trim: true,
  require: true,
},
Item: {
  type: String,
  trim: true,
  require: true,
},
Product: {
  type: String,
  trim: true,
  require: true,
  
  
},

Size: {
  type: Number,
  trim: true,
  require: true,
},
Weight: {
  type: Number,
  trim: true,
  require: true,
},
Quantity: {
  type: Number,
  trim: true,
  require: true,
} 

 }]



});


const FinalInvoiceData= new mongoose.model("MasterInvoiceData",InvoiceData)


module.exports=FinalInvoiceData
