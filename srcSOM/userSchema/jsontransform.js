var mongoose = require("mongoose");

var jsontransform = new mongoose.Schema({
  data: 
    {
      type:Object,
    username:{
      type: String,
        },
      mostwatched: {
        contentUrl: String,
        frequency: Number,
        tag: String,
        
      },
      suggestion: {
        contentUrl: String,
        from: String,
        Comment: String,
        tag: String,
        likes: String,
      },
      newupdates: {
        contentUrl: String,
        owner: String,
        tag: String,
      },
      GarphData: {
        username: String,
        contentUrl: String,
        color: String,
        count: String,
        tag: String,
      },
      publish:{
        type:Boolean
      }
    },
  
});

var uploadedData= new mongoose.Schema({
   username:{type:String,  unique: true, trim:true},
    data:{
      GarphData:[{
        contentUrl: String,
        color: String,
         tag: String,
      }],
      newupdates:[{
        orginalUrl:String,
        contentUrl: String,
         owner: String,
         tag: String,
      }],
      Suggestion:[{
        contentUrl: String,
       Comment: String,
       tag: String,
        likes: String,
      }],
      mostwatched:[{
        contentUrl:String,
        tag:String,
        frequency:Number
      }],
      preference:[{
        contentUrl: String,
        tag: String,
        pornstart:String

      }],
      commonData:[
        {
          contentUrl: String,
          tag: String,
          pornstart:String

        }
      ]
      

    }
})

// find the mostwatched from DB......
// const mostwatched= new mongoose.Schema({
//   username: String,
//   contentUrl: String,
//   frequency: Number,
//   tag: String,
// })



// const mostwatched = new mongoose.Schema({
//   contenturl: {
//     type: String,
//   },
//   frequency: {
//     type: Number,
//   },
//   contenturl: {
//     type: String,
//   },
//   tag: {
//     type: String,
//   },
// });
const Suggestion = new mongoose.Schema({
   To:String,
  data:{
    sendData:[{
      from: String,
    contentUrl: String,
    Comment: String,
    tag: String,
    likes: String,
  }] 

}
 
  
});
  const SuggestionData= new mongoose.model('SuggestData',Suggestion)
const jsonData = new mongoose.model("Dashbord", jsontransform);
const UploadedData = new mongoose.model("Dashbord1", uploadedData);
// const MostUser = new mongoose.model("Frequent", mostwatched);
// const suggestion = new mongoose.model("Suggestion", Suggestion);

 module.exports={jsonData:jsonData,UploadedData: UploadedData,SuggestionData:SuggestionData}
// module.exports = {jsonData:jsonData;
