const mongoose = require("mongoose");

let commentSchema = new mongoose.Schema(
  {
    author_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "employee",
    },
    content: {
      type: String,
      // required: [true, "Should not be empty"]
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "employee" }],
  },
  {
    timestamps: true,
  }
);

let optionSchema = new mongoose.Schema({
  text: {
    type: String,
    // required: [true, "Should not be empty"]
  },
  votes: {
    type: Number,
    default: 0,
  },
});

//creating feed schema
let feedSchema = new mongoose.Schema({
  author_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "employee",
  },
  type: {
    type: String,
    // enum: {
    //   values: ["image", "video", "poll", "event", "celebrate"],
    //   message: "{VALUE} is not supported"
    // },
    default: null,
  },
  tags: [String],
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "employee" }],
  comments: [commentSchema],
  employer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "employer",
  },
  content: {
    type: String,
  },
  data: {
    image: {
      url: {
        type: String,
      },
    },
    video: {
      url: {
        type: String,
      },
    },
    poll: {
      question: {
        type: String,
      },
      options: [optionSchema],
      participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "employee" }],
      pollExpire: {
        type: Date,
      },
    },
    celebrate: {
      template: {
        type: Object,
      },
      data: {
        recepients: [{ type: mongoose.Schema.Types.ObjectId, ref: "employee" }],
        image: {
          url: String,
        },
      },
    },
  },
  postedAt: {
    type: Date,
    default: Date.now,
  },
});

//creating feed model
module.exports = mongoose.model("feed", feedSchema);
