const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const { error } = require("console");
const multer = require("multer");
const puppeteer = require('puppeteer');
const ejs = require('ejs');
const path = require('path');
require('dotenv').config()
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
    console.log(user, "UYT")
    try{
      if (user !== "Email Id is not Found" && user !== "Wrong Password") {

        const token = user?.generateAuthToken();
        console.log(token, "token");
        res.status(200).send({ user });
      }else{
          if(user === "Email Id is not Found"){
            res.status(401).send(`Enter Email is incorrect`)

          }else{
            res.status(401).send(`Enter Password is incorrect`)

          }


      }
      
      
      

    }catch(e){
      console.log(e)
      res.status(401).send("something went wrong")

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
    // obj["quantity"] = req.body.quantity
    obj["Hsno"] = req.body.Hsno
    obj["ProductUniqId"] = uniqId

    try {
      const user1 = new uploadData(obj);
      await user1.save();
    } catch (e) {
      console.log(e)
    }


    obj["DailyProdDataArray"] = mainArr

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

app.post("/getqotation", auth, async (req, res) => {
  console.log(req.body)
  try {
    const user = await uploadData.findOne({ productId: req.body.productId });
    res.send(user)
  } catch (e) { }
});

app.get('/productimg/:id', async (req, res) => {
  console.log(req.params.id)
  try {
    const user = await uploadData.findOne({ ProductUniqId: req.params.id });
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
    html: "<b>Phone number:</b>" + `${req.body.phno}` + `<b>Desc:</b> ${req.body.desc}` + `<b>NAme:</b> ${req.body?.name}`
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
app.post('/edit/:id', auth,async (req, res) => {
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
app.post('/editData',auth, async (req, res) => {
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
app.post('/getquote',auth, async (req, res) => {
  // console.log(req.body,req.body.status)
  // const productId=req.params.query.split(',')
  const productId = req.body.productIdArr


  console.log(productId,"PROTUCR ARR")
  let obj = {};
  let uploadData;
  // const user = await uploadData.find({
  //   "ProductUniqId": { $in: productId }
  // }).then(res => {
  //   console.log(res)
  //    uploadData=res
  // });
  // let vald=false
  // let validquatity
  // let enterQuatity
  // uploadData.map((h)=>{
  //   req.body.InvoiceProduct.map((f)=>{
  //     if(h.ProductUniqId === f.ProductUniqId ){
  //       if(f.quantity > h.quantity ){
  //         vald=true
  //         validquatity=h.quantity 
  //         enterQuatity=f.quantity 

  //       }
  //     }
  //   })
      
  // })
  // if(vald){
  //   res.send(`Enter Quatity more than Production Stock :-${validquatity} Enter Quatity:- ss${enterQuatity}`)
  //   return
  // }

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

  let temmpotalTAX = Number(SGST) + Number(CGST)
     TotalTAX=temmpotalTAX.toFixed(2)
  // var number = 7.1;
  // var rounded = Math.ceil(number); // rounded will be 8
  

  payableAmount = Number( TotaAmount) + Number(TotalTAX)

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
  let html
  const currentDirectory = __dirname;
  const fs = require('fs');

// Construct the path to the parent directory
const parentDirectory = path.join(currentDirectory, '..');
const ejsImgPath = path.join(parentDirectory,"views");
const imgPath = path.join(ejsImgPath,"image","amwlogo.png");


let imageUrl="NodeJS_ecomerce\src\public\amwlogo.png"
console.log(imageUrl,req?.body?.Status,"imgURL")

  try {

    if (req?.body?.Status === "pending") {

      const ejsTemplatePath = path.join(parentDirectory,"views","index.ejs");
      // res.render("index", {
      //   obj,
      //   total,
      //   subTotal,
      //   totalQuatity,
      //   stateTax,
      //   centralTax,
      //   GrandTotal,
      //   TotalGst,
      //   todayDate,
      //   Amount,
      //   TotaAmount,
      //   TotalQuatity,
      //   GSTNumber,
      //   Name,
      //   phonenumber,
      //   address,
      //   vehicalNumber,
      //   InvoiceNumber,
      //   CGST,
      //   TotalTAX,
      //   SGST,
      //   payableAmount,
      //   wordsData


      // });

      html = await ejs.renderFile(ejsTemplatePath, 
        {
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
            wordsData,
            imageUrl
    
    
          });


        



    } else {
      console.log(obj, "In Else")
      const ejsTemplatePath = path.join(parentDirectory,"views","sendquote.ejs");
      // res.render("sendquote", {
      //   obj,
      //   total,
      //   subTotal,
      //   totalQuatity,
      //   stateTax,
      //   centralTax,
      //   GrandTotal,
      //   TotalGst,
      //   todayDate,
      //   Amount,
      //   TotaAmount,
      //   TotalQuatity,
      //   InvoiceNumber,
      //   CGST,
      //   TotalTAX,
      //   SGST,
      //   payableAmount,
      //   wordsData


      // });
      html = await ejs.renderFile(ejsTemplatePath, {
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
        wordsData,
        imageUrl


      });
      
    
    
    }

    
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
  
    // Read the .ejs file content
    // await page.goto(url, { timeout: 60000 });
  
  
    // Set the content of the page with your HTML content
    await page.setContent(html);
  
    // Generate a PDF
    const pdfBuffer = await page.pdf();
  
    // Convert the PDF to Base64
    const base64PDF = pdfBuffer.toString('base64');
  
    // Set the content type to application/pdf
    const base64PDFWithContentType = `data:application/pdf;base64,${base64PDF}`;
  
    console.log(base64PDFWithContentType);


    res.send(base64PDFWithContentType)


    await browser.close();

  } catch (e) {
    console.log(e , "Error getqoute")
  }


})

//get the input from  the Process Data to store...
app.post('/savequoteData',auth, async (req, res) => {
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

            const result1 = await productionData.findOne(
              { ProductUniqId: subfield },

            );
            console.log(result1, result1?.AvailableStock, data.Quantity)

            let prodData = Number(result1.AvailableStock) - Number(data.Quantity)
            console.log(prodData, "KKKIJU")

            const result = await productionData.updateOne(
              { ProductUniqId: subfield },
              { $set: { AvailableStock: prodData } }
            );
            console.log(result, "POKL")

            //-------//------
            let date = new Date()
            let dateday = date.getDate()
            let dateMonth = date.getMonth() + 1
            let dateYear = date.getFullYear()
            let todayDate1 = dateday + '/' + dateMonth + "/" + dateYear;
            console.log(todayDate1, "Today'SDATE")

            let totalDispatch;


            const dailyProdDataArray = result1.DailyProdDataArray;

            for (const dailyData of dailyProdDataArray) {
              const yearArray = dailyData.yearArray;

              for (const yearData of yearArray) {
                const year = yearData.year;
                console.log("Year:", year);

                const monthArray = yearData.monthArray;

                for (const monthData of monthArray) {
                  const month = monthData.month;
                  console.log("Month:", month);

                  const datesArray = monthData.datesArray;

                  // Loop through each entry in datesArray
                  for (const dateData of datesArray) {
                    // Access the date and prodData values
                    const date = dateData.date;
                    const prodData = dateData.prodData;
                    const dispatch = dateData.Dispatch;

                    console.log("Date:", date);
                    console.log("Production Data:", prodData);
                    console.log("Dispatch:", dispatch);
                    if (date === todayDate1) {
                      totalDispatch = dispatch
                    }




                  }
                }
              }
            }


            console.log("TodayDispatch", totalDispatch)

            totalDispatch = Number(totalDispatch) + Number(data.Quantity)


            console.log("AfterTodayDispatch", totalDispatch)

            let filter = { ProductUniqId: subfield }


            let updateOptionS = {
              $set: {


                "DailyProdDataArray.$[].yearArray.$[yearElem].monthArray.$[monthElem].datesArray.$[dateElem].Dispatch": totalDispatch,

              },


            };
            const arrayFilters = [
              { "yearElem.year": dateYear },
              { "monthElem.month": dateMonth },
              { 'dateElem.date': todayDate1 }

            ];

            const res = await productionData.updateOne(filter, updateOptionS, {
              arrayFilters,
            });

            console.log(res, "UPDATED")







          }
          else {

            res.send("Enter Amount Quatity is greater than Product")
            throw new Error("Enter Amount Quatity is grater than Product")
          }

        }
      }



    } catch (e) {
      console.log(e)
    }
    const data = await ProcessInvoice.countDocuments()

    let InvoiceNumber = `AMW-${data + 1}/23-24`
    let date = new Date()
    let dateday = date.getDate()
    let dateMonth = date.getMonth() + 1
    let dateYear = date.getFullYear()
    let todayDate1 = dateday + '/' + dateMonth + "/" + dateYear;
    console.log(todayDate1, "Today'SDATE")


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
        AcountObj["vehicalNumber"] = processData[0].vehicalNumber
        AcountObj["InvoiceNumber"] = InvoiceNumber
        AcountObj["InvoiceGeneratedDate"] = todayDate1
        AcountObj["PaymentType"]=req.body.PaymentType
        AcountObj["InitialPaidAmount"]=req.body.AmountPaid

      } else {
        AcountObj["Status"] = "pending"
        AcountObj["GSTNumber"] = req.body.GSTNumber,
          AcountObj["Name"] = req.body.Name,
          AcountObj["AmountPaid"] = req.body.AmountPaid,
          AcountObj["TotalAmount"] = processData[0].TotalAmount
        AcountObj["DueAmount"] = DueAmount
        AcountObj["AccountID"] = uniqId
        AcountObj["vehicalNumber"] = processData[0].vehicalNumber
        AcountObj["InvoiceNumber"] = InvoiceNumber
        AcountObj["InvoiceGeneratedDate"] = todayDate1
        AcountObj["PaymentType"]=req.body.PaymentType
        AcountObj["InitialPaidAmount"]=req.body.AmountPaid






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


        //  const sadata=await ProcessInvoice.updateOne({ _id: req.body._id },{$set:{
        //   InvoiceNumber:InvoiceNumber
        //  }})
      saveData = await ProcessInvoice.updateMany({ _id: req.body._id }, {
        $set: {
          Status: "completed"
          , AmountPaid: req.body.AmountPaid, DueAmount: DueAmount,
          InvoiceNumber:InvoiceNumber,
          InvoiceGeneratedDate:todayDate1
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
app.get("/getpendingquote",auth, async (req, res) => {
  try {
    const data = await ProcessInvoice.find({ Status: "pending" })
    res.status(200).send(data)

  } catch (e) {

  }

})
//Remove the Pending Task...
app.post("/removequote",auth, async (req, res) => {
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
app.post("/editquote",auth, async (req, res) => {


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

app.post("/getinvoiceData", auth,async (req, res) => {
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

app.get("/getProductList", auth,async (req, res) => {
  const user = await uploadData.find({}, { product: 1, ProductUniqId: 1 });
  res.send(user)
})

app.get('/logo',async(req,res)=>{
  const currentDirectory = __dirname;
const parentDirectory = path.join(currentDirectory, '..');
const ejsImgPath = path.join(parentDirectory,"views");
const imgPath = path.join(ejsImgPath,"image","amwlogo.png");


let imageUrl=imgPath
    
    res.sendFile(imgPath)
})


//getCompleted Invoice

app.get("/GenearatedInvoice",auth, async (req, res) => {
  try {
    const data = await ProcessInvoice.find({ Status: "completed" })
    res.send(data)

  } catch (e) {

  }
})

// get Account Data...

app.post("/getAccounts", auth,async (req, res) => {
  // const data = await ProcessInvoice.find({ Status: "completed" } ,{ AmountPaid: 1, 
  //   TotalAmount: 1,GSTNumber: 1,Name:1 
  //   ,DueAmount:1} )
  console.log(req.body)
  const data = await AccountData.find({ Status: req.body.status })
  res.send(data)

})

app.post('/updateAccount', auth,async (req, res) => {
  console.log(req.body,"POPOPOPO")
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
      { $set: { AmountPaid: finalAmount, DueAmount: DueAmount }
     })
     const data2 = await AccountData.updateMany({ AccountID: req.body.AccountID },
      { $push: { AmountEMI: req.body.AmountEMI }
     })
    console.log(data1)
    res.send(data1)
  }



})


app.post("/createuserforAdmin",auth, async (req, res) => {
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


app.get("/username",auth, async (req, res) => {
  const data = await CustmoreDetailsData.find({})
  res.send(data)
})

//Add the Production Stock
app.post("/createStock",auth, async (req, res) => {
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
    AvailableStock: 0,
    currentprodData: 0,
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
app.get("/getStock", auth,async (req, res) => {
  console.log(req.body, "414")



  try {
    let data = await productionData.find({})

    res.send(data)

  } catch (e) {

  }
})


// Daily Production Data
app.post("/submitDailyReport", auth,async (req, res) => {
  try {
    const newData = req.body;
    console.log(newData, "LL")

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;



    const updatePromises = newData.map(async (item) => {
      const filter = { ProductUniqId: item.ProductUniqId };


      const YearPresent = await productionData.find(
        {
          'DailyProdDataArray.yearArray': {
            $elemMatch: {
              year: item.year,

            }
          }
        })
      console.log(YearPresent, "LIP")


      //-----//------
      if (YearPresent.length === 0) {
        let newElementToAdd = []
        let monthArr = []
        let mainObj = {}
        let monthObj = {}


        monthObj["month"] = item.Month
        monthArr.push(monthObj)


        mainObj["year"] =  item.year
        mainObj["monthArray"] = item.Month


        newElementToAdd.push(mainObj)
        console.log(newElementToAdd)

        try {
          const result = await productionData.updateMany({}, {
            $push: {
              "DailyProdDataArray.$[].yearArray": newElementToAdd
            }
          });
         

        } catch (e) {
          console.log(e)
        }


      } 


      const monthPresent = await productionData.find(
        {
          'DailyProdDataArray.yearArray': {
            $elemMatch: {
              year: item.year,
              'monthArray.month': item.Month
            }
          }
        })


      const Stock = await productionData.find(
        {
          "ProductUniqId": item.ProductUniqId,
        })

      //Updating the Current Stock..
      let CURRENTSTOCK;
      if (Stock.length > 0) {
        console.log(Stock,"LKOBBBB")
        CURRENTSTOCK = Stock[0].AvailableStock;
        console.log(CURRENTSTOCK)
        console.log("CURRENTSTOCK", Stock, Stock[0].AvailableStock)

      }



      const datePresent = await productionData.findOne({
        ProductUniqId: item.ProductUniqId,
        "DailyProdDataArray.yearArray": {
          $elemMatch: {
            year: item.year,
            "monthArray.month": item.Month,
            "monthArray.datesArray.date": item.MonthDates
          }
        }
      });


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





      if (datePresent) {
        console.log("IN DATES Upadtaing ---------")
        //updating the Current Stock by removing previous one...
        // CURRENTSTOCK = Number(CURRENTSTOCK) - Number(Stock[0].currentprodData);


        //updating the new value for Date




        updateOptions = {
          $set: {


            "DailyProdDataArray.$[].yearArray.$[yearElem].monthArray.$[monthElem].datesArray.$[dateElem].prodData": item.todayProd,
            AvailableStock: Number(CURRENTSTOCK) + Number(item.todayProd),
            currentprodData: item.todayProd
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

        // userProduct Data
        let UserProductOptions = {
          $set: {
            quantity: Number(CURRENTSTOCK) + Number(item.todayProd),
          },
        }


        const user1 = await uploadData.updateMany(filter, UserProductOptions);
        console.log(user1, "lOUYH")



        return result;



      } else {

        console.log("IN DATES ADDING ---------")

        console.log(typeof (item.ProductUniqId), item.todayProd, typeof (item.todayProd), "KJHN")




        const userdata = await uploadData.findOne(
          { ProductUniqId: item.ProductUniqId },
        );
        console.log(userdata)
        let userData = Number(userdata.quantity) + Number(item.todayProd)
        const user1 = await uploadData.updateOne(
          { ProductUniqId: item.ProductUniqId },
          { $set: { quantity: userData } }
        );
        console.log(user1, "lOUYH")


        try {
          const AvailableStock = await productionData.findOne(
            { ProductUniqId: item.ProductUniqId }
          );
          console.log(AvailableStock, "LKIO")

          let TotaData = Number(AvailableStock.AvailableStock) + Number(item.todayProd)
          console.log(TotaData, "OPOPOP")
          // adding the data to Available stock...
          const AvailData = await productionData.updateOne(
            { ProductUniqId: item.ProductUniqId },
            { $set: { AvailableStock: TotaData } }
          );

          // storing the current Enter production Data  
          const AvailData1 = await productionData.updateOne(
            { ProductUniqId: item.ProductUniqId },
            { $set: { currentprodData: item.todayProd } }
          );



        } catch (error) {
          console.error("Update error:", error);
        }





        // adding the new Dates
        updateOptions = {
          $push: {
            "DailyProdDataArray.$[].yearArray.$[yearElem].monthArray.$[monthElem].datesArray": {
              date: item.MonthDates,
              prodData: item.todayProd,
            }


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



      //-----//------













    });

    const updateResults = await Promise.all(updatePromises);

    res.json(updateResults);
  } catch (error) {
    console.error("Error adding documents:", error);
    res.status(500).send("An error occurred while adding documents.");
  }
});

//Update the Daily-Production
app.post("/updateProduction", auth,async (req, res) => {
  try {
    const newData = req.body;
    console.log(newData, "LL")

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;



    const updatePromises = newData.map(async (item) => {
      const filter = { ProductUniqId: item.ProductUniqId };

      const YearPresent = await productionData.find(
        {
          'DailyProdDataArray.yearArray': {
            $elemMatch: {
              year: item.year,

            }
          }
        })
      console.log(YearPresent, "LIP")


      //-----//------
      // if (YearPresent.length === 0) {
      //   let newElementToAdd = []
      //   let monthArr = []
      //   let mainObj = {}
      //   let monthObj = {}


      //   monthObj["month"] = item.Month
      //   monthArr.push(monthObj)


      //   mainObj["year"] =  item.year
      //   mainObj["monthArray"] = item.Month


      //   newElementToAdd.push(mainObj)
      //   console.log(newElementToAdd)

      //   try {
      //     const result = await productionData.updateMany({}, {
      //       $push: {
      //         "DailyProdDataArray.$[].yearArray": newElementToAdd
      //       }
      //     });
         

      //   } catch (e) {
      //     console.log(e)
      //   }


      // } 


      const monthPresent = await productionData.find(
        {
          'DailyProdDataArray.yearArray': {
            $elemMatch: {
              year: item.year,
              'monthArray.month': item.Month
            }
          }
        })


      const Stock = await productionData.findOne(
        {
          "ProductUniqId": item.ProductUniqId,
        })

      //Updating the Current Stock..
      let CURRENTSTOCK;
      if (Stock) {
        // console.log(Stock,"LKOBBBB")
        CURRENTSTOCK = Stock.AvailableStock;
        // console.log(CURRENTSTOCK)
        console.log("CURRENTSTOCK", Stock)

      }



      const datePresent = await productionData.findOne({
        ProductUniqId: item.ProductUniqId,
        "DailyProdDataArray.yearArray": {
          $elemMatch: {
            year: item.year,
            "monthArray.month": item.Month,
            "monthArray.datesArray.date": item.MonthDates,
           
          }
        }
      })
      
      
       // Replace with the Hsno you want to search for

     const doc= await productionData.findOne(filter )
  // Access the 'datesArray' for the first date in the first month of the first year
  const datesArray = doc.DailyProdDataArray[0]?.yearArray[0]?.monthArray[0]?.datesArray;
   let finalValue;
  if (datesArray) {
    datesArray.forEach((items)=>{
      if(items.date === item.MonthDates){
           let prevValue=Number( items.prodData)
           let currentValue=Number(item.todayProd)
           finalValue=prevValue - currentValue

      }
    })
       
    console.log("Dates Array:", finalValue);
  } else {
    console.log("No Dates Array found for the specified document.");
  }




    


    

      let updateOptions
      //adding the month
      // if (monthPresent.length === 0) {

      //   let montharr = []
      //   let monthobj = {}
      //   monthobj["month"] = item.Month
      //   montharr.push(monthobj)

      //   const result = await productionData.updateMany({}, {
      //     $push: {
      //       "DailyProdDataArray.$[].yearArray.$[].monthArray": montharr
      //     }
      //   })
      //   console.log(result)

      // }





      if (datePresent) {
        console.log("IN DATES Upadtaing ---------")
        //updating the Current Stock by removing previous one...
        // CURRENTSTOCK = Number(CURRENTSTOCK) - Number(Stock[0].currentprodData);


        //updating the new value for Date


        // Number(CURRENTSTOCK) + Number(item.todayProd)

        let FinalQuatity=Number(CURRENTSTOCK) - finalValue
        console.log(FinalQuatity,"SS")
        
        let UserProductOptions = {
          $set: {
            quantity: FinalQuatity
          },
        }

        updateOptions = {
          $set: {


            "DailyProdDataArray.$[].yearArray.$[yearElem].monthArray.$[monthElem].datesArray.$[dateElem].prodData": item.todayProd,
            AvailableStock: FinalQuatity,
            currentprodData: item.todayProd
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

        // userProduct Data
        


        const user1 = await uploadData.updateMany(filter, UserProductOptions);
        console.log(user1, "lOUYH")



        return result;



      } 
      
      // else {

      //   console.log("IN DATES ADDING ---------")

      //   console.log(typeof (item.ProductUniqId), item.todayProd, typeof (item.todayProd), "KJHN")




      //   const userdata = await uploadData.findOne(
      //     { ProductUniqId: item.ProductUniqId },
      //   );
      //   console.log(userdata)
      //   let userData = Number(userdata.quantity) + Number(item.todayProd)
      //   const user1 = await uploadData.updateOne(
      //     { ProductUniqId: item.ProductUniqId },
      //     { $set: { quantity: userData } }
      //   );
      //   console.log(user1, "lOUYH")


      //   try {
      //     const AvailableStock = await productionData.findOne(
      //       { ProductUniqId: item.ProductUniqId }
      //     );
      //     console.log(AvailableStock, "LKIO")

      //     let TotaData = Number(AvailableStock.AvailableStock) + Number(item.todayProd)
      //     console.log(TotaData, "OPOPOP")
      //     // adding the data to Available stock...
      //     const AvailData = await productionData.updateOne(
      //       { ProductUniqId: item.ProductUniqId },
      //       { $set: { AvailableStock: TotaData } }
      //     );

      //     // storing the current Enter production Data  
      //     const AvailData1 = await productionData.updateOne(
      //       { ProductUniqId: item.ProductUniqId },
      //       { $set: { currentprodData: item.todayProd } }
      //     );



      //   } catch (error) {
      //     console.error("Update error:", error);
      //   }





      //   // adding the new Dates
      //   updateOptions = {
      //     $push: {
      //       "DailyProdDataArray.$[].yearArray.$[yearElem].monthArray.$[monthElem].datesArray": {
      //         date: item.MonthDates,
      //         prodData: item.todayProd,
      //       }


      //     }

      //   };

      //   const arrayFilters = [
      //     { "yearElem.year": item.year },
      //     { "monthElem.month": item.Month },

      //   ];

      //   const result = await productionData.updateMany(filter, updateOptions, {
      //     arrayFilters,
      //   });




      //   return result;

      // }



      //-----//------













    });

    const updateResults = await Promise.all(updatePromises);

    res.json(updateResults);
  } catch (error) {
    console.error("Error adding documents:", error);
    res.status(500).send("An error occurred while adding documents.");
  }
});

//on year change for Daily Production

app.post("/dateChange", auth,async (req, res) => {
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

app.get("/Dashboard",auth, async (req, res) => {
  try {
    const data = await productionData.find({}, 'DailyProdDataArray')
    console.log(data)
    res.send(data)

  } catch (error) {

  }
}
)

//Dispatch Api..

app.post("/dispatch",auth, async (req, res) => {
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




app.post('/downloadInvoice', auth,async (req, res) => {

  
  let obj = {};

  obj = req.body.InvoiceProduct

  console.log(obj, "KKKKK")


  let date = new Date()
  let dateday = date.getDate()
  let dateMonth = date.getMonth() + 1
  let dateYear = date.getFullYear()

  let todayDate = req.body.InvoiceGeneratedDate
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




  // for (let i = 0; i <= Amount.length - 1; i++) {
  //   TotaAmount = TotaAmount + Amount[i]
  //   TotalQuatity = TotalQuatity + quantity[i]
  // }
  TotaAmount=req.body.TotalAmount
  TotalQuatity=req.body.TotalQuatity


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




  

    GSTNumber = req.body.GSTNumber
    Name = req.body.Name
    phonenumber = req.body.phonenumber
    address = req.body.address
    vehicalNumber = req.body.vehicalNumber
    InvoiceNumber = req.body.InvoiceNumber

  console.log(GSTNumber, Name)
  let total = "500"
  let subTotal = "485"
  let stateTax = "9"
  let centralTax = "9"
  let totalQuatity = "22"
  let GrandTotal = "518"
  let TotalGst = "18"

  //  console.log(req?.body?.Status ,"FFF")

  
  const currentDirectory = __dirname;
  const fs = require('fs');

// Construct the path to the parent directory
const parentDirectory = path.join(currentDirectory, '..');
const ejsTemplatePath = path.join(parentDirectory,"views","index.ejs");
  console.log(parentDirectory,ejsTemplatePath)
  const ejsTemplate = fs.readFileSync(ejsTemplatePath, 'utf8');
let imageUrl="http://localhost:3000/logo"

  try {
    // const html = ejs.render(ejsTemplate, { name: 'John' });
    let html
    try{
    html = await ejs.renderFile(ejsTemplatePath, 
        {
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
            wordsData,
            imageUrl
    
    
          });
     console.log(html,"HTLML")

     const browser = await puppeteer.launch({
      args:[
        "--disable-setuid-sandbox",
        "--single-process",
        "--no-sandbox",
        "--no-zygote"
      ],
      executablePath:process.env.PUPPETEER_EXECUTABLE_PATH

     });
     const page = await browser.newPage();
   
     // Read the .ejs file content
   
   
     // Set the content of the page with your HTML content
     await page.setContent(html);
   
     // Generate a PDF
     const pdfBuffer = await page.pdf();
   
     // Convert the PDF to Base64
     const base64PDF = pdfBuffer.toString('base64');
   
     // Set the content type to application/pdf
     const base64PDFWithContentType = `data:application/pdf;base64,${base64PDF}`;
   
     console.log(base64PDFWithContentType);


     res.send(base64PDFWithContentType)


     await browser.close();
   








    //  const base64Data = Buffer.from(html).toString('base64');

    //  console.log(base64Data);

    //  const browser = await puppeteer.launch({
    //    headless: "new", // Opt into the new headless mode
    //    // ...other options
    //  });
     
    //  const page = await browser.newPage();
    //  const s=await page.setContent(html, { waitUntil: 'networkidle0' });
    //  console.log(s)

  //    const r=await page.screenshot({ path: 'screenshot.png' });
  // console.log(r)

     
     // Use page.setContent with waitUntil option
    
     
  //    const pdfBuffer = await page.pdf();
  // console.log(pdfBuffer)

    //  await browser.close();

    //  res.setHeader('Content-Type', 'application/pdf');
    //  res.setHeader('Content-Disposition', 'attachment; filename=example.pdf');
    //  res.send(base64Data);





    }catch(e){
      console.log(e)

    }
   
    
   
   
    
     
      
    

  } catch (e) {
    console.log(e, "ONGF")
  }


})
















module.exports = app;
