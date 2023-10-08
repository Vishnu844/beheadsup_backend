const Celebrate = require("../models/CelebrateTemplates");

exports.create_celebrate_template = async (req, res) => {
  try {
    const celebrateObj = await Celebrate.create({
      name: req.body.name,
      description: req.body.description,
      default_images: req.body.default_images,
      self_recepient:req.body.self_recepient,
      other_recepients:req.body.other_recepients,
      content: req.body.content,
      tags:req.body.tags 
    }); 
    res.status(200).json({
      status: 1,
      message: "Occasion is created",
    });
  } catch (err) {
    res.status(200).json({
      status: 0,
      message: "Failed to create Occasion",
      data: null,
      error: err.message,
    });
    console.log(err);
  }
};
exports.get_celebrate_template = async (req, res) => {
  try { 
    const templates = await Celebrate.find();
    res.status(200).json({
      status: 1,
      data:templates,
      message: "Occasion is created",
    });
  } catch (err) {
    res.status(200).json({
      status: 0,
      message: "Failed to get templates",
      data: null,
      error: err.message,
    });
    console.log(err);
  }
};