const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const ValidateRegisterInput = require("../validation/register");
const ValidateLoginInput = require("../validation/login");
const {protect} = require("../middlewares/auth");

// User Sign Up
router.post("/register", asyncHandler(async(req,res)=>{
     //Validation 
  const { errors, isValid } = ValidateRegisterInput(req.body);
  //console.log(error);
  if (!isValid) {
    let errorMsg = Object.keys(errors);
    return res.render("registration", {errorMsg});
   }
  try {
    const ifUser = await User.findOne({email:req.body.email });
    if (ifUser) {  
      let errorMsg = "User already exists";
      return res.render("registration", {errorMsg});
    }
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    })
    let result = await user.save();
    const token = user.generateAuthToken();
    if(!token){
      let errorMsg = "Invalid Token";
      return res.render("registration", {errorMsg});
    } 
    const options = {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
      ),
    };
    res.cookie("token", token, options);
    res.redirect("/dashboard");
} catch (ex) {
  let errorMsg = ex.message;
    return res.render("registration", {errorMsg});
}
}))

// Login User
router.post("/login", asyncHandler(async(req,res)=>{
  const {errors, isValid} = ValidateLoginInput(req.body);
  if(!isValid){
    let errorMsg = Object.keys(errors)[0];
      return res.render("login", {errorMsg});
  }
  try{
    const user = await User.findOne({email: req.body.email});
    if(!user) {  
    let errorMsg = "No User found with this email";
    return res.render("login", {errorMsg});
  }
    const matchPassword = await user.matchPassword(req.body.password);
    if (matchPassword) {
      const token = user.generateAuthToken();
      const options = {
        expires: new Date(
          Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
      };
      res.cookie("token", token, options);
      res.redirect("/dashboard");
    }
    else {
      let errorMsg = "Invalid email or password";
      return res.render("login", {errorMsg});
      
    }
  }
  catch(ex){
    let errorMsg = ex.message;
    return res.render("login", {errorMsg});
  }
}))


router.get("/logout", asyncHandler(async(req,res)=>{
  if(req.cookies.token)
    res.clearCookie("token");
    res.redirect("/");
}))

//Delete Account 
router.delete("/deleteaccount", protect, asyncHandler(async(req,res)=>{
  await User.findByIdAndRemove(req.user._id);
  res.redirect("/");
}))

module.exports = router;