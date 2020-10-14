const express = require('express');
const router = express.Router();
const passwordHash = require('password-hash');
const jwt= require('jsonwebtoken');

let User = require('../models/user.model');

// Method         : GET
// Header         : Content-Type:application/json
// Params         : None
// Body           : None
// Return         : Single Literal Object (HTTP Standard status codes (200 || 403 || 400 || 500))
// Description    : get All User details
// Multi Factor Auth : None
router.get('/', async(req,res,next)=>{
    try{
        let userdata = await User.find({});
        res.status(200).json(userdata);
    }catch(err){
        res.status(500).json(err)
    }
});

// Method         : POST
// Header         : Content-Type:application/json
// Params         : None
// Body           : User Details
// Return         : Single Literal Object (HTTP Standard status codes (200 || 403 || 400 || 500))
// Description    : Add Users
// Multi Factor Auth : None
router.post('/', async(req,res,next)=>{
    try{

        var hashedPassword = passwordHash.generate(req.body.password);
        console.log('hashed:'+hashedPassword);

        const obj = new User({
            username : req.body.username,
            email : req.body.email,
            password : hashedPassword,
            fullname : req.body.fullname,
            phone_number : req.body.phone_number,
            userType : req.body.userType,
            isAdmin : req.body.isAdmin,
       });

        const insertedData = await obj.save();
        res.status(200).json(insertedData);

    }catch(err){
        res.status(500).json(err);
    }
});


// Method         : POST
// Header         : Content-Type:application/json
// Params         : None
// Body           : Username, Password
// Return         : Single Literal Object (HTTP Standard status codes (200 || 403 || 400 || 500))
// Description    : Check if User Available
// Multi Factor Auth : None
router.post('/login', async(req,res,next)=>{
    try{

        
        let data = await User.findOne({
                    username:req.body.username,
                    }).exec();
        if(data!=null){
            if(passwordHash.verify(req.body.password, data.password)){
                const token=jwt.sign({
                    username:data.username,
                    userId:data._id
                },
                process.env.JWT_KEY,
                {
                    expiresIn:"1h"
                }
                )
                res.status(200).json({
                    message:'Auth Successfull!',
                    token:token
                });
            }else{
                res.status(200).json('Invalid Credentials');
            }
        }else{
            res.status(404).json('User not Available');
        }

    }catch(err){
        res.status(500).json(err);
    }
})

module.exports = router;

