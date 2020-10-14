const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const touristCardSchema =  new Schema({
    userId:{
        type:String,
        unique:true
    },
    km:{
        type:Number,
    }
});

const Touristcard = mongoose.model('TouristCard',touristCardSchema,'touristcard');
module.exports = Touristcard;