const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const {protect} = require("../middlewares/auth");
const Hotspot = require("../models/Hotspot");
const Wallet = require("../models/Wallet");
const axios = require("axios");


router.get("/", asyncHandler(async(req,res)=>{
    if(!req.cookies.token)
        res.render("index.ejs");
    else {
        res.redirect("/dashboard");
    } 
}));

router.get("/loginpage", asyncHandler(async(req,res)=>{
    res.render("login.ejs");
}));

router.get("/registerpage", asyncHandler(async(req,res)=>{
    res.render("registration.ejs");
}))

router.get("/dashboard", protect , asyncHandler(async(req,res)=> {
    try {
        const wallet = await Wallet.findOne({user: req.user._id});
        const hotspot = await Hotspot.findOne({user:req.user._id});
    
        console.log(wallet);
        console.log(hotspot);
    
        if(!wallet && !hotspot) return res.render("dashboard-plain");
        if(hotspot && !wallet) return res.render("dashboard-plain");
        if(wallet && !hotspot) return res.render("dashboard-wallet",{wallet: wallet.wallet});
                  
        res.render("dashboard",{wallet: wallet.wallet, hotspot: hotspot.hotspot});  
    } catch (error) {
        console.log(error);
    }

    
}));

router.get("/profile", protect, asyncHandler(async(req,res)=>{
    const wallets = await Wallet.find({user: req.user._id});
    if(!wallets) return res.render("profile");
    res.render("profile", {wallets: wallets} );
}))

router.get("/hotspot", protect, asyncHandler(async(req,res)=> {
    const hotspots = await Hotspot.find({user: req.user._id});
    if(!hotspots) return res.render("hotspot");

    async function getApiData(){
        let hotspotData = [];
        let rewards = [];
        
        for(let hotspot of hotspots) {
            
            
            let hhotspot = await axios.get(`https://api.helium.io/v1/hotspots/${hotspot.hotspot}`);
            let reward = await axios.get(`https://api.helium.io/v1/hotspots/${hotspot.hotspot}/rewards/sum`);
            
            hotspotData.push(hhotspot.data);
            rewards.push(reward.data.data.total);

        }
        return {hotspotData, rewards};
    }

    const {hotspotData, rewards} = await getApiData();
    
    res.render("hotspot",{hotspots: hotspotData, rewards: rewards});

    
}));

router.get("/hotspotpage/:address", protect ,asyncHandler(async(req,res)=>{
    const hotspots = await Hotspot.findOne({hotspot: req.params.address});
    if(!hotspots) return res.render("hotspot");
    async function getApiData() {
        let hotspotData = await axios.get(`https://api.helium.io/v1/hotspots/${hotspots.hotspot}`);
        let rewardData = await axios.get(`https://api.helium.io/v1/hotspots/${hotspots.hotspot}/rewards/sum`);

        let hotspot = hotspotData.data;
        let reward = rewardData.data.data.total;
        return {hotspot, reward} ;
    }

    const {hotspot, reward} = await getApiData();
    res.render("hotspotPage",{hotspot: hotspot, reward: reward});
}))


module.exports = router;