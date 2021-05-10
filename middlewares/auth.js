const jwt = require("jsonwebtoken");
const User = require("../models/User");
const asyncHandler = require("express-async-handler");

 const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.cookies.token) {
    token = req.cookies.token; 
  }

  if (!token) {
    res.status(401).json({ error: "You are not allowed to access this page" });

  }

   try{
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
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