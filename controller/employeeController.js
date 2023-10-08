const Employee = require("../models/Employee");
const Feed = require("../models/Feed");
const Event = require("../models/Event");
const bcrypt = require("bcrypt");
const { findEmployee } = require("../db/employee");
const { findEmployer } = require("../db/employer");
const JWT_SECRET = process.env.JWT_SECRET;
const jwt = require("jsonwebtoken");

//Checking employee already registered with organisation or not
exports.checkEmployee = async (req, res) => {
  try {
    const email = req.body.email;
    const employer_args = {
      email_identifier: email.split("@")[1],
    };
    var emp_response = await findEmployer(employer_args);
    console.log(emp_response);
    if (!emp_response) throw new Error("No organisation found with this email");
    res.status(200).json({
      status: 1,
      message: "Organisation is registered",
      data: emp_response,
    });
  } catch (err) {
    res.status(200).json({
      status: 0,
      message: "Some Error occured",
      data: null,
      error: err.message,
    });
    console.log(err);
  }
};

// Employee registration Controller
exports.registerEmployee = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10); //Encrypting password

    const newEmployee = new Employee({
      username: req.body.username,
      name: req.body.name,
      avatar_url: req.body.avatar_url,
      department: req.body.department,
      employer: req.body.employer,
      email: req.body.email,
      bio: req.body.bio,
      password: hashedPassword,
    });
    const saveUser = await newEmployee.save(); // saving user details to db
    res.status(200).json({
      status: 1,
      message: "Successfully Created and saved employee",
      data: null,
    });
  } catch (err) {
    res.status(200).json({
      status: 0,
      message: "Failed to create employee",
      data: null,
      error: err.message,
    });
  }
};

//Employee login Controller
exports.loginEmployee = async (req, res) => {
  try {
    const args = {
      email: req.body.email,
    };
    const user = await findEmployee(args);

    if (!user) {
      throw new Error("Incorrect Username or Password");
    } else {
      //comparing the password entered
      const inputPassword = req.body.password;

      const isPasswordTrue = await bcrypt.compare(inputPassword, user.password);

      if (!isPasswordTrue) {
        throw new Error("Incorrect Username or Password");
      }
      const token = jwt.sign({ _id: user._id }, JWT_SECRET);
      const { password, ...others } = user._doc;
      res.status(200).json({
        status: 1,
        message: "Successfully Logged in",
        data: { ...others },
        token,
      });
    }
  } catch (err) {
    res.status(200).json({
      status: 0,
      message: "Something gone wrong",
      data: null,
      error: err.message,
    });
  }
};

exports.getAllEmployees = async (req, res) => {
  try {
    const loggedInEmployee = req.employee._id;
    const allEmployees = await Employee.find(
      { _id: { $ne: loggedInEmployee }, employer: req.employee.employer },
      "_id name avatar_url bio"
    );
    res.status(200).json({
      status: 1,
      message: "Successfully fetched users",
      data: allEmployees,
    });
  } catch (err) {
    res.json({ error: err.message });
  }
};
exports.getEmployee = async (req, res) => {
  try {
    const loggedInEmployee = req.employee._id;
    const user_id=req.body.user_id;
    const username = req.body.username;
    const args = { 
      employer:req.employee.employer
    };
    if(user_id!=null){
      args["_id"]=user_id;
    }
    if(username!=null){
      args["username"]=username;
    }

    const user = await findEmployee( args
    );
    res.status(200).json({
      status: 1,
      message: "Successfully fetched users",
      data: user,
    }); 
  } catch (err) {
    res.json({ error: err.message });
  }
};

exports.search = async (req, res) => {
  try {
    const field = req.params.field;
    if (field == "employee") {
      fetchAllEmployees(req, res);
    } else if (field == "post") {
      fetchAllPosts(req, res);
    } else if (field == "event") {
      fetchAllEvents(req, res);
    } else {
      throw new Error("Parameter is invalid");
    }
  } catch (err) {
    res.status(200).json({
      status: 0,
      message: "Something gone wrong",
      data: null,
      error: err.message,
    });
  }
};

async function fetchAllEmployees(req, res) {
  const query = req.query.filter;
  const employee = await Employee.find({
    $or: [{ name: { $regex: query, $options: "i" } }],
    employer: req.employee.employer,
  });
  res.status(200).json({
    status: 1,
    message: "Successfully fetched users",
    data: employee,
  });
}

async function fetchAllPosts(req, res) {
  const query = req.query.filter;
  const post = await Feed.find({
    $or: [
      {
        tags: { $in: query },
        content: { $regex: query, $options: "i" },
      },
    ],
    employer: req.employee.employer,
  });
  res.status(200).json({
    status: 1,
    message: "Successfully fetched posts",
    data: post,
  });
}

async function fetchAllEvents(req, res) {
  const query = req.query.filter;
  const event = await Event.find({
    name: { $regex: query, $options: "i" },
    description: { $text: { $search: query } },
    employer: req.employee.employer,
  })
    .populate("employer", "_id name")
    .populate("organizer", "_id name")
    .populate("participants", "_id name department");
  res.status(200).json({
    status: 1,
    message: "Successfully fetched events",
    data: event,
  });
}

exports.testcontroller = (req, res) => {
  res.json({ message: "inside test route" });
};
