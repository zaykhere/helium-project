const express = require("express");
const asyncHandler = require("express-async-handler");
const router = express.Router();
const Wallet = require("../models/Wallet");
const Hotspot = require("../models/Hotspot");
const {protect} = require("../middlewares/auth");
const axios = require("axios");

// Add Wallet Address
router.post("/add_wallet", protect, asyncHandler(async(req,res)=>{

    const findWallet = await Wallet.findOne({user:req.user._id});
    console.log(findWallet);
    if(findWallet) return res.json("You've already added a wallet");
   
    const walletData = new Wallet({
        user: req.user._id,
        wallet: req.body.wallet
    });
    const saveWallet = await walletData.save()
    if(!saveWallet) {
        let errorMsg = "Something went wrong";
        return res.json({errorMsg:errorMsg});
    }
    res.redirect("/profile");
}));

// Get All Wallets for a user
router.get("/wallets", protect, asyncHandler(async(req,res)=>{
    const wallets = await Wallet.find({user:req.user._id});
    if(!wallets) return res.json({errorMsg: "No wallets found"});
    res.send(wallets);
}));

// Get First Wallet
router.get("/wallet", protect, asyncHandler(async(req,res)=>{
    const wallet = await Wallet.findOne({user: req.user._id});
    if(!wallet) return res.send("No wallet found");
    res.send(wallet);
}));

// Get Wallet Data from Helium API 
router.get("/30rewards/:walletid", asyncHandler(async(req,res)=>{
    const walletid = req.params.walletid;
    const {data} = await axios.get(`https://api.helium.io/v1/accounts/${walletid}/rewards/sum?min_time=-1%20day`);
   // console.log(data);
    res.send(data);
        
}))

// Add HotSpot
router.post("/add_hotspot", protect ,asyncHandler(async(req,res)=>{
    //console.log(req.body.hotspot);

    const hotspot = new Hotspot({
        user: req.user._id,
        hotspot: req.body.hotspot
    });
    const saveHotspot = await hotspot.save();
    if(!saveHotspot) return res.json({errorMsg: "Error, something went wrong"});
    res.redirect("/hotspot");
}));

// Get All Hotspots
router.get("/hotspots", protect, asyncHandler(async(req,res)=>{
    const hotspots = await Hotspot.find({user:req.user._id});
    if(!hotspots) return res.json({errorMsg: "No hotspots found"});
    res.send(hotspots);
}));

// Get First Hotspot 
router.get("/hotspot", protect, asyncHandler(async(req,res)=>{
    const hotspot = await Hotspot.findOne({user: req.user._id});
    if(!hotspot) return res.send("No hotspot found");
    res.send(hotspot);
}));




module.exports = router;