const Post = require("../models/post");
const User = require("../models/user");
const { validationResult } = require("express-validator");
const fileHelper = require("../helpers/file");

exports.getFeed = (req, res, next) => {
  const limit = parseInt(req.query.limit);
  const page = parseInt(req.query.page);
  const startIndex = (page - 1) * limit;
  let totalNum;
  Post.find()
    //get number of products for pagination
    .countDocuments()
    .then(postsNum => {
      totalNum = postsNum;
      return Post.find()
        .skip(startIndex)
        .limit(limit);
    })
    .then(posts => {
      res.status(200).json({
        posts,
        totalNum
      });
    })
    .catch(err => next(err));
};

exports.postPost = async (req, res, next) => {
  const error = validationResult(req);
  const title = req.body.title;
  const content = req.body.content;
  const image = req.file;
  let creator;
  //validate
  if (!error.isEmpty() || !image) {
    const error = new Error("Validation failed");
    error.statusCode = 422;
    throw error;
  }
  const post = new Post({
    title: title,
    content: content,
    imageURL: image.path,
    creator: req.userId
  });
  try {
    await post.save();
    const user = await User.findById(req.userId);
    creator = user;
    user.posts.push(post);
    user.save();
    res.status(201).json({
      message: "Success",
      post: post,
      creator: { _id: creator._id, name: creator.name }
    });
  } catch (error) {
    next(error);
  }
};

exports.postUpdatePost = async (req, res, next) => {
  const title = req.body.title;
  const id = req.body.id;
  const image = req.file;
  const content = req.body.content;
  const error = validationResult(req);
  //validate
  if (!error.isEmpty()) {
    const error = new Error("Validation failed");
    error.statusCode = 422;
    throw error;
  }
  try {
    //save if valid
    const post = await Post.findById(id);
    post.title = title;
    post.content = content;
    //update image path if image was updated
    if (image) {
      //delete old image
      const oldImage = post.imageURL;
      fileHelper.deleteFile(oldImage);
      //save new path
      post.imageURL = image.path;
    }
    await post.save();
    res.status(200).json({
      message: "Update Success"
    });
  } catch (error) {
    next(error);
  }
};

exports.deletePost = (req, res, next) => {
  const oldImage = req.body.image;
  const id = req.body.id;
  fileHelper.deleteFile(oldImage);
  Post.findByIdAndRemove(id)
    .then(() => {
      return User.findById(req.userId);
    })
    .then(user => {
      user.posts.pull(id);
      return user.save();
    })
    .then(() => {
      res.status(200).json({
        message: "Delete Success"
      });
    })
    .catch(err => next(err));
};
