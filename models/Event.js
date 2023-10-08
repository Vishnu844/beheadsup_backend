const mongoose = require("mongoose");

const timeSlotSchema = mongoose.Schema({
  start_time: {
    type: Date,
    required: true,
  },
  end_time: {
    type: Date,
    required: true,
  },
});

const eventSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "employee",
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  employer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "employer",
  },
  data: {
    online: {
      joining_link: {
        type: String,
      },
    },
    offline: {
      location: {
        type: String,
      },
    },
  },
  time_slots: [timeSlotSchema],
  status: {
    type: String,
    required: true,
    default: "active",
  },
  chat_room_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "chat",
  },
  max_limit: {
    type: Number,
    required: true,
  },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "employee" }],
});

eventSchema.index({description: "text"})

module.exports = mongoose.model("event", eventSchema);
