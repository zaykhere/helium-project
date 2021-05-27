const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const {protect} = require("../middlewares/auth");
const Hotspot = require("../models/Hotspot");
const Wallet = require("../models/Wallet");
const axios = require("axios");
const Host = require("../models/Host");
const Partner = require("../models/Partner");
const Referral = require("../models/Referral");
const Payment = require("../models/Payment");


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

router.get("/hpr", protect, asyncHandler(async(req,res)=>{
    const host = await Host.find({user: req.user._id});
    const referral = await Referral.find({user: req.user._id});
    const partner = await Partner.find({user: req.user._id});
    res.render("hpr", {host: host, referral: referral, partner: partner});
}));

router.post("/paid", protect, asyncHandler(async(req,res)=> {
    let payment = new Payment({
        host: req.body.host,
        referral: req.body.referral,
        partner: req.body.partner,
        payment: req.body.payment,
        user: req.user._id
    });
    const savePayment = await payment.save();
    console.log(savePayment);
    res.end();
}))

router.get("/paid", protect, asyncHandler(async(req,res)=>{
    let paidArr = await Payment.find({user: req.user._id}).populate('host').populate('referral').populate('partner');
    console.log(paidArr);
    res.json({paidArr: paidArr});

}))



router.get("/hotspotpage/:address", protect ,asyncHandler(async(req,res)=>{
    const hotspots = await Hotspot.findOne({hotspot: req.params.address});
    if(!hotspots) return res.render("hotspot");
    async function getApiData() {
        let hotspotData = await axios.get(`https://api.helium.io/v1/hotspots/${hotspots.hotspot}`);
        let rewardData = await axios.get(`https://api.helium.io/v1/hotspots/${hotspots.hotspot}/rewards/sum?min_time=-66%20day&bucket=day`);
        let monthlyData = await axios.get(`https://api.helium.io/v1/hotspots/${hotspots.hotspot}/rewards/sum?min_time=-30%20day&bucket=day`);
        let hotspot = hotspotData.data;
        let reward = rewardData;

        let monthlyArr = [];
        let totalArr = [];

        monthlyData.data.data.forEach((d)=> {
            monthlyArr.push(d.total);
        })

        rewardData.data.data.forEach((d)=> {
            totalArr.push(d.total);
        })

        let today = reward.data.data[0].total;
        let yesterday = reward.data.data[1].total;
        let totalAmount = totalArr.reduce((a,b)=> {return a+b});
        let monthlyTotal = monthlyArr.reduce((a,b)=> {return a+b});
        let monthlyAvg = monthlyTotal/30;

        return {hotspot, today, yesterday, totalAmount, monthlyAvg} ;
    }

    const {hotspot, today, yesterday, totalAmount, monthlyAvg} = await getApiData();
    res.render("hotspotPage",{hotspot: hotspot, today: today, yesterday: yesterday, totalAmount:totalAmount, monthlyAvg: monthlyAvg});
}))


module.exports = router;