const mongoose = require("mongoose");

const ProcessInvoice = new mongoose.Schema({
     
       AmountPaid:{
        type: String,
        trim: true,
      
       },
       TotalAmount:{
        type: String,
        trim: true,

       },
       TotalQuatity:{
        type: String,
        trim: true,

       },
    productIdArr:{
      type:Array,
      trim:true,
      require:true,
      uniquie:true
      
    },
    DueAmount:{
      type: String,
      trim: true,
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


  vehicalNumber:{
    type: String,
    trim: true
  },

  
  address: {
    type: String,
    trim: true,
   
  },
  phonenumber: {
    type: String,
    trim: true,
   
  },
  


  InvoiceProduct:[  

  
    {
      ProductUniqId :{
        type:String,
        trim:true,
      },
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


const processInvoiceData= new mongoose.model("ProcessInvoice",ProcessInvoice)

module.exports=processInvoiceData
