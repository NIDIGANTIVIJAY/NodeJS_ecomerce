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
const AccountData = require("../e-shop/schema/AccountSchema")
const CustmoreDetailsData = require("../e-shop/schema/customerDetails")
var converter = require('number-to-words');
app.use(bodyParser.json());
console.log("In Routers");
const productionData = require("../e-shop/schema/ProductionData")

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

// app.post("/upload/data", upload.single("imageData"), async (req, res) => {
//   console.log(req);
//   const uniqId = uuid.v4()
//   let obj = {
//     imageData: "",
//     description: "",
//     price: "",
//     item: "",
//     product: "",
//     size: "",
//     weight: "",
//     quantity: "",
//     productId: "",
//     ProductUniqId: ""
//   };

//   try {
//     if (req.file.buffer !== undefined) {
//       obj["imageData"] = req.file.buffer
//     }
//     obj["description"] = req.body.description
//     obj["price"] = req.body.price
//     obj["item"] = req.body.item
//     obj["product"] = req.body.product
//     obj["size"] = req.body.size
//     obj["weight"] = req.body.weight
//     obj["quantity"] = req.body.quantity
//     obj["productId"] = req.body.productId
//     obj["ProductUniqId"] = uniqId

//     console.log(obj)
//     const user = new uploadData(obj);
//     await user.save();
//     res.send("Product saved successfuly ")
//   } catch (e) {


//     console.log(e)
//   }
// });



