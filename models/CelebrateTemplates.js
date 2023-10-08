const mongoose = require("mongoose");

const celebrateSchema = mongoose.Schema({
  name: {
    type: String,
  },
  description: {
    type: String,
  },
  default_images: [String],
  self_recepient: Boolean,
  other_recepients: Boolean,
  default_content: {
    type: String,
  },
  tags: [String],
});

module.exports = mongoose.model("celebrate", celebrateSchema);
