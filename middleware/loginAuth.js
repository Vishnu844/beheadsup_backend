const jwt = require('jsonwebtoken')
const Employee = require("../models/Employee");
const JWT_SECRET = process.env.JWT_SECRET
const getTokenFromHeaders = (req) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.split(' ')[0] === 'Bearer') {
      return authHeader.split(' ')[1];
    }
  
    return null;
  };
  
module.exports = (req, res, next) => {
    const authToken = getTokenFromHeaders(req);
    if(!authToken){
        res.status(200).json({status: 0, message: "No authentication token found", data: null})
    }else{
        jwt.verify(authToken, JWT_SECRET, async (err, payload) => {
            if(err){
                res.status(200).json({status:0, message: "Token invalid or expired", data: null, error: err.message})
            }else{
                const {_id} = payload
                const empData = await Employee.findById(_id);
                req.employee = empData
                // console.log(req.employee);
            }
            next();
        })
    }
}