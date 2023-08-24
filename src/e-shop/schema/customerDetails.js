const { default: mongoose } = require("mongoose");
var validator = require("validator");
const CustmoreDetails=new mongoose.Schema({
    
        username: {
          type: String,
          trim: true,
          required: true,
          
        },
        email: {
          type: String,
          trim: true,
          unique: true,
          require: true,
          lowerCase: true,
          validate(Values) {
            if (!validator.isEmail(Values)) {
              throw new Error("Email is invalid");
            }
          },
        },
      
        phonenumber: {
          type: String,
          trim: true,
          required: true,
        },
        address:{
          type:String,
          trim: true,
          required:true
        },
        city:{
          type:String,
          trim:true
        },
        custmeruniqId:{
            type:String,
            trim:true

        },
        GstNumber:{
            type:String,
            trim:true

        }
     
       
})

const CustmoreDetailsData= new mongoose.model("AdminCustmers",CustmoreDetails)
module.exports=CustmoreDetailsData