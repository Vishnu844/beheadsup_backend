const mongoose = require("mongoose");
const {
  getPosts,
  findPostIdAndUpdate,
  findPostIdAndRemove,
  findPostbyId,
  findPostbyIdAndAddComment,
} = require("../db/feed");
const Feed = require("../models/Feed");
const Celebrate = require("../models/CelebrateTemplates");

// controller to create a post.
exports.createPost = async (req, res) => {
  try {
    const employee = req.employee;
    let { content, tags } = req.body;
    // console.log(employee);

    const type = req.body.type;
    var data = {};
    if (type == "image") {
      data.image = {
        url: req.body.data.image.url,
      };
    } else if (type == "video") {
      data.video = {
        url: req.body.data.video.url,
      };
    } else if (type == "poll") {
      // var opt = req.body.data.poll.options;
      // var options_compiled = [];
      // for (let item in opt) {
      //   // generate and pass a unique id as well in the options
      //   options_compiled.push({
      //     text: item,
      //     votes: 0,
      //   });
      // }
      var options = req.body.data.poll.options;
      data.poll = {
        question: req.body.data.poll.question,
        options: options.map((option) => ({ text: option, votes: 0 })),
        participants: [],
        pollExpire: req.body.data.poll.pollExpire,
      };
    } else if (type == "celebrate") {
      const celebrate_data=req.body.data.celebrate;

      const template = celebrate_data.template;
      // console.log(celebrate);
      var recepients=[];
      if (template.other_recepients == true) { 
        recepients = celebrate_data.data.recepients;
        if (template.self_recepient == true) {
          recepients.push(employee._id);
        }
      } 
      var image = celebrate_data.data.image.url;
      if (image) {
        data.celebrate = {
          template: template,
          data: {
            recepients: recepients,
            image: {
              url: image,
            },
          },
        };
      }
    }

    let obj = {
      type,
      tags,
      employer: employee.employer,
      content,
      likes: [],
      comments: [],
      author_id: employee._id,
      data: data,
    };
    const newPost = new Feed(obj);
    const savePost = await newPost.save();
    res
      .status(200)
      .json({ status: 1, message: "Post is created", data: savePost });
  } catch (err) {
    res.status(200).json({
      status: 0,
      message: "Post is not created",
      data: null,
      error: err.message,
    });
    console.log(err);
  }
};

// controller to vote for selected polls
exports.vote = async (req, res) => {
  const post_id = req.body.post_id;
  const participantId = req.employee._id;
  const option_id = req.body.option_id;
  try {
    if (option_id) {
      const post = await Feed.findById(post_id);
      if (!post) throw new Error("No poll found");

      // if (post.data.poll.pollExpire == Date.now)
      //   throw new Error("Poll has Expired");

      const index = post.data.poll.options.findIndex((element) =>
        element._id.equals(new mongoose.Types.ObjectId(option_id))
      );

      // To avoid multiple votes by same employee.
      if (
        index != null &&
        post.data.poll.participants.includes(participantId) == false
      ) {
        post.data.poll.options[index]["votes"]++;
        post.data.poll.participants.push(participantId);
        await post.save();
        return res
          .status(200)
          .json({ status: 1, message: "Voted Successfully", data: post });
      } else {
        throw new Error("Already voted");
      }
    } else {
      throw new Error("No Answer Provided");
    }
  } catch (err) {
    res.status(200).json({
      status: 0,
      message: err.message,
      data: null,
    });
    console.log(err);
  }
};

//controller to get all feed posts by employees of a particular organisation.
exports.getAllPosts = async (req, res) => {
  try {
    const employee = req.employee;
    const feed_id=req.query.feed_id;
    console.log(employee);
    const args = {
      employer: employee.employer,
    };
    if(feed_id){
      args._id=feed_id;
    }
    const posts = await getPosts(args);
    console.log(posts);
    res
      .status(200)
      .json({ status: 1, message: "Fetched all posts", data: posts });
  } catch (err) {
    console.log(err);
    res.status(200).json({
      status: 0,
      message: "Failed to Fetch posts",
      data: null,
      error: err.message,
    });
  }
};

// controller to like the particular feed post.
exports.like = async (req, res) => {
  try {
    const postId = req.body.id;
    const args = req.employee._id;
    const post = await findPostbyId(postId);
    if (!post) throw new Error("No post found with the post ID");

    // To Avoid multiple likes by the same employee.
    const isIncludes = post.likes.includes(req.employee._id);
    const result = isIncludes
      ? await findPostIdAndRemove(postId, args) // if liked already removed from likes.
      : await findPostIdAndUpdate(postId, args); // else added to likes.
    res
      .status(200)
      .json({ status: 1, message: "id added to likes", data: result });
  } catch (err) {
    res.status(200).json({
      status: 0,
      message: "unable to add id to likes",
      error: err.message,
      data: null,
    });
    console.log(err);
  }
};

// controller to add comment for a post.
exports.addComment = async (req, res) => {
  try {
    const postId = req.body.id;
    const filter = {
      author_id: req.employee._id,
      content: req.body.content,
    };
    if (req.body.comment == null) {
      throw new Error("Comment cannot be left empty");
    }
    const result = await findPostbyIdAndAddComment(postId, filter);
    res.status(200).json({ status: 1, message: "Comment added", data: result });
  } catch (err) {
    res.status(200).json({
      status: 0,
      message: "unable to add comment",
      data: null,
      error: err.message,
    });
    console.log(err);
  }
};

// controller to add likes to the particular comment of a particular post.
exports.commentLikes = async (req, res) => {
  try {
    const postId = req.params.feedid;
    const commentId = req.params.commentid;
    const post = await findPostbyId(postId);
    // console.log(post);

    if (!post) throw new Error("No post is found with the post ID");

    let required = post.comments.find((comment) => comment._id == commentId);

    if (required.likes.includes(req.employee._id)) {
      required.likes.filter((element) => element != req.employee._id);
    } else {
      required.likes.push(req.employee._id);
    }
    await post.save();
    res
      .status(200)
      .json({ status: 1, message: "like added to the comment", data: post });
  } catch (err) {
    res.status(200).json({
      status: 0,
      message: "unable add like to the comment",
      error: err.message,
      data: null,
    });
    console.log(err);
  }
};