app.post("/upload/data", upload.single("imageData"), async (req, res) => {
  console.log(req.body)
  const uniqId = uuid.v4()


  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  let mainArr = []
  let yearArr = []
  let monthArr = []


  let mainObj = {}
  let yearObj = {}
  let monthobj = {}

  //initial - second object 
  monthobj["month"] = currentMonth.toString()
  monthArr.push(monthobj)



  //initial 1- object....
  yearObj["year"] = currentYear.toString()
  yearObj["monthArray"] = monthArr

  // initial two objects
  yearArr.push(yearObj)
  console.log("Initial-1 object", yearObj)
  console.log("Initial-2 object", monthArr)

  console.log("****FINAL-ARRAY", yearArr)
  mainObj["yearArray"] = yearArr
  console.log("****FINAl-MainARRAY", mainObj)
  mainArr.push(mainObj)


  console.log(mainArr, "&&&&&")






  let obj = {
    imageData: "",
    description: "",
    price: "",
    item: "",
    product: "",
    size: "",
    weight: "",
    quantity: "",
    ProductUniqId: "",
    Hsno: "",
    DailyProdDataArray: []
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
    obj["Hsno"] = req.body.Hsno
    obj["ProductUniqId"] = uniqId,
      obj["DailyProdDataArray"] = mainArr,

      console.log(obj)
    const user = new productionData(obj);
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
  let dateMonth = date.getMonth() + 1
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
  let vehicalNumber;
  let InvoiceNumber;
  let SGST;
  let CGST;
  let TotalTAX;
  let payableAmount;


  const amount = TotaAmount;
  const percentage = 9;

  const result = (percentage / 100) * amount;
  SGST = result.toFixed(2)
  CGST = result.toFixed(2)

  TotalTAX = Number(SGST) + Number(CGST)



  payableAmount = TotaAmount + TotalTAX

  let wordsData = converter.toWords(payableAmount)




  if (req?.body?.Status !== "initiate") {

    GSTNumber = req.body.GSTNumber
    Name = req.body.Name
    phonenumber = req.body.phonenumber
    address = req.body.address
    vehicalNumber = req.body.vehicalNumber
    try {
      const data = await ProcessInvoice.countDocuments()

      InvoiceNumber = `AMW-${data + 1}/23-24`
      console.log(InvoiceNumber, data, "IKLKHH")

    }
    catch (e) {
      console.log(e)
    }


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
        address,
        vehicalNumber,
        InvoiceNumber,
        CGST,
        TotalTAX,
        SGST,
        payableAmount,
        wordsData


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
        InvoiceNumber,
        CGST,
        TotalTAX,
        SGST,
        payableAmount,
        wordsData


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
      console.log(processData, "&*JUNJJ", processData[0].TotalAmount, req.body.AmountPaid)
      DueAmount = processData[0].TotalAmount - req.body.AmountPaid

      console.log(DueAmount, "DueAmount")
      let AcountObj = {}
      const uniqId = uuid.v4()
      if (DueAmount === 0) {
        AcountObj["Status"] = "completed"
        AcountObj["GSTNumber"] = req.body.GSTNumber,
          AcountObj["Name"] = req.body.Name,
          AcountObj["AmountPaid"] = req.body.AmountPaid,
          AcountObj["TotalAmount"] = processData[0].TotalAmount
        AcountObj["DueAmount"] = DueAmount
        AcountObj["AccountID"] = uniqId

      } else {
        AcountObj["Status"] = "pending"
        AcountObj["GSTNumber"] = req.body.GSTNumber,
          AcountObj["Name"] = req.body.Name,
          AcountObj["AmountPaid"] = req.body.AmountPaid,
          AcountObj["TotalAmount"] = processData[0].TotalAmount
        AcountObj["DueAmount"] = DueAmount
        AcountObj["AccountID"] = uniqId

      }
      console.log(AcountObj, "*******")
      AccounData = new AccountData(AcountObj)



    } catch (e) {
      console.log(e)

    }
    try {
      await AccounData.save()

    } catch (e) {
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

    // for (const data of dataArray) {
    //   const subfield = data.ProductUniqId;
    //   const second = await uploadData.findOne({ ProductUniqId: subfield })
    //   let num = Number(data.Quantity)
    //   if (num > 0) {
    //     if (second) {


    //       if (second.quantity >= data.Quantity) {
    //         let finalval = second.quantity - data.Quantity
    //         const finalData = await uploadData.updateOne({ ProductUniqId: subfield }, { $set: { quantity: finalval } })
    //         console.log(finalData, "****finalData*****")
    //       } else {
    //         res.send("Enter Amount Quatity is grater than Total Quatity")
    //         throw new Error(
    //           'Enter Amount Quatity is grater than Product')

    //       }

    //     }
    //   }
    //   else {
    //     res.send("Please Enter the Quatity")
    //     throw new Error(
    //       'Please Enter the Quatity ')
    //   }



    // }


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

app.post("/getAccounts", async (req, res) => {
  // const data = await ProcessInvoice.find({ Status: "completed" } ,{ AmountPaid: 1, 
  //   TotalAmount: 1,GSTNumber: 1,Name:1 
  //   ,DueAmount:1} )
  console.log(req.body)
  const data = await AccountData.find({ Status: req.body.status })
  res.send(data)

})

app.post('/updateAccount', async (req, res) => {
  console.log(req.body)
  const data = await AccountData.findOne({ AccountID: req.body.AccountID })
  let initAmount = Number(data.AmountPaid)
  let newAmount = Number(req.body.PaidAmount)
  let Total = Number(data.TotalAmount)
  let finalAmount = initAmount + newAmount
  let DueAmount = Total - finalAmount
  if (DueAmount === 0) {
    const data1 = await AccountData.updateMany({ AccountID: req.body.AccountID },
      { $set: { Status: "completed" } })
    res.send(data1)
  } else {
    const data1 = await AccountData.updateMany({ AccountID: req.body.AccountID },
      { $set: { AmountPaid: finalAmount, DueAmount: DueAmount } })
    console.log(data1)
    res.send(data1)
  }



})


app.post("/createuserforAdmin", async (req, res) => {
  const uniqId = uuid.v4()
  let reqbody = {
    custmeruniqId: uniqId,
    ...req.body

  }
  const data = new CustmoreDetailsData(reqbody)
  console.log(req.body)

  try {
    await data.save()
    res.send(data)

  } catch (e) {
    console.log(e)

  }

})


app.get("/username", async (req, res) => {
  const data = await CustmoreDetailsData.find({})
  res.send(data)
})

//Add the Production Stock
app.post("/createStock", async (req, res) => {
  console.log(req.body, "414")

  const uniqId = uuid.v4()
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  let mainArr = []
  let yearArr = []
  let monthArr = []


  let mainObj = {}
  let yearObj = {}
  let monthobj = {}

  //initial - second object 
  monthobj["month"] = currentMonth.toString()
  monthArr.push(monthobj)



  //initial 1- object....
  yearObj["year"] = currentYear.toString()
  yearObj["monthArray"] = monthArr

  // initial two objects
  yearArr.push(yearObj)
  console.log("Initial-1 object", yearObj)
  console.log("Initial-2 object", monthArr)

  console.log("****FINAL-ARRAY", yearArr)
  mainObj["yearArray"] = yearArr
  console.log("****FINAl-MainARRAY", mainObj)
  mainArr.push(mainObj)


  console.log(mainArr, "&&&&&")
  let obj = {
    stockId: uniqId,
    DailyProdDataArray: mainArr,
    ...req.body
  }
  let data = new productionData(obj)


  try {
    await data.save()
    res.send("Data is Saved")

  } catch (e) {

  }
})

//Get the Production Stock
app.get("/getStock", async (req, res) => {
  console.log(req.body, "414")



  try {
    let data = await productionData.find({})

    res.send(data)

  } catch (e) {

  }
})


// Daily Production Data
app.post("/submitDailyReport", async (req, res) => {
  try {
    const newData = req.body;
    console.log(newData, "LL")

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;



    const updatePromises = newData.map(async (item) => {
      const filter = { ProductUniqId: item.ProductUniqId };




      const monthPresent = await productionData.find(
        {
          'DailyProdDataArray.yearArray': {
            $elemMatch: {
              year: item.year,
              'monthArray.month': item.Month
            }
          }
        })
      const Stock = await productionData.find({ "ProductUniqId": item.ProductUniqId })

      console.log("CURRENTSTOCK", Stock.AvailableStock)
      const CURRENTSTOCK = Stock.AvailableStock

      const datePresent = await productionData.find(
        {
          "ProductUniqId": item.ProductUniqId,
          'DailyProdDataArray.yearArray': {
            $elemMatch: {
              year: item.year,
              'monthArray.month': item.Month,
              'monthArray.datesArray.date': item.MonthDates

            }
          }
        })

      console.log(datePresent, "datesPresent")




      let updateOptions
      //adding the month
      if (monthPresent.length === 0) {

        let montharr = []
        let monthobj = {}
        monthobj["month"] = item.Month
        montharr.push(monthobj)

        const result = await productionData.updateMany({}, {
          $push: {
            "DailyProdDataArray.$[].yearArray.$[].monthArray": montharr
          }
        })
        console.log(result)

      }





      if (datePresent.length > 0) {
        console.log("IN DATES Upadtaing ---------")

        //updating the new value for Date
        CURRENTSTOCK = Number(CURRENTSTOCK) - Number(Stock.currentprodData);

        updateOptions = {
          $set: {


            "DailyProdDataArray.$[].yearArray.$[yearElem].monthArray.$[monthElem].datesArray.$[dateElem].prodData": item.todayProd,
            AvailableStock: CURRENTSTOCK
          },


        };
        const arrayFilters = [
          { "yearElem.year": item.year },
          { "monthElem.month": item.Month },
          { 'dateElem.date': item.MonthDates }

        ];

        const result = await productionData.updateMany(filter, updateOptions, {
          arrayFilters,
        });
        return result;



      } else {

        console.log("IN DATES ADDING ---------")
        // adding the new Dates
        updateOptions = {
          $push: {
            "DailyProdDataArray.$[].yearArray.$[yearElem].monthArray.$[monthElem].datesArray": {
              date: item.MonthDates,
              prodData: item.todayProd,
            },


          },
          $set: {
            AvailableStock: Number(CURRENTSTOCK) + Number(item.todayDate),
            currentprodData: item.todayDate
          }
        };

        const arrayFilters = [
          { "yearElem.year": item.year },
          { "monthElem.month": item.Month },

        ];

        const result = await productionData.updateMany(filter, updateOptions, {
          arrayFilters,
        });
        return result;

      }













    });

    const updateResults = await Promise.all(updatePromises);

    res.json(updateResults);
  } catch (error) {
    console.error("Error adding documents:", error);
    res.status(500).send("An error occurred while adding documents.");
  }
});

//on Date change for Daily Production

app.post("/dateChange", async (req, res) => {
  console.log(req.body)
  let newElementToAdd = []
  let monthArr = []
  let mainObj = {}
  let monthObj = {}


  monthObj["month"] = req.body.month
  monthArr.push(monthObj)


  mainObj["year"] = req.body.year
  mainObj["monthArray"] = monthArr


  newElementToAdd.push(mainObj)
  console.log(newElementToAdd)

  try {
    const result = await productionData.updateMany({}, {
      $push: {
        "DailyProdDataArray.$[].yearArray": newElementToAdd
      }
    });
    res.send(result)

  } catch (e) {
    console.log(e)
  }
})


//Dashboard Api

app.get("/Dashboard", async (req, res) => {
  try {
    const data = await productionData.find({}, 'DailyProdDataArray')
    console.log(data)
    res.send(data)

  } catch (error) {

  }
}
)

//Dispatch Api..

app.post("/dispatch", async (req, res) => {
  console.log(req.body)
  const targetStockId = req.body.stockId;
  let finalProductionData;
  let finalDispatch;

  const result = await productionData.findOne({ stockId: targetStockId }, "DailyProdDataArray.yearArray.monthArray.datesArray");
  if (result) {
    const datesArray = result.DailyProdDataArray.flatMap(year => year.yearArray.flatMap(month => month.monthArray.flatMap(day => day.datesArray)));
    console.log("Dates Array:", datesArray);
    datesArray.forEach(element => {
      if (element.date === req.body.MonthDates) {


        finalProductionData = Number(element.prodData) - Number(req.body.DispatchAmount);
        finalDispatch = Number(element.Dispatch) + Number(req.body.DispatchAmount);
      }

    });
  } else {
    console.log("Stock ID not found.");
  }

  console.log(finalProductionData, "final")



  try {


    console.log(finalProductionData, "KKIJHH")
    const filter = { stockId: req.body.stockId };

    const updateOptions = {
      $set: {
        "DailyProdDataArray.$[].yearArray.$[yearElem].monthArray.$[monthElem].datesArray.$[dateElem].prodData": finalProductionData,
        "DailyProdDataArray.$[].yearArray.$[yearElem].monthArray.$[monthElem].datesArray.$[dateElem].Dispatch": finalDispatch
      },
    };

    const arrayFilters = [
      { "yearElem.year": req.body.year },
      { "monthElem.month": req.body.month },
      { "dateElem.date": req.body.MonthDates },
    ];

    const result = await productionData.updateOne(filter, updateOptions, {
      arrayFilters,
    });

    console.log(result);
    res.send(result)


  } catch (error) {

  }

  try {


  } catch (error) {

  }




})












module.exports = app;
