const express = require('express');
const router = express.Router();

const TouristCard = require('../models/touristcard.model');
const User = require('../models/user.model');

// Method         : GET
// Header         : Content-Type:application/json
// Params         : None
// Body           : None
// Return         : Single Literal Object (HTTP Standard status codes (200 || 403 || 400 || 500))
// Description    : get All Tourist Card details
// Multi Factor Auth : None
router.get('/', async(req,res,next)=>{
    try{
        console.log('Working');
        let TouristCarddata = await TouristCard.find({});
        console.log(TouristCarddata);
        res.status(200).json(TouristCarddata);
    }catch(err){
        res.status(500).json(err)
    }
});


// Method         : GET
// Header         : Content-Type:application/json
// Params         : CardId
// Body           : None
// Return         : Single Literal Object (HTTP Standard status codes (200 || 403 || 400 || 500))
// Description    : get Card details and User details
// Multi Factor Auth : None
router.get('/:id', async(req,res,next)=>{
    try{
        let TouristCardData = await TouristCard.findById(req.params.id);
        let userdata = await User.findById(TouristCardData.userId);
        let user={}
        user.userId = userdata._id,
        user.username = userdata.username,
        user.email = userdata.email,
        user.fullname = userdata.fullname,
        user.phone_number = userdata.phone_number,
        user.userType = userdata.userType

        const touristCardDataAndUserData={}
        touristCardDataAndUserData.touristCardDataId = TouristCardData._id,
        touristCardDataAndUserData.touristCardDatakm = TouristCardData.km,
        touristCardDataAndUserData.user = user

        console.log(userdata);
        res.status(200).json(touristCardDataAndUserData);
        }catch(err){
        res.status(500).json(err);
    }
})

// Method         : POST
// Header         : Content-Type:application/json
// Params         : None
// Body           : userId
// Return         : Single Literal Object (HTTP Standard status codes (200 || 403 || 400 || 500))
// Description    : Creates a new Tourist Card with initial km 500
// Multi Factor Auth : None
router.post('/',async(req,res,next)=>{
    try{
        const obj = new TouristCard({
            userId: req.body.userId,
            km : 500.00
        })
        let TouristCardData = await obj.save();
        res.status(200).json(TouristCardData);
    }catch(err){
        res.status(500).json(err)
    }
})


// Method         : PUT
// Header         : Content-Type:application/json
// Params         : travel card id
// Body           : kmamount
// Return         : Single Literal Object (HTTP Standard status codes (200 || 403 || 400 || 500))
// Description    : Update the Tourist card value with the balance if punch km greater than available km return error msg: Insufficient km in Card
// Multi Factor Auth : None
router.put('/:id',async(req,res,next)=>{
    try{
        let cardData = await TouristCard.findById(req.params.id);
        let availableBalanceKm = cardData.km - req.body.kmamount;
        if(availableBalanceKm<0){
            res.status(200).json('Insufficient km in Card');
        }else{
            let UpdateData = await TouristCard.findByIdAndUpdate({_id:req.params.id},{km:availableBalanceKm},{new:true},async (err,resp)=>{
                if(err){
                    console.log(err);
                }else{
                    let TouristCardData = await TouristCard.findById(resp._id);
                    let userdata = await User.findById(resp.userId);
                    let user={}
                    user.userId = userdata._id,
                    user.username = userdata.username,
                    user.email = userdata.email,
                    user.fullname = userdata.fullname,
                    user.phone_number = userdata.phone_number,
                    user.userType = userdata.userType
            
                    const touristCardDataAndUserData={}
                    touristCardDataAndUserData.touristCardDataId = TouristCardData._id,
                    touristCardDataAndUserData.touristCardDatakm = TouristCardData.km,
                    touristCardDataAndUserData.user = user 
                    res.status(200).json(touristCardDataAndUserData);
                }
            });
        }
    }catch(err){
        res.status(500).json(err)
    }
})

module.exports = router;