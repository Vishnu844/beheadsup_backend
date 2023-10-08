const { findChatRoom, findAllChatRooms, updateChat, updateChatName, adduser } = require("../db/chat");
const Chat = require("../models/Chat");

exports.createChatRoom = async (req, res) => {
  try {
   
    const createChatRoom = await Chat.create({
      name: req.body.name,
      participants: [],
      created_by: req.employee._id,
      employer: req.employee.employer,
      description:req.body.description,
      iscommunity:req.body.iscommunity,
      image_url:req.body.image_url
    });
    const args = {
      _id: createChatRoom._id,
    };
    const chatRoom = await findChatRoom(args);

    res.status(200).json({
      status: 1,
      message: "ChatRoom created Successfully",
      data: chatRoom,
    });
  } catch (err) {
    res.status(200).json({
      status: 0,
      message: "Some Error occured",
      data: null,
      error: err.message,
    });
  }
};
exports.joinChatRoom = async (req, res) => {
  try {
    const {chatid} = req.body;
    console.log(chatid);
    const user_id = req.employee._id;
    await adduser(chatid,user_id);
    res.status(200).json({
      status: 1,
      message: "ChatRoom joined Successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(200).json({
      status: 0,
      message: "Some Error occured",
      data: null,
      error: err.message,
    });
  }
};
exports.getChatRooms = async (req, res) => {
  try {
    const args = {
      employer: req.employee.employer,
      iscommunity:true
    };
    const chatRooms = await findAllChatRooms(args);

    res.status(200).json({
      status: 1,
      message: "Fetched ChatRooms Successfully",
      data: chatRooms,
    });
  } catch (err) {
    res.status(200).json({
      status: 0,
      message: "Failed to Fetch ChatRooms",
      data: null,
      error: err.message,
    });
  }
};

exports.getEventChatRooms = async (req, res) => {
  try {
    const args = {
      employer: req.employee.employer,
      iscommunity:false
    };
    const chatRooms = await findAllChatRooms(args);

    res.status(200).json({
      status: 1,
      message: "Fetched ChatRooms Successfully",
      data: chatRooms,
    });
  } catch (err) {
    res.status(200).json({
      status: 0,
      message: "Failed to Fetch ChatRooms",
      data: null,
      error: err.message,
    });
  }
};

exports.renameGroup = async (req, res) => {
  try {
    const chatId = req.body.chatId;
    const chatName = req.body.name;

    const updatedChat = await updateChatName(chatId, chatName);
    if (!updatedChat) {
      throw new Error("Chat Not Found");
    } else {
      res.status(200).json({
        status: 1,
        message: "Updated ChatRoom Name Successfully",
        data: updatedChat,
      });
    }
  } catch (err) {
    res.status(200).json({
      status: 0,
      message: "Failed to Update ChatRoom Name",
      data: null,
      error: err.message,
    });
  }
};