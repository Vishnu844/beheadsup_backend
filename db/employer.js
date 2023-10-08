const Employer = require('../models/Employer');

exports.findEmployer = (args) => {
    return Employer.findOne(args).exec();
}