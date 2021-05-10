// Validation Rules
//1. Name, email, password cannot be empty 
//2. Email should be a valid email 
//3. Password and password 2 must match

const Validator = require("validator");
const isEmpty = require("./isEmpty");

module.exports = function ValidateRegisterInput(data) {
  let errors = {};
  data.name = !isEmpty(data.name) ? data.name : '';
  data.email = !isEmpty(data.email) ? data.email : '';
  data.password = !isEmpty(data.password) ? data.password : '';
  data.password2 = !isEmpty(data.password2) ? data.password2 : '';

   if (Validator.isEmpty(data.email)) {
    errors.email = "Email field is required";
  }

   if (Validator.isEmpty(data.name)) {
    errors.name = "Name field is required";
  }

   if (Validator.isEmpty(data.password)) {
    errors.password = "Password field is required";
  }

   if (Validator.isEmpty(data.password2)) {
    errors.password2 = "Confirm password field is required";
  }

  if (!Validator.isEmail(data.email)) {
    errors.email = "Email is invalid";
  }

  //  if (!Validator.isLength(data.name, { min: 2, max: 50 })) {
  //   errors.name = 'name must be bw 2 and 50 characters';
  // }

  //  if (!Validator.isLength(data.password, { min: 6, max: 32 })) {
  //   errors.password = 'password must be bw 6 and 32 characters';
  // }

  // if (!Validator.equals(data.password, data.password2)) {
  //   errors.password2 = 'passwords do not match';
  // }

  return {
    errors, 
    isValid: isEmpty(errors)
  }

}

