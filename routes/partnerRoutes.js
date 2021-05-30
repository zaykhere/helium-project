const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const {protect} = require("../middlewares/auth");
const Partner = require("../models/Partner");

//Add A Partner
router.post("/", protect, asyncHandler(async(req,res)=>{
    const {name, email, hntAddress, mobile} = req.body;
   
    
    let partner = new Partner({
        name,
        email,
        hntAddress,
        mobile,
        user: req.user._id
    });
    await partner.save();
    res.redirect("/hpr");
}));

// Get The partner 
router.get("/partners", protect, asyncHandler(async(req,res)=>{
    const partners = await Partner.find({user: req.user._id});
    if(!partners) return res.send(null);
    res.json({partners});
}));

router.get("/partner/:id", protect, asyncHandler(async(req,res)=> {
    const partner = await Partner.findOne({_id: req.params.id});
    if(!partner) return res.send(null);
    res.json({partner});
}))

// Add Payment to the partner
router.put("/savepartner/:id", protect, asyncHandler(async(req,res)=>{
    const partner = await Partner.findOne({_id: req.params.id});
    if(!partner) return res.send("Error! partner not found");
    partner.toBePaid = req.body.toBePaid; 
    await partner.save();
    res.json({partner});
}))

//Finish Paying to the partner
router.put("/paypartner/:id", protect, asyncHandler(async(req,res)=>{
    const partner = await Partner.findOne({_id: req.params.id});
    if(!partner) return res.send("Error! No partner found");
    partner.toBePaid = partner.toBePaid - req.body.paid;
    partner.paid = req.body.paid;
    await partner.save();
    res.json({partner});
}))

module.exports = router;