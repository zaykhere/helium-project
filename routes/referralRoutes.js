const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const {protect} = require("../middlewares/auth");
const Referral = require("../models/Referral");

//Add A Referral
router.post("/", protect, asyncHandler(async(req,res)=>{
    const {name, email, hntAddress, mobile} = req.body;
  
    
    let referral = new Referral({
        name,
        email,
        hntAddress,
        mobile,
        user: req.user._id
    });
    await referral.save();
    res.redirect("/hpr");
}));

// Get The referral 
router.get("/referrals", protect, asyncHandler(async(req,res)=>{
    const referrals = await Referral.find({user: req.user._id});
    if(!referrals) return res.send(null);
    res.json({referrals});
}));

router.get("/referral/:id", protect, asyncHandler(async(req,res)=> {
    const referral = await Referral.findOne({_id: req.params.id});
    if(!referral) return res.send(null);
    res.json({referral});
}))

// Add Payment to the referral
router.put("/savereferral/:id", protect, asyncHandler(async(req,res)=>{
    const referral = await Referral.findOne({_id: req.params.id});
    if(!referral) return res.send("Error! referral not found");
    referral.toBePaid = req.body.toBePaid; 
    await referral.save();
    res.json({referral});
}))

//Finish Paying to the referral
router.put("/payreferral/:id", protect, asyncHandler(async(req,res)=>{
    const referral = await Referral.findOne({_id: req.params.id});
    if(!referral) return res.send("Error! No referral found");
    console.log(referral);
    referral.toBePaid = referral.toBePaid - req.body.paid;
   
    if(referral.paid) {
        console.log(referral.paid);
        referral.paid= referral.paid + req.body.paid;
        await referral.save();
        res.json({referral});
    }
    else {
    referral.paid = req.body.paid;
    await referral.save();
    res.json({referral});
    }
}))

module.exports = router;