const mongoose = require('mongoose');


const DataUrlSchema =new mongoose.Schema({
  contentUrl:{
      type:String,
       require:true,
       trim:true
    },
    pornstart:{
      type:String,
      require:true,
      trim:true
    },
    tag:{
      type:String,
      require:true
    }
})




const userDataUrlSchema =new mongoose.Schema({
     orginalURL:{
      type:String,
       require:true,
       trim:true
    },
    pornstart:{
      type:String,
      require:true,
      trim:true
    },
    tag:{
      type:String,
      require:true
    },
    description:{
      type:String,
      default:""

    },
    scrutinyFlag:{
      type:Boolean,
      default:false
    }
})

const DataSchema = new mongoose.model("URLDATA", DataUrlSchema);
const UserDataUrl =new mongoose.model("UserDataUrlCollection",userDataUrlSchema)



module.exports={DataSchema:DataSchema,UserDataUrl:UserDataUrl}