const express = require("express");
const Schema = require("../userSchema/index");

const mostwatched = async (req, res, next) => {
 console.log(req.body,typeof(req.body.data.frequency),req.body.data[0].frequency)
    
  try {

    if (req.body.data[0].frequency > 2) {
      next();
    }else{
      res.send("can't set frequency...");
    }
  } catch (e) {
    res.send("somthing went wrong....");
  }
};


module.exports=mostwatched