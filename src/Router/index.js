const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const auth = require("../../src/middleware/auth");
const { error } = require("console");
const multer = require("multer");
//schema for the userSignup..
const userSchema = require("../e-shop/index");
const uploadData = require("../e-shop/schema/index");
const ProcessInvoice = require("../e-shop/schema/ProcessInvoice")
var nodemailer = require('nodemailer');
const { type } = require("os");
const uuid = require('uuid')
const app = express();
const AccountData =require("../e-shop/schema/AccountSchema")
const CustmoreDetailsData=require("../e-shop/schema/customerDetails")

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
  console.log("in Login", req.body, userSchema);
  try {
    const user = await userSchema.findByCredentials(
      req.body.email,
      req.body.password
    );
    if (user !== "Email Id is not Found" || user !== "Wrong Password") {

      const token = user.generateAuthToken();
      console.log(token, "token");
      res.status(200).send({ user });
    }
    else {
      res.status(204).status({ user })
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
app.post("/getData", async (req, res) => {


  try {
    const user = await uploadData.find({});
    res.send(user)
  } catch (e) { }
});

app.post("/upload/data", upload.single("imageData"), async (req, res) => {
  console.log(req);
  const uniqId = uuid.v4()
  let obj = {
    imageData: "",
    description: "",
    price: "",
    item: "",
    product: "",
    size: "",
    weight: "",
    quantity: "",
    productId: "",
    ProductUniqId: ""
  };

  try {
    if (req.file.buffer !== undefined) {
      obj["imageData"] = req.file.buffer
    }
    obj["description"] = req.body.description
    obj["price"] = req.body.price
    obj["item"] = req.body.item
    obj["product"] = req.body.product
    obj["size"] = req.body.size
    obj["weight"] = req.body.weight
    obj["quantity"] = req.body.quantity
    obj["productId"] = req.body.productId
    obj["ProductUniqId"] = uniqId

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

app.post("/getqotation", async (req, res) => {
  console.log(req.body)
  try {
    const user = await uploadData.findOne({ productId: req.body.productId });
    res.send(user)
  } catch (e) { }
});

app.get('/productimg/:id', async (req, res) => {
  console.log(req.params.id)
  try {
    const user = await uploadData.findOne({ productId: req.params.id });
    res.set('Content-Type', 'image/jpg')
    res.send(user.imageData)
  } catch (e) {

  }
})

app.get('/jsonData', async (req, res) => {
  try {

    const user = await uploadData.find({});

    res.send(user)
  } catch (e) {



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




app.post('/sendEmail', async (req, res) => {

  var mailOptions = {
    from: 'amw.aakashmetal2022@gmail.com',
    to: 'amw.aakashmetal2022@gmail.com',
    subject: 'Custmore information',
    text: 'Hi',
    html: "<b>Phone number:</b>" + `${req.body.phno}` + `<b>Desc:</b> ${req.body.desc}`
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
      res.send(info.response)
    }
  });

})


// Edit the Admin Data...
app.post('/edit/:id', async (req, res) => {
  console.log(req.params.id)


  try {
    const user = await uploadData.findOne({ productId: req.params.id });
    if (user) {
      const newObj = {};
      for (const [key, value] of Object.entries(req.body)) {
        if (key !== 'productId') {
          newObj[key] = value;
        }

      }
      let updateValue = { $set: newObj }
      console.log(updateValue);
      const updatedData = await uploadData.findOne({ productId: req.params.id }).updateOne(updateValue)

      if (updatedData) {
        res.send("Data is Updated successfully")
      }
    } else {
      res.status(500).send("Product is not found")
    }

  } catch (e) {
    console.log(e)
    res.status(504).send("Internal Service Problem")
  }

})

// Edit the Production Data...
app.post('/editData', async (req, res) => {
  console.log(req.body)


  try {
    const filterOption = {
      _id: req.body._id
    }



    const data = await uploadData.updateMany(filterOption,
      {
        $set: {
          productId: req.body.ProductId,
          description: req.body.Description,
          price: req.body.Price,
          item: req.body.Item,
          product: req.body.Product,
          size: req.body.Size,
          weight: req.body.Weight,
          quantity: req.body.Quantity,


        }
      })
    console.log(data)
    res.status(200).send("Edited Sucessfully")

  } catch (e) {
    console.log(e)
    res.status(504).send("Internal Service Problem")
  }

})


//Get Quotation Template...
app.post('/getquote', async (req, res) => {
  // console.log(req.body,req.body.status)
  // const productId=req.params.query.split(',')
  const productId = req.body.productIdArr


  // console.log(productId)
  let obj = {};
  const user = await uploadData.find({
    "productId": { $in: productId }
  }).then(res => {
    // console.log(res)
    // obj=res
  });
  obj = req.body.InvoiceProduct

  console.log(obj, "KKKKK")


  let date = new Date()
  let dateday = date.getDate()
  let dateMonth = date.getMonth()
  let dateYear = date.getFullYear()
  let todayDate = dateday + '/' + dateMonth + "/" + dateYear;
  let price = []
  let quantity = []
  var Amount = []
  var TotaAmount = 0;
  var TotalQuatity = 0;



  obj.map((i) => {

    let num = Number(i.Price)
    let quanti = Number(i.Quantity)

    price.push(num)
    quantity.push(quanti)
    let amt = num * quanti
    Amount.push(amt)
  })




  for (let i = 0; i <= Amount.length - 1; i++) {
    TotaAmount = TotaAmount + Amount[i]
    TotalQuatity = TotalQuatity + quantity[i]
  }

  console.log(price, quantity, Amount, TotalQuatity)



  let GSTNumber;
  let Name;
  let phonenumber;
  let address;
  // console.log(req.body)
  if (req?.body?.Status !== "initiate") {

    GSTNumber = req.body.GSTNumber
    Name = req.body.Name
    phonenumber=req.body.phonenumber
    address=req.body.address
  }

  console.log(GSTNumber, Name)
  let total = "500"
  let subTotal = "485"
  let stateTax = "9"
  let centralTax = "9"
  let totalQuatity = "22"
  let GrandTotal = "518"
  let TotalGst = "18"

  //  console.log(req?.body?.Status ,"FFF")
  try {

    if (req?.body?.Status === "pending") {


      res.render("index", {
        obj,
        total,
        subTotal,
        totalQuatity,
        stateTax,
        centralTax,
        GrandTotal,
        TotalGst,
        todayDate,
        Amount,
        TotaAmount,
        TotalQuatity,
        GSTNumber,
        Name,
        phonenumber,
        address



      });
    } else {
      console.log(obj, "In Else")
      res.render("sendquote", {
        obj,
        total,
        subTotal,
        totalQuatity,
        stateTax,
        centralTax,
        GrandTotal,
        TotalGst,
        todayDate,
        Amount,
        TotaAmount,
        TotalQuatity,


      });
    }

  } catch (e) {
    console.log(e, "ONGF")
  }


})

//get the input from  the Process Data to store...
app.post('/savequoteData', async (req, res) => {
  console.log(req.body, "FGRFRGR")
  var saveData;
  let processData
  let DueAmount
  var AccounData
  if (req.body.Status === "Completed") {


    try {
      let arr = []
      var dataArray = req.body.InvoiceProduct
      for (const data of dataArray) {
        const subfield = data.ProductUniqId;
        const second = await uploadData.findOne({ ProductUniqId: subfield })
        console.log(second, "41")
        if (second) {

          if (second.quantity >= data.Quantity) {
            let finalval = second.quantity - data.Quantity
            console.log("FinalData", finalval)
            const finalData = await uploadData.updateOne({ ProductUniqId: subfield }, { $set: { quantity: finalval } })
          }
          else {

            res.send("Enter Amount Quatity is grater than Product")
            throw new Error("Enter Amount Quatity is grater than Product")
          }

        }
      }



    } catch (e) {
      console.log(e)
    }



    try {

      processData = await ProcessInvoice.find({ _id: req.body._id })
      console.log(processData,"&*JUNJJ",processData[0].TotalAmount , req.body. AmountPaid)
      DueAmount = processData[0].TotalAmount - req.body. AmountPaid
       
      console.log(DueAmount,"DueAmount")
      let AcountObj={}
      const uniqId = uuid.v4()
        if(DueAmount === 0){
          AcountObj["Status"]="completed"
          AcountObj["GSTNumber"]=req.body.GSTNumber,
          AcountObj["Name"]= req.body.Name,
          AcountObj["AmountPaid"]= req.body.AmountPaid,
          AcountObj["TotalAmount"]= processData[0].TotalAmount
          AcountObj["DueAmount"]=DueAmount
          AcountObj["AccountID"]=uniqId
         
        }else{
          AcountObj["Status"]="pending"
          AcountObj["GSTNumber"]=req.body.GSTNumber,
          AcountObj["Name"]= req.body.Name,
          AcountObj["AmountPaid"]= req.body.AmountPaid,
          AcountObj["TotalAmount"]=processData[0].TotalAmount
          AcountObj["DueAmount"]=DueAmount
          AcountObj["AccountID"]=uniqId

        }
        console.log(AcountObj,"*******")
        AccounData= new AccountData(AcountObj)

    
       
    } catch (e) {
      console.log(e)

    }
    try{
      await AccounData.save()
     
      }catch(e){
        console.log(e)

      }


    try {
      saveData = await ProcessInvoice.updateMany({ _id: req.body._id }, {
        $set: {
          Status: "completed"
          , AmountPaid: req.body.AmountPaid, DueAmount: DueAmount
        }

      })
      res.send("Data is Saved")

    

    } catch (e) {
      console.log(e)

    }

   


  } else {



    console.log(req.body, "4125")

    var price = []
    var quantity = []
    var Amount = []
    var TotaAmount = 0;
    var TotalQuatity = 0;
    req.body.InvoiceProduct.map((i) => {

      let num = Number(i.Price)
      let quanti = Number(i.Quantity)

      price.push(num)
      quantity.push(quanti)
      let amt = num * quanti
      Amount.push(amt)

    })

    for (let i = 0; i <= Amount.length - 1; i++) {
      TotaAmount = TotaAmount + Amount[i]
      TotalQuatity = TotalQuatity + quantity[i]
    }
    let data = req.body
    data["TotalAmount"] = TotaAmount
    data["TotalQuatity"] = TotalQuatity

    console.log(data, "4545741")

    saveData = new ProcessInvoice(data)
    try {
      // if (req.body.Status !== "Completed") {
      await saveData.save()


      res.status(200).send("submitted ")


    } catch (e) {
      console.log(e)

    }
  }



})

// fething the pending items....
app.get("/getpendingquote", async (req, res) => {
  try {
    const data = await ProcessInvoice.find({ Status: "pending" })
    res.status(200).send(data)

  } catch (e) {

  }

})
//Remove the Pending Task...
app.post("/removequote", async (req, res) => {
  console.log(req.body, req.body.GST, "DDD")
  try {
    const data = await ProcessInvoice.deleteOne({ _id: req.body._id })

    const ProcessInvoiceData = await ProcessInvoice.find({ Status: "pending" })
    console.log(ProcessInvoiceData, "SSDF")
    res.status(200).send(ProcessInvoiceData)

  } catch (e) {

  }

})

//editInvoice....
app.post("/editquote", async (req, res) => {


  const filterOption = {
    _id: req.body._id
  }

  //updating the Quatity of the Product...
  try {
    let arr = []
    var dataArray = req.body.InvoiceProduct
    console.log(req.body.InvoiceProduct, "1111****finalData*****")

    for (const data of dataArray) {
      const subfield = data.ProductUniqId;
      const second = await uploadData.findOne({ ProductUniqId: subfield })
      let num = Number(data.Quantity)
      if (num > 0) {
        if (second) {


          if (second.quantity >= data.Quantity) {
            let finalval = second.quantity - data.Quantity
            const finalData = await uploadData.updateOne({ ProductUniqId: subfield }, { $set: { quantity: finalval } })
            console.log(finalData, "****finalData*****")
          } else {
            res.send("Enter Amount Quatity is grater than Total Quatity")
            throw new Error(
              'Enter Amount Quatity is grater than Product')

          }

        }
      }
      else {
        res.send("Please Enter the Quatity")
        throw new Error(
          'Please Enter the Quatity ')
      }



    }


    var price = []
    var quantity = []
    var Amount = []
    var TotaAmount = 0;
    var TotalQuatity = 0;
    req.body.InvoiceProduct.map((i) => {

      let num = Number(i.Price)
      let quanti = Number(i.Quantity)

      price.push(num)
      quantity.push(quanti)
      let amt = num * quanti
      Amount.push(amt)

    })

    for (let i = 0; i <= Amount.length - 1; i++) {
      TotaAmount = TotaAmount + Amount[i]
      TotalQuatity = TotalQuatity + quantity[i]
    }

    const UpdatedArray = req.body.InvoiceProduct

    const data = await ProcessInvoice.updateMany(filterOption, {
      $set: {
        InvoiceProduct: req.body.InvoiceProduct,
        GSTNumber: req.body.GSTNumber,
        Name: req.body.Name,
        TotalAmount: TotaAmount,
        TotalQuatity: TotalQuatity
      }
    })
    console.log("&&*&&*&UYTRECDF&&*&&*&", UpdatedArray, "&&*&&*&UYTRECDF&&*&&*&", data, "&&*&&*&UYTRECDF&&*&&*&")
    res.status(200).send("Edited Sucessfully")


  } catch (e) {
    console.log(e)

  }






})

app.post("/getinvoiceData", async (req, res) => {
  try {
    let obj;
    const user = await uploadData.find({
      "productId": { $in: req.body }
    }).then(res => {
      console.log(res)
      obj = res
    });
    res.status(200).send(obj)
  } catch (e) {

  }

})

app.get("/getProductList", async (req, res) => {
  const user = await uploadData.find({}, { product: 1, ProductUniqId: 1 });
  res.send(user)
})


//getCompleted Invoice

app.get("/GenearatedInvoice", async (req, res) => {
  try {
    const data = await ProcessInvoice.find({ Status: "completed" })
    res.send(data)

  } catch (e) {

  }
})

// get Account Data...

app.post("/getAccounts",async(req,res)=>{
  // const data = await ProcessInvoice.find({ Status: "completed" } ,{ AmountPaid: 1, 
  //   TotalAmount: 1,GSTNumber: 1,Name:1 
  //   ,DueAmount:1} )
  console.log(req.body)
  const data= await AccountData.find({ Status: req.body.status })
  res.send(data)

})

app.post('/updateAccount',async(req,res)=>{
    console.log(req.body)
    const data= await AccountData.findOne({ AccountID: req.body.AccountID })
     let initAmount=Number(data.AmountPaid)
     let newAmount=Number( req.body.PaidAmount)
     let Total=Number( data.TotalAmount)
    let finalAmount=initAmount+ newAmount
     let DueAmount= Total-finalAmount
       if(DueAmount === 0){
        const data1= await AccountData.updateMany({ AccountID: req.body.AccountID },
          {$set:{Status:"completed"}})
          res.send(data1)
       }else{
       const data1= await AccountData.updateMany({ AccountID: req.body.AccountID },
        {$set:{AmountPaid:finalAmount,DueAmount:DueAmount}})
        console.log(data1)
        res.send(data1)
       }



})


app.post("/createuserforAdmin",async(req,res)=>{
  const uniqId = uuid.v4()
    let reqbody={
      custmeruniqId:uniqId,
      ...req.body

    }
  const data = new CustmoreDetailsData(reqbody)
  console.log(req.body)

  try{
    await data.save()
    res.send(data)

  }catch(e){
    console.log(e)

  }

})
  

app.get("/username",async(req,res)=>{
  const data = await CustmoreDetailsData.find({})
  res.send(data)
})





module.exports = app;
