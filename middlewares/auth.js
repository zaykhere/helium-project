const jwt = require("jsonwebtoken");
const User = require("../models/User");
const asyncHandler = require("express-async-handler");

 const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.cookies.token) {
    token = req.cookies.token; 
  }

  if (!token) {
    return res.render("index");
  }

   try{
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded._id).select('-password');
    if(!user) return res.json({error: "No user found"})
    req.user = user;
    next();  
  }
  catch (ex) {
    console.log(ex);
    res.json({error: "Invalid token"});
  }
  
 })

 module.exports.protect = protect;