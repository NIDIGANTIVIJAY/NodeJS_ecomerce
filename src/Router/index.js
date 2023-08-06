const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const auth = require("../../src/middleware/auth");
const { error } = require("console");
const multer = require("multer");
//schema for the userSignup..
const userSchema = require("../e-shop/index");
const uploadData = require("../e-shop/schema/index");

var nodemailer = require('nodemailer');
const { type } = require("os");

const app = express();

app.use(bodyParser.json());
console.log("In Routers");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

//***********************  SYSTEM Flow *************************************************/

// signup  ------------------> LOGIN -----------------> Dashboard
//              |                                  |
//              |                                  |
//              |                                  |
//              V                                  V
//                                  (we call the jsontransform endpoint (Dashboard))
//
//
//  ( based on the preference
//   the url will be populated
//    with total urls)

//***********************  SYSTEM Flow *************************************************/

//..........completed End point.........

//############## SIGN UP PAGE ######################

//Adding the User.....
app.post("/signup", async function (request, response) {
  console.log("In Routers Post", request.body);
  const user = new userSchema(request.body);
  try {
    await user.save();
    response.send(user);
  } catch (e) {
    console.log("error", e);
  }
});

//############## SIGN UP PAGE ######################

//#################### Login PAGE ############################

// logging the User.....
app.post("/user/login", async (req, res) => {
  console.log("in Login", req.body,userSchema);
  try {
    const user = await userSchema.findByCredentials(
      req.body.email,
      req.body.password
    );
      if(user !== "Email Id is not Found" || user  !== "Wrong Password"){

        const token =  user.generateAuthToken();
         console.log(token,"token");
        res.status(200).send({ user });
      }
      else{
        res.status(204).status({user})
      }
   
  } catch (e) {
    console.log("SFG", e);
    res.status(400).send({ e });
  }
});

//#################### Login PAGE ############################

//#################### ADMIN PAGE ############################

//.........Admin Upload End point ........
const upload = multer({
  limits: {
    fieldSize: 10000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("please upload an image"));
    }
    cb(undefined, true);
  },
});
app.post("/getData",async (req, res) => {

  
  try {
    const user = await uploadData.find({});
      res.send(user)
  } catch (e) {}
});

app.post("/upload/data", upload.single("imageData"), async (req, res) => {
  console.log(req);

  let obj = {
    imageData: "",
    description: "",
    price: "",
    item: "",
    product: "",
    size: "",
    weight: "",
    quantity: "",
    productId:""
  };
  
  try {
    if(req.file.buffer !== undefined) {
      obj["imageData"]=req.file.buffer
    }
    obj["description"]=req.body.description
    obj["price"]=req.body.price
    obj["item"]=req.body.item
    obj["product"]=req.body.product
    obj["size"]=req.body.size
    obj["weight"]=req.body.weight
    obj["quantity"]=req.body.quantity
    obj["productId"]=req.body.productId
    console.log(obj)
     const user = new uploadData(obj);
     await user.save();
     res.send("Product saved successfuly ")
  } catch (e) {


  console.log(e)
  }
});

//........URL Data Amid can only Access this page Pending......
// app.get("/getData", auth, async (req, res) => {
//   try {
//     await DataSchema.find({}).then((ress) => {
//       res.send(ress);
//     });
//   } catch (e) {
//     throw new Error(e);
//   }
// });
//#################### ADMIN PAGE ############################

//#################### USER PAGE ############################

///......................................................

//logout from All Device...
app.post("/user/logoutAll", auth, async (req, res) => {
  console.log("in logOut All");
  try {
    req.user.token = [];
    await req.user.save();
    res.send("Logout Successfully");
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});

// logout from one Device......
app.post("/user/logout", auth, async (req, res) => {
  console.log("in logOut");
  try {
    req.user.token = req.user.token.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.status(200).send("Logout Successfully");
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});

//#################### USER PAGE ############################

app.post("/getqotation",async (req, res) => {
     console.log(req.body)
  try {
    const user = await uploadData.findOne({productId:req.body.productId});
      res.send(user)
  } catch (e) {}
});

app.get('/productimg/:id',async(req,res)=>{
    console.log(req.params.id)
    try{
      const user = await uploadData.findOne({productId:req.params.id});
            res.set('Content-Type','image/jpg')
            res.send(user.imageData)
    }catch(e){

    }
})

app.get('/jsonData',async(req,res)=>{
      try{
        
      const user = await uploadData.find({});
      console.log(user)
        res.send(user)
      }catch(e){



      }
})


//send Email service..



var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'amw.aakashmetal2022@gmail.com',
      pass: 'wgal hgpw kcjw ncea'
    }
  });

 
  
 
   app.post('/sendEmail',async(req,res)=>{

    var mailOptions = {
      from: 'amw.aakashmetal2022@gmail.com',
      to: 'amw.aakashmetal2022@gmail.com',
      subject: 'Custmore information',
      text: 'Hi',
      html: "<b>Phone number:</b>" + `${req.body.phno}` + `<b>Desc:</b> ${req.body.desc}`
    };
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
          res.send(info.response)
      }
    });

   })


   // Edit the Admin Data...
     app.post('/edit/:id' , async(req,res)=>{
      console.log(req.params.id)
    
    
      try{
             const user = await uploadData.findOne({productId:req.params.id});
              if(user){
                const newObj = {};
                for (const [key, value] of Object.entries(req.body)) {
                  if ( key !== 'productId') {
                      newObj[key] = value;
                  }
                
                }
                   let updateValue={$set:newObj}
                   console.log(updateValue);
                   const updatedData = await uploadData.findOne({productId:req.params.id}).updateOne(updateValue)
                 
                   if(updatedData){
                    res.send("Data is Updated successfully")
                   }
              }else{
                res.status(500).send("Product is not found")
              }
            
      }catch(e){
        console.log(e)
        res.status(504).send("Internal Service Problem")
      }
        
     })


    //Get Quotation Template...
    app.get('/getquote/:query',async(req,res)=>{
        console.log(req.params.query,typeof(req.params.query))
          const productId=req.params.query.split(',')
          let obj={}
          const user = await uploadData.find({
            "productId": { $in: productId }
        }).
        then(res => {
            console.log(res)
            obj=res
        });

        console.log(obj,"456")
        let date=new Date()
        let dateday=date.getDate()
        let dateMonth=date.getMonth()
        let dateYear=date.getFullYear()
        let todayDate=dateday + '/' + dateMonth + "/" + dateYear;
        console.log(todayDate)
        let total="500"
        let subTotal="485"
        let stateTax="9"
        let centralTax="9"
        let totalQuatity="22"
        let GrandTotal="518"
        let TotalGst="18"
        try{
          res.render("index",{
            obj,
            total,
            subTotal,
            totalQuatity,
            stateTax,
            centralTax,
            GrandTotal,
            TotalGst,
            todayDate
         
          });

        }catch(e){

        }

       
    })


module.exports = app;
