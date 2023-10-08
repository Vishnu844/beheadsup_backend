const Chat = require("../models/Chat");

exports.findAChatById = (args) => {
  return Chat.findById(args)
}

exports.findChatRoom = (args) => {
  return Chat.findOne(args)
    .populate("participants", "_id name department")
    .populate("created_by", "_id name department");
};

exports.findAllChatRooms = (args) => {
  return Chat.find(args)
    .populate("participants", "_id name department")
    .populate("created_by", "_id name department");
};

exports.updateChatName = (chatId, chatName) => {
  return Chat.findByIdAndUpdate(
    chatId,
    {
      chatName: chatName,
    },
    {
      new: true,
    }
  )
    .populate("participants", "_id name department")
    .populate("employer", "_id name");
};

exports.updateChat = (chatId, chatFilter) => {
  return Chat.findByIdAndUpdate(
    chatId,
    {
      $push: chatFilter
    },
    { new: true }
  )
    .populate("employer", "_id name")
    .populate("participants", "_id name department");
};

exports.adduser = (chatId, chatFilter) => {
  return Chat.findByIdAndUpdate(
    chatId,
    {
      $push:{
      "participants":chatFilter,
      }
    }, 
    { new: true }
  )
    .populate("employer", "_id name")
    .populate("participants", "_id name department");
};

exports.leaveChat = (chatId, chatFilter,creator) => {
  return Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: chatFilter,
      created_by:creator
    }, 
    { new: true }
  )
    .populate("employer", "_id name")
    .populate("participants", "_id name department");
};