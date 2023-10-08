const Feed = require("../models/Feed");

exports.getPosts = (args) => {
  return Feed.find(args)
    .populate("author_id", "_id name avatar_url bio")
    .populate("employer", "_id name")
    .populate("comments.author_id", "_id name avatar_url bio")
    .populate("data.celebrate.data.recepients", "_id name")
    .exec();
};

exports.findPostIdAndUpdate = (postId, args) => {
  return Feed.findByIdAndUpdate(
    postId,
    {
      $push: { likes: args },
    },
    {
      new: true,
    }
  ).exec();
};

exports.findPostIdAndRemove = (postId, args) => {
  return Feed.findByIdAndUpdate(
    postId,
    {
      $pull: { likes: args },
    },
    {
      new: true,
    }
  ).exec();
};

exports.findPostbyId = (postId) => {
  return Feed.findById(postId).exec();
};

exports.findPostbyIdAndAddComment = (postId, filter) => {
  return Feed.findByIdAndUpdate(
    postId,
    { $push: { comments: filter } },
    { new: true }
  ).exec();
};