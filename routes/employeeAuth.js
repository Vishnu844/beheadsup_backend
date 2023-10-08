const router = require("express").Router();
const employeeController = require("../controller/employeeController");
const chatController = require("../controller/chatController");
const messageController = require("../controller/messageController");
const MediaController = require("../controller/mediacontroller");
const feedController = require("../controller/feedController");
const eventsController = require("../controller/eventsController");
const celebrateController = require("../controller/celebrateController");
const loginAuth = require("../middleware/loginAuth");

//employee related routes.
router.get("/employee/list",loginAuth, employeeController.getAllEmployees);
router.post("/employee/profile",loginAuth, employeeController.getEmployee);
router.post("/employee/register", employeeController.registerEmployee);
router.post("/employee/login", employeeController.loginEmployee);
router.post("/employee/check", employeeController.checkEmployee);
router.post("/employee/feed/create", loginAuth, feedController.createPost);
router.get("/employee/feed", loginAuth, feedController.getAllPosts);
router.post("/employee/feed/like", loginAuth, feedController.like);
router.post("/employee/feed/add-comment",loginAuth,feedController.addComment);
router.post(
  "/employee/feed/:feedid/comment/:commentid/like-to-comment",
  loginAuth,
  feedController.commentLikes
);
router.get("/test", employeeController.testcontroller);
router.post("/employee/poll-post/vote", loginAuth, feedController.vote);
router.post("/employee/create-chatroom", loginAuth, chatController.createChatRoom);
router.get("/employee/get-chatrooms", loginAuth, chatController.getChatRooms);
router.post("/employee/join-chat", loginAuth, chatController.joinChatRoom);
router.get("/employee/get-event-chatrooms", loginAuth, chatController.getEventChatRooms);
router.post("/employee/chatroom/new-message", loginAuth, messageController.sendMessage);
router.get("/employee/chatroom/fetch-messages", loginAuth, messageController.allMessages);
router.post("/employee/create-event", loginAuth, eventsController.createEvent);
router.post("/employee/join-event", loginAuth, eventsController.joinEvent);
router.post("/employee/leave-event", loginAuth, eventsController.leaveEvent);
router.get("/employee/get-events", loginAuth, eventsController.getAllEvents);

router.get("/search/:field", loginAuth, employeeController.search);

router.post("/celebrate", celebrateController.create_celebrate_template);
router.get("/celebrate", celebrateController.get_celebrate_template);
router.post("/mediaupload", MediaController.MediaUpload);

module.exports = router;
