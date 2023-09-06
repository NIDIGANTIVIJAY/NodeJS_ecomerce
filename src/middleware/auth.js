const express =require('express')
const userSchema =require("../e-shop/index")
const jwt=require('jsonwebtoken')



const auth=async function(req,res,next){
   console.log("in AUth middleware .....",req.header('Authorization'),req.body?.Authorization)
    try{
         //for frontEnd ...
        // const  token= req.body?.Authorization.replace('Bearer ','')
           //for PostMAn ...
         const token=req.header('Authorization').replace('Bearer ','')
        console.log(token)
          const decoded=jwt.verify(token,'Relieffirstonetime')
          console.log(decoded)

          const  user =await userSchema.findOne({_id:decoded._id,'token.token':token})
          console.log(user)
          if(!user){
            throw new Error()
          }
          req.token=token
          req.user=user
   
        next()
    }catch(e){
        res.send({error:"please Authenticate first..."})

    }

  


}
module.exports=auth