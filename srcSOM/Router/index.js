const express = require("express");
const Schema = require("../../src/userSchema/index");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const User = require("../../src/userSchema/index");
const auth = require("../../src/middleware/auth");
const { error } = require("console");
const res = require("express/lib/response");
const mostwatched = require("../../src/userSchema");
const mostwatchedAuth = require("../../src/middleware/mostwatchedCount");


const {DataSchema,
  UserDataUrl } = require("../../src/userSchema/UrlDataSchema");

const {
  jsonData,
  UploadedData,
  SuggestionData,
  
} = require("../../src/userSchema/jsontransform");


const app = express();


app.use(bodyParser.json());
console.log("In Routers");



app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);




//..........update of the jsontransform ........







//................yet to update..........
//jsonTransform......
// app.get("/jsontransform", auth, async (req, res) => {
//   const user = new jsonData.find({});
//   res.send(user);
// });
app.post("/newupdates", auth, async (req, res) => {
  try {
    const user = await jsonData.findOne({ username: req.body.username });
    if (user) {
      await jsonData.updateOne(
        {
          username: req.body.username,
        },
        {
          $set: {
            "mostwatched.owner": req.body.owner,
            "mostwatched.contentUrl": req.body.contentUrl,
            "mostwatched.tag": req.body.tag,
          },
        }
      );
    }
    if (!user) {
      res.status(500).send("user is not found");
      throw new Error();
    }
  } catch (e) {
    res.status(500).send("internal server error");
    throw new Error();
  }
});

app.post("/garphData", auth, async (req, res) => {
  try {
    const user = await jsonData.findOne({ username: req.body.username });
    if (user) {
      await jsonData.updateOne(
        {
          username: req.body.username,
        },
        {
          $set: {
            "mostwatched.username": req.body.username,
            "mostwatched.contentUrl": req.body.contentUrl,
            "mostwatched.count": req.body.count,
            "mostwatched.tag": req.body.tag,
            "mostwatched.color": req.body.color,
          },
        }
      );
    }
    if (!user) {
      res.status(500).send("user is not found");
      throw new Error();
    }
  } catch (e) {
    res.status(500).send("internal server error");
    throw new Error();
  }
});














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
  const user = new Schema(request.body);
  try {
    await user.save();
   
    response.send(user);
  } catch (e) {
    console.log("error", e);
  }
});



//.....According to preference of user recoommeded URL....
//need to set when user is sign in....
app.post('/user/preference',async(req,res)=>{
  console.log(req.body)
try{

     var data12=await DataSchema.find({"tag":req.body.tag})
     console.log(data12)
     var commonData=await DataSchema.find({})
     var limitData = await DataSchema.find({}).sort({_id:-1}).limit(6)
     var jsData= new UploadedData({
      "username":req.body.username,
      "data":{
        "commonData":commonData,
        "newupdates":limitData,
        "preference":data12

      }
    })
    await jsData.save()
  //  var commonURl =await UploadedData.updateMany(
  //     { username: req.body.username },
  //     { $addToSet: { "data.commonData": commonData }
  //      })
  //     var UploadedURl =await UploadedData.updateMany(
  //       { username: req.body.username },
  //       { $addToSet:{"data.newupdates": limitData } })

  //       var preference=await UploadedData.updateMany(
  //         { username: req.body.username },
  //         { $addToSet: { "data.preference": data }
  //          })
  
res.send(data12)
}catch(e){
console.log(e)

}
})

//.............get the Tag from DB..............
app.get('/user/tags',async(req,res)=>{
    try{
       const tags= await DataSchema.find({},{tag:1})
       res.send(tags)
    }catch(e){

    }
})



//############## SIGN UP PAGE ######################






//#################### Login PAGE ############################

// logging the User.....
app.post("/user/login", async (req, res) => {
  console.log("in Login", req.body);
  try {
    const user = await Schema.findByCredentials(
      req.body.email,
      req.body.password
    );
    console.log(user);
    const token = await user.generateAuthToken();
    console.log(token);
    // user.save();
    res.send({ user });
  } catch (e) {
    console.log("SFG", e);
  }
});


//#################### Login PAGE ############################



//#################### ADMIN PAGE ############################

//.........Admin Upload End point ........
app.post("/upload", auth, async (req, res) => {
  console.log(req.body);
   const DataUrlData = new DataSchema(req.body.data);
  try {
    await DataUrlData.save();
    const urlData = await UserDataUrl.updateMany({"orginalURL":req.body.orginalURL},{"scrutinyFlag":req.body.scrutinyFlag})
      console.log(urlData)
        
    res.status(200).send(DataUrlData);
  } catch (e) {
    throw new error(e);
  }
});
//...... Orginal URL need to provide content URL .....
app.get("/getuserurl",async(req,res)=>{
   
  try{
   const urlData =await UserDataUrl.find({"scrutinyFlag":false})
   res.send(urlData)

  }
  catch(e){

  }
})
//...........service for Upload content URL from the user url data By Admin.........
app.post("/newData", async (req, res) => {
  console.log("in NEW DATA", req.body);
  let Data = new UploadedData(req.body);

  try {
    await Data.save();
    res.send(Data);
  } catch (e) {
    console.log(e);
  }
});
//........URL Data Amid can only Access this page Pending......
app.get("/getData", auth, async (req, res) => {
  try {
    await DataSchema.find({}).then((ress) => {
      res.send(ress);
    });
  } catch (e) {
    throw new Error(e);
  }
});
//#################### ADMIN PAGE ############################






