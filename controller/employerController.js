const Employer = require("../models/Employer");
const bcrypt = require("bcrypt");
const { findEmployer } = require("../db/employer");

//Employer registration Controller
exports.registerEmployer = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10); //Encrypting password
    const email_identifier = req.body.email.split("@")[1];
    const newEmployer = new Employer({
      department: [],
      name: req.body.name,
      email: req.body.email,
      email_identifier: email_identifier,
      password: hashedPassword,
    });
    const saveUser = await newEmployer.save(); // saving user details to db
    res
      .status(200)
      .json({ status: 1, message: "User created and saved to db", data: null });
  } catch (err) {
    res
      .status(200)
      .json({
        status: 0,
        message: "User not created",
        data: null,
        error: err.message,
      });
  }
};

//Employer registration Controller
exports.loginEmployer = async (req, res) => {
  try {
    const args = {
      username: req.body.username,
    };
    const user = await findEmployer(args);

    if (!user) {
      throw new Error("Incorrect Username or Password");
    } else {
      //comparing the password entered
      const inputPassword = req.body.password;

      const isPasswordTrue = await bcrypt.compare(inputPassword, user.password);

      if (!isPasswordTrue) {
        throw new Error("Incorrect Username or Password")
      } else {
        res
          .status(200)
          .json({ status: 1, message: "Successfully Logged in", data: user });
      }
    }
  } catch (err) {
    res.status(200).json({
      status: 0,
      message: "Something went wrong",
      data: null,
      error: err.message,
    });
  }
};
