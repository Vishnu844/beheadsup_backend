"use strict";

exports.getRequest= function(req,res,next){
    const { message } = req.query;
    res.json({
        yourmessage:message,
        reply:"Health is ok!",
    });
}
exports.postRequest = function(req,res,next){
    const {message} =req.body;
    res.json({
        yourbody:message,
        reply:"health is ok!"
    });
}