//#################### USER PAGE ############################



//.........user Upload End point ............
app.post("/user/upload", auth, async (req, res) => {
  console.log(req.body);
  const DataUrl = new UserDataUrl(req.body);
  try {
    await DataUrl.save();
    res.status(200).send(DataUrl);
  } catch (e) {
    throw new error(e);
  }
});

//.....specific user Dashboard Api.....
app.get("/jsontransform/:username", async (req, res) => {
  console.log("in JSON",req.params.username)

  try {
    var commonData=await DataSchema.find({})
        var commonURl =await UploadedData.updateMany(
      { username: req.params.username },
      { $addToSet: { "data.commonData": commonData }
       })
   
    let data = await UploadedData.findOne({ username: req.params.username});
    res.send(data);
  } catch (e) {

  }
});

// suggestion End-point....
app.post("/suggested", async (req, res) => {
  console.log(req.body.data);
  try {
    // const user = await jsonData.findOne({ username: req.body.username });
    const user = new SuggestionData(req.body,req.body.data.sendData );
    const updatedData = await UploadedData.find({ username: req.body.To });
    if (updatedData) {
      await UploadedData.updateMany(
        { username: req.body.To },
        { $addToSet: { "data.Suggestion": req.body.data.sendData } }
      );
    }
    if (!updatedData) {
      res.status(400).send("User is not found");
      throw new Error();
    }

    try {
      await user.save();
      res.send(user);
    } catch (e) {
      res.status(500).send("something went wrong");
      //   throw new Error();
    }
    // if (user) {
    // await jsonData.updateOne(
    //   {
    //     username: req.body.username,
    //   },
    //   {
    //     $set: {
    //       "mostwatched.from": req.body.from,
    //       "mostwatched.contentUrl": req.body.contentUrl,
    //       "mostwatched.tag": req.body.tag,
    //       "mostwatched.Comment": req.body.Comment,
    //       "mostwatched.likes": req.body.likes,
    //     },
    //   }
    // );
    // }
    // if (!user) {
    //   res.status(500).send("user is not found");
    //   throw new Error();
    // }
  } catch (e) {
    res.status(500).send("internal server error");
    throw new Error();
  }
});

///......................................................
//....mostwatched video need the input from front end  .......


// front End...
// {
//   username:"",
//   data:{
//     contentURL,
//     frequency,
//     tag
//   }
// }

app.post("/mostwatched", mostwatchedAuth, async (req, res) => {
      console.log("IN",req.body)
  try {
    const user = await UploadedData.findOne({ username: req.body.username });

    if (user) {
      await UploadedData.updateMany(
            { username: req.body.username },
            { $addToSet: { "data.mostwatched": req.body.data } }
          );
    }
    if (!user) {
      res.status(500).send("user is not found");
      throw new Error();
    }
    
  } catch (e) {
    res.status(500).send("internal server error");
    throw new Error();
  }
});
///......................................................

//logout from All Device...
app.post("/user/logoutAll", auth, async (req, res) => {
  console.log("in logOut All");
  try {
    req.user.token = [];
    await req.user.save();
    res.send();
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
    res.send();
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});





//#################### USER PAGE ############################
















////practicing code....


// checking Authorized......
app.get("/users/me", auth, async (req, res) => {
  res.send(req.user);
  //   try{
  //     const user=await Schema.find({})
  //     res.send(user)

  //   }catch(e){
  //     console.log(e)

  //   }
});
//testing ....
app.get("/getuser/:id/", async (req, res) => {
  var _id = req.params.id;

  var s = await Schema.findById(_id).then((ress) => {
    res.send(ress);
  });
  console.log(s);

  // try{
  //     // res.send(s)

  // }catch(error){
  //     res.status(500).send(error)

  // }
});



///Email...









 // console.log(data);
    // let suggestedData = await SuggestionData.findOne({ To: req.body.username });
    // if (suggestedData) {
    //   console.log(
    //     suggestedData,
    //     suggestedData.data.sendData,
    //     data.data.Suggestion,
    //     data.data.Suggestion.length
    //   );
    //   let totalData = await UploadedData.updateMany(
    //     { username: req.body.username },
    //     { $addToSet: { "data.Suggestion": suggestedData.data.sendData } }
    //   );
    //   console.log(data);
    // }





module.exports = app;
