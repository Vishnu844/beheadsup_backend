const mongoose = require("mongoose");

// employer Schema
let employerSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email is Required"],
    unique: true,
  },
  email_identifier: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  name: {
    type: String,
    minLength: [2, "very small name"],
    maxLength: [20, "very big name"],
    required: true,
  },
  department: [
    {
      id: String,
      name: String,
    },
  ],
});

//creating employer model
module.exports = mongoose.model("employer", employerSchema);
