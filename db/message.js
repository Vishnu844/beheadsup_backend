const Message = require("../models/Message");

exports.getAllMessages = (args) => {
  return Message.find(args)
    .populate("sender", "name avatar_url _id")
    .populate("chat");
};
