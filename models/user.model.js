const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema =  new Schema({
    username :{
        type:String,
        unique:true,
        required:true
    },
    email :{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    fullname:{
        type:String,
        required:true
    },
    phone_number:{
        type:String,
        required:true
    },
    userType:{
        type:String,
    },
    isAdmin:{
        type:Boolean,
        required:true
    }
});

const Users = mongoose.model('Users',userSchema);

module.exports = Users