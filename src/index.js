const process=require('process');
const express =require('express');
const mongoose = require('mongoose');
var MongoClient = require('mongodb').MongoClient;

var router =require('./Router/index')
var cors = require('cors')
const auth=require('./middleware/auth')

require('dotenv').config()



const app = express();


//cross-Orgin....

app.use(cors({
  origin: '*',
  methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH']
}));



app.use(express.json());

// mkiddleware fun for Site maintance....
// app.use((req,res,next)=>{
//   res.status(503).send("site is under maintenace")
// })


const mongoURL=process.env.MongodbURL + "AMW_PROD_Collection"
// console.log(mongoURL)
//'mongodb://localhost:27017/eshop'
//DB Connection....
mongoose.connect(mongoURL, {useNewUrlParser: true});
var connection = mongoose.connection;
connection.on('connected', function() {
    console.log('database is connected successfully');
});




//import of Routes...
app.use(router)
 const port=process.env.PORT || 3000
  console.log("port",port);
//Application is started....
app.listen(port,()=>{
  console.log("app is running on 3000")
})









// const database = client.db('nodeapp');
// const collection = database.collection('User');
// user.save().then(function (doc) {
//   console.log(doc._id.toString());
// }).catch(function (error) {
//   console.log(error);
// });

// app.post('/addUser',async (request,response)=>{
  
// })
// app.get('/getlogin', async function (req, res) {

      // console.log(client.Collection,conn,client.Document)
      // console.log(conn.collections('nodeapp'))
    // let r = await db.collection("nodeapp").find(query).toArray();
    // return res.send(r);
  

  // res.send('Data Base Values',collection)
//})













// app.listen(3000,()=>{
//     console.log("Port is running on 3000")
// })

// module.exports = conn;