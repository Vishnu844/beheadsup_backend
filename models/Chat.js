const mongoose = require("mongoose");

const chatSchema = mongoose.Schema(
  {
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "employee",
    },
    name: {
      type: String,
      required: true,
    },
    iscommunity:{
      type:Boolean,
      required:true,
    },
    employer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "employer"
    },
    participants: {
      type:[{ type: mongoose.Schema.Types.ObjectId, ref: "employee",unique:true }],
    },
    image_url: {
      type: String,
      default: "https://www.w3schools.com/howto/img_avatar.png",
    },
    description: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("chat", chatSchema);
