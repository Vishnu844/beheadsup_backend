const mongoose = require("mongoose");

// employee schema
let employeeSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is a required field"],
    minLength: [2, "very small name"],
    maxLength: [20, "very big name"],
    unique: true,
  },
  avatar_url: {
    type: String,
    required: [true, "Image is required"],
    default: "https://www.w3schools.com/howto/img_avatar.png",
  },
  name: {
    type: String,
    required: [true, "Name is a required field"],
    minLength: [2, "very small name"],
    maxLength: [30, "very big name"],
  },
  bio: {
    type: String,
  },
  department: {
    type: String,
    required: [true, "Department is a required field"]
  },
  employer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "employer",
  },
  social_handles: [String],
  password: {
    type: String,
    required: [true, "Password is a required field"],
    // validate: {
    //     validator: function (v) {
    //         // Below RegEx indicates that password should have minimum 8 characters which includes atleast:
    //         // A special character, 
    //         // upper case letters,
    //         // lower case letters and 
    //         // A number
    //       return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/.test(v);
    //     },
    //     message: (props) => `${props.value} is not a valid Password!`,
    //   },
  },
  email: {
    type: String,
    required: [true, "Email is a required field"],
    unique: true,
  },
});

module.exports = mongoose.model("employee", employeeSchema);
