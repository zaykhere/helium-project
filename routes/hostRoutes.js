const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const {protect} = require("../middlewares/auth");
const Host = require("../models/Host");

//Add A Host
router.post("/", protect, asyncHandler(async(req,res)=>{
    const {name, email, hntAddress, mobile} = req.body;
    
    let host = new Host({
        name,
        email,
        hntAddress,
        mobile,
        user: req.user._id
    });
    await host.save();
    res.redirect("/hpr");
}));

// Get The Host 
router.get("/hosts", protect, asyncHandler(async(req,res)=>{
    const hosts = await Host.find({user: req.user._id});
    if(!hosts) return res.send(null);
    res.json({hosts});
}));

router.get("/host/:id", protect, asyncHandler(async(req,res)=> {
    const host = await Host.findOne({_id: req.params.id});
    if(!host) return res.send(null);
    res.json({host});
}))

// Add Payment to the Host
router.put("/savehost/:id", protect, asyncHandler(async(req,res)=>{
    const host = await Host.findOne({_id: req.params.id});
    if(!host) return res.send("Error! Host not found");
    console.log(host);
    host.toBePaid = req.body.toBePaid; 
    await host.save();
    res.json({host});
}))

//Finish Paying to the Host
router.put("/payhost/:id", protect, asyncHandler(async(req,res)=>{
    const host = await Host.findOne({_id: req.params.id});
    if(!host) return res.send("Error! No host found");
    host.toBePaid = host.toBePaid - req.body.paid ;
    host.paid = req.body.paid;
    await host.save();
    res.json({host});
}))

module.exports = router;