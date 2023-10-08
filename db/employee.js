const Employee = require("../models/Employee");
const Employer = require("../models/Employer");

exports.findEmployee = (args) => {
  return Employee.findOne(args).populate("employer", "_id name avatar_url").exec();
};
