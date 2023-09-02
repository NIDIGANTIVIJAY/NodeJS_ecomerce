const { default: mongoose } = require("mongoose")


const ProductionData = new mongoose.Schema({

    // stockId: {
    //     type: String,
    //     trim: true,


    // },
    Hsno: {
        type: String,
        trim: true,

    },

    DailyProdDataArray: [

        {

            yearArray: [
                {

                year: {
                    type: String,
                    trim: true
                },


                monthArray: [{
                   

                        month: {
                            type: String,
                            trim: true
                        },

                        datesArray: [{
                            date: {
                                type: String,
                                trim: true,
                            },
                            prodData: {
                                type: String,
                                trim: true,
                            },
                            Dispatch:{
                                type: String,
                                trim: true,
                                default:0

                            }

                        }]
                    


                }],

            
            
            }
        
             ]





        }









    ],

    Dispatch:{
        type: String,
        trim: true,

    },




    imageData:{
        type:Buffer
    },
   
  description: {
    type: String,
    trim: true,
  },
  price: {
    type: String,
    trim: true,
  },
  item: {
    type: String,
    trim: true,
  },
  product: {
    type: String,
    trim: true,
    
    
  },

  weight: {
    type: Number,
    trim: true,
  },

  ProductUniqId: {
    type: String,
    trim: true,
  },
  size:{
    type: String,
    trim: true,

  },

  AvailableStock:{
    type: String,
    trim: true,
    default:0
  },
  currentprodData:{
    type: String,
    trim: true,

  }



})

const productionData = new mongoose.model("Inventory", ProductionData)
module.exports = productionData
