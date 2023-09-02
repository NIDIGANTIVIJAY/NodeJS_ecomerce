const { default: mongoose } = require("mongoose")


const AccountSchema= new mongoose.Schema({

    AccountID:{
        type: String,
        trim: true,
      
    },

   AmountPaid:{
    type: String,
    trim: true,
  
   },
   TotalAmount:{
    type: String,
    trim: true,

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
trim: true,
require: true,

}
,
InvoiceNumber:{
  type: String,
  trim: true,
  require: true,
},
InvoiceGeneratedDate:{
  type: String,
  trim: true,
  require: true,

}


})

const AccountData= new mongoose.model("AccountSection",AccountSchema)
module.exports= AccountData
