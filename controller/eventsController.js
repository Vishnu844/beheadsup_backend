const Event = require("../models/Event");
const Chat = require("../models/Chat");
const {
  findAnEvent,
  fetchAllEvents,
  joinAnEvent,
  leaveAnEvent,
  cancelAnEvent,
  findAnEventById,
} = require("../db/event");
const { updateChat, leaveChat, findAChatById } = require("../db/chat");

// endpoint for creating an event
exports.createEvent = async (req, res) => {
  try {
    const { name, type, description, max_limit, status } = req.body;
    const employer = req.employee.employer;
    const organizer = req.employee._id;
    const participants = req.employee._id;
    const timeSlots = req.body.time_slot;
    console.log(req.body);
    var data = {};
    if (type.toLowerCase() == "online") {
      data.online = {
        joining_link: req.body.data.online.joining_link,
      };
    } else {
      data.offline = {
        location: req.body.data.offline.location,
      };
    }

    const createChatRoom = await Chat.create({
      name,
      participants,
      iscommunity: false,

      description,
      employer,
      created_by: req.employee._id,
    });

    const createEvent = await Event.create({
      name,
      type,
      description,
      organizer,
      employer,
      time_slots: timeSlots.map((data) => ({
        start_time: data.start_time,
        end_time: data.end_time,
      })),
      max_limit,
      status,
      chat_room_id: createChatRoom._id,
      participants: [participants],
      data,
    });

    const arg = {
      _id: createEvent._id,
    };
    const event = await findAnEvent(arg);

    res.status(200).json({
      status: 1,
      message: "Event is successfully created",
      data: event,
    });
  } catch (err) {
    res.status(200).json({
      status: 0,
      message: "Failed to create Event",
      data: null,
      error: err.message,
    });
  }
};

// endpoint to get all events
exports.getAllEvents = async (req, res) => {
  try {
    const arg = {
      employer: req.employee.employer,
    };
    const allEvents = await fetchAllEvents(arg);

    res.status(200).json({
      status: 1,
      message: "Events Fetched successfully",
      data: allEvents,
    });
  } catch (err) {
    res.status(200).json({
      status: 0,
      message: "Failed to Fetch Events",
      data: null,
      error: err.message,
    });
  }
};

// endpoint for joining an event
exports.joinEvent = async (req, res) => {
  try {
    const employeeId = req.employee._id;
    const args = {
      eventid: req.body.eventid,
      chatid: req.body.chatid,
    };

    const chatFilter = {
      participants: employeeId,
    };

    const eventFilter = {
      user_id: employeeId,
    };
    console.log(args);
    if (!args) {
      throw new Error("Event and chat ids are not defined");
    }

    const chat = await findAChatById(args.chatid);
    const event = await findAnEventById(args.eventid);
    if (event == null) {
      throw new Error("No event is found in the database");
    }
    if (chat == null) {
      throw new Error("No chatroom for this event is found");
    }

    if (event.max_limit == event.participants.length) {
      throw new Error("Participants limit is reached for this event");
    }
    if (chat.participants.includes(employeeId) == true) {
      throw new Error("Employee was already registered in this event");
    }

    const joinEvent = await joinAnEvent(
      args.eventid,
      eventFilter.user_id,
    );
    const joinChat = await updateChat(args.chatid, chatFilter);

    res.status(200).json({
      status: 1,
      message: "Joined Event successfully",
      data: { joinChat, joinEvent },
    });
  } catch (err) {
    res.status(200).json({
      status: 0,
      message: "Failed to Join Event",
      data: null,
      error: err.message,
    });
    console.log(err);
  }
};



// endpoint for leaving an event
exports.leaveEvent = async (req,res)=>{
  try{
  const {action,chatid,eventid}=req.body;
  
  if(!action||!chatid ||!eventid){
    throw new Error("Required Parameter missing");
  } 
  const event = await findAnEventById(eventid);
  if(req.body.action=="leave"){
      // if participants length is 1 => cancel the event
      // else leave the event and make the other user organizer and remove this
      if(event.participants.length==1){
        // delete the event
        deleteEvent(req,res);
        
      }else{
        let organizer = event.organizer._id; 
          if (organizer.equals(req.employee._id)) {
            // organizer want to leave the event making other user admin  
            console.log(organizer);
            organizer=event.participants.find(element => element != organizer);
            console.log(organizer);
          }else{
            console.log("Not organizer");
          }
          removeUser(req,res,organizer);
      }

  }else if(req.body.action=="cancel"){
      // if the current user is organizer just cancel the event
      if(event.organizer.equals(req.employee._id)){
          if(event.participants.length==1){
            // delete the event
            console.log("deleting this event as there is only one user");
            console.log(event.participants.length);
            deleteEvent(req,res);
          }else{
            cancelEvent(req,res);
            // make the status cancelled
          }
      }else{
        throw new Error("You are not the organizer of this event");
      }
  }
} catch(err){
  res.status(200).json({
    status: 0,
    message: err.message,
    data: null, 
  });
}
}
async function deleteEvent(req,res){
  const {chatid,eventid}=req.body;
  await Chat.findByIdAndDelete(chatid);
  await Event.findByIdAndDelete(eventid);
  res.status(200).json({
    status: 1,
    message: "Event deleted Successfully",
    data: null, 
  });
}
async function removeUser(req, res,organizer) {
    const employeeId = req.employee._id;
    const chatFilter = {
      participants: employeeId,
    };
    const eventFilter = {
      user_id: employeeId,
    };
    const leaveEvent = await leaveAnEvent(
      req.body.eventid,
      eventFilter.user_id,
      organizer
    );
    const leaveAChat = await leaveChat(req.body.chatid, chatFilter,organizer);

    res.status(200).json({
      status: 1,
      message: "Left from Event",
      data: { leaveAChat, leaveEvent },
    });

};
//endpoint for cancelling event
async function cancelEvent(req, res) {
  try {
    const eventid = req.body.eventid;
    const eventFilter = { 
      status:"cancelled"
    };
    const cancel = await cancelAnEvent(eventid, eventFilter.status);
    res.status(200).json({
      status: 1,
      message: "Event cancelled",
      data: cancel,
    });
  } catch (err) {
    res.status(200).json({
      status: 0,
      message: "Failed to update Status of event",
      data: null,
      error: err.message,
    });
    console.log(err);
  }
};
