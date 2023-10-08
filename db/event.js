const Event = require("../models/Event");

exports.findAnEventById = (eventid) => {
  return Event.findById(eventid)
}

exports.findAnEvent = (arg) => {
  return Event.findOne(arg)
    .populate("chat_room_id")
    .populate("employer", "_id name")
    .populate("participants.user_id", "_id name");
};

exports.fetchAllEvents = (arg) => {
  return Event.find(arg)
    .populate("employer", "_id name")
    .populate("organizer", "_id name")
    .populate("chat_room_id")
    .populate("participants.user_id", "_id name department");
};

exports.joinAnEvent = (arg, eventFilter, maxLimit) => {
  return Event.findByIdAndUpdate(
    arg,
    {
      $push: {
        participants: eventFilter,
      },
      max_limit: maxLimit,
    },
    { new: true }
  )
    .populate("employer", "_id name")
    .populate("participants.user_id", "_id name department");
};

exports.leaveAnEvent = (arg, eventFilter,organizer) => {
  return Event.findByIdAndUpdate(
    arg,
    {
      $pull: {
        participants: eventFilter,
      },
      organizer:organizer
    },
    { new: true }
  )
    .populate("employer", "_id name")
    .populate("participants.user_id", "_id name department");
};

exports.cancelAnEvent = (arg, eventFilter) => {
  return Event.findByIdAndUpdate(
    arg,
    {
      status: eventFilter,
    },
    { new: true }
  )
    .populate("employer", "_id name")
    .populate("participants.user_id", "_id name department");
};
