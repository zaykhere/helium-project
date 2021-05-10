// Validation Rules
//1.  email and password cannot be empty 
//2. Email should be a valid email 


const Validator = require("validator");
const isEmpty = require("./isEmpty");

module.exports = function ValidateLoginInput(data) {
  let errors = {};
  
  data.email = !isEmpty(data.email) ? data.email : '';
  data.password = !isEmpty(data.password) ? data.password : '';
 

   if (Validator.isEmpty(data.email)) {
    errors.email = "Email field is required";
  }


   if (Validator.isEmpty(data.password)) {
    errors.password = "Password field is required";
  }

  
  if (!Validator.isEmail(data.email)) {
    errors.email = "Email is invalid";
  }


  return {
    errors, 
    isValid: isEmpty(errors)
  }

}

