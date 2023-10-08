const { getAllMessages } = require("../db/message");
const Message = require("../models/Message");

exports.sendMessage = async (req, res) => {
  try {
    const content = req.body.content;
    const chatId = req.body.chatId;

    if (!content || !chatId) {
      throw new Error("Invalid data passed into request");
    }
    var message = await Message.create({
      sender: req.employee._id,
      content: content,
      chat: chatId,
    });

    message = await message.populate("sender", "name avatar_url _id");
    message = await message.populate("chat");
    message = await message.populate("chat.participants", "name avatar_url _id");

    res
      .status(200)
      .json({ status: 1, message: "message is created", data: message });
  } catch (err) {
    res.status(200).json({
      status: 0,
      message: "message is not created",
      data: null,
      error: err.message,
    });
  }
};

exports.allMessages = async (req, res) => {
  try { 
    const args = {
      chat: req.query.id,
    }; 
    const messages = await getAllMessages(args);
    res.status(200).json({
      status: 1,
      message: "messages fetched successfully",
      data: messages,
    });
  } catch (err) {
    res.status(200).json({
      status: 0,
      message: "failed to fetch messages",
      data: null,
      error: err.message,
    });
  }
};
