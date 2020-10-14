const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const travelCardSchema =  new Schema({
    userId:{
        type:String,
        unique:true
    },
    balance:{
        type:Number,
    }
});

const Travelcard = mongoose.model('TravelCard',travelCardSchema,'travelcard');
module.exports = Travelcard;