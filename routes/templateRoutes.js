const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");

router.get("/", asyncHandler(async(req,res)=>{
    if(!req.cookies.token)
        res.render("index.ejs");
    else 
    res.send("Dashboard Page");    
}));

router.get("/loginpage", asyncHandler(async(req,res)=>{
    res.render("login.ejs");
}));

router.get("/registerpage", asyncHandler(async(req,res)=>{
    res.render("registration.ejs");
}))

module.exports = router;