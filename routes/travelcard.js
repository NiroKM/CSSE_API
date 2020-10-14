const express = require('express');
const router = express.Router();

const TravelCard = require('../models/travelcard.model');
const User = require('../models/user.model');



// Method         : GET
// Header         : Content-Type:application/json
// Params         : None
// Body           : None
// Return         : Single Literal Object (HTTP Standard status codes (200 || 403 || 400 || 500))
// Description    : get All Travel Card details
// Multi Factor Auth : None
router.get('/', async(req,res,next)=>{
    try{
        console.log('Working');
        let TravelCarddata = await TravelCard.find({});
        console.log(TravelCarddata);
        res.status(200).json(TravelCarddata);
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
        let travelCardData = await TravelCard.findById(req.params.id);
        let userdata = await User.findById(travelCardData.userId);
        let user={}
        user.userId = userdata._id,
        user.username = userdata.username,
        user.email = userdata.email,
        user.fullname = userdata.fullname,
        user.phone_number = userdata.phone_number,
        user.userType = userdata.userType

        const travelCardAndUserData={}
        travelCardAndUserData.travelCardId = travelCardData._id,
        travelCardAndUserData.travelCardBalance = travelCardData.balance,
        travelCardAndUserData.user = user

        console.log(userdata);
        res.status(200).json(travelCardAndUserData);
        }catch(err){
        res.status(500).json(err);
    }
})

// Method         : POST
// Header         : Content-Type:application/json
// Params         : None
// Body           : userId
// Return         : Single Literal Object (HTTP Standard status codes (200 || 403 || 400 || 500))
// Description    : Creates a new Travel Card with Balance amount 1000
// Multi Factor Auth : None
router.post('/',async(req,res,next)=>{
    try{
        const obj = new TravelCard({
            userId: req.body.userId,
            balance : 1000.00
        })
        let TravelCardData = await obj.save();
        res.status(200).json(TravelCardData);
    }catch(err){
        res.status(500).json(err)
    }
})

// Method         : PUT
// Header         : Content-Type:application/json
// Params         : travel card id
// Body           : amount
// Return         : Single Literal Object (HTTP Standard status codes (200 || 403 || 400 || 500))
// Description    : Update the Travel card value with the balance if punch amount greater than balance return error msg: Insufficient balance in Card
// Multi Factor Auth : None
router.put('/:id',async(req,res,next)=>{
    try{
        let cardData = await TravelCard.findById(req.params.id);
        let availableBalance = cardData.balance - req.body.amount;
        if(availableBalance<0){
            res.status(200).json('Insufficient balance in Card');
        }else{
            let UpdateData = TravelCard.findByIdAndUpdate({_id:req.params.id},{balance:availableBalance},{new:true},async (err,resp)=>{
                if(err){
                    console.log(err);
                }else{
                    let travelCardData = await TravelCard.findById(resp._id);
                    let userdata = await User.findById(resp.userId);
                    let user={}
                    user.userId = userdata._id,
                    user.username = userdata.username,
                    user.email = userdata.email,
                    user.fullname = userdata.fullname,
                    user.phone_number = userdata.phone_number,
                    user.userType = userdata.userType
            
                    const travelCardAndUserData={}
                    travelCardAndUserData.travelCardId = travelCardData._id,
                    travelCardAndUserData.travelCardBalance = travelCardData.balance,
                    travelCardAndUserData.user = user 
                    res.status(200).json(travelCardAndUserData);
                }
            });
        }
    }catch(err){
        res.status(500).json(err)
    }
})

module.exports = router;