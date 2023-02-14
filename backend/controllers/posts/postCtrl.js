const expressAsyncHandler = require("express-async-handler");
const Filter = require("bad-words");
const fs = require("fs");
const Post = require("../../model/post/Post");
const User = require("../../model/user/User");
const validateMongodbId = require("../../utils/validateMongodbID");
const cloudinaryUploadImg = require("../../utils/cloudinary");
const { json } = require("express");

/*-------------------
//TODO: Create a Post
//-------------------*/
const createPostCtrl = expressAsyncHandler(async (req, res) => {
  const { _id } = req.user;
  //validateMongodbId(req.body.user);
  //check for bad words
  const filter = new Filter();
  const isProfane = filter.isProfane(req.body.title, req.body.description);
  //Block User
  if (isProfane) {
    await User.findByIdAndUpdate(_id, {
      isBlocked: true,
    });
    throw new Error(
      "Creating failed because it contains profane words and have been blocked"
    );
  }
  //1. Get the path to img
  const localPath = `public/images/posts/${req.file.filename}`;
  //2. Upload to cloudinary
  //cloudinaryUploadImg return promise so I need to "await"
  const imgUploaded = await cloudinaryUploadImg(localPath);
  try {
    const post = await Post.create({
      ...req.body,
      image: imgUploaded?.url,
      user: _id,
    });
    res.json(post);
    //Remove uploaded img
    fs.unlinkSync(localPath);
  } catch (error) {
    res.json(error);
  }
});

/*-------------------
//TODO: Fetch All Post
//-------------------*/

const fetchPostsCtrl = expressAsyncHandler(async (req, res) => {
  try {
    const posts = await Post.find({}).populate("user");
    res.json(posts);
  } catch (error) {
    res.json(error);
  }
});

/*-------------------
//TODO: Fetch a Post
//-------------------*/

const fetchPostCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const post = await Post.findById(id)
      .populate("user")
      .populate("disLikes")
      .populate("likes");
    res.json(post);
    //update number of view
    await Post.findByIdAndUpdate(
      id,
      {
        $inc: { numViews: 1 },
      },
      { new: true }
    );
  } catch (error) {
    res.json(error);
  }
});

/*-------------------
//TODO: Update a Post
//-------------------*/

const updatePostCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const postUpdate = await Post.findByIdAndUpdate(
      id,
      {
        ...req.body,
        user: req.user?._id,
      },
      { new: true }
    );
    res.json(postUpdate);
  } catch (error) {
    res.json(error);
  }
});

/*-------------------
//TODO: Delete a Post
//-------------------*/
const deletePostCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const posts = await Post.findOneAndDelete(id);
    res.json(posts);
  } catch (error) {
    res.json(error);
  }
});

/*-------------------
//TODO: Like a Post
//-------------------*/
const toggleAddLikeToPostCtrl = expressAsyncHandler(async (req, res) => {
  //1. Find the post to be liked by the user
  const { postId } = req.body;
  const post = await Post.findById(postId);
  //2. Find the login user in the likes array
  const loginUserId = req?.user?._id;
  //3. Check if post isLiked
  const isLiked = post?.isLiked;
  //Check if this user has dislikes this post
  const alreadyDisliked = post?.disLikes?.find(
    (userId) => userId?.toString() === loginUserId?.toString()
  );

  //5. Remove the user from dislikes array if exists
  if (alreadyDisliked) {
    const post = await Post.findByIdAndUpdate(
      postId,
      {
        $pull: { disLikes: loginUserId },
        isDisLiked: false,
      },
      { new: true }
    );
    res.json(post);
  }
  //Toggle
  // Remove the user if he has liked the post
  if (isLiked) {
    const post = await Post.findByIdAndUpdate(
      postId,
      {
        $pull: { likes: loginUserId },
        isLiked: false,
      },
      { new: true }
    );
    res.json(post);
  } else {
    // add to likes
    const post = await Post.findByIdAndUpdate(
      postId,
      {
        $push: { likes: loginUserId },
        isLiked: true,
      },
      { new: true }
    );
    res.json(post);
  }
});

/*-------------------
//TODO: Dislike a Post
//-------------------*/

const toggleAddDislikeToPostCtrl = expressAsyncHandler(async (req, res) => {
  //1. Find the post to be disliked
  const { postId } = req.body;
  const post = await Post.findById(postId);
  //2. Find the login user in the dislikes array
  const loginUserId = req?.user?._id;
  //3. Check if post isDisliked
  const isDisliked = post?.isDisLiked;

  const alreadyLiked = post?.likes?.find(
    (userId) => userId?.toString() === loginUserId?.toString()
  );
  //remove
  if (alreadyLiked) {
    const post = await Post.findOneAndUpdate(
      postId,
      {
        $pull: { likes: loginUserId },
        isLiked: false,
      },
      { new: true }
    );
    res.json(post);
  }
  //toggling
  //Remove this user from dislikes if already disliked
  if (isDisliked) {
    const post = await Post.findByIdAndUpdate(
      postId,
      {
        $pull: { disLikes: loginUserId },
        isDisLiked: false,
      },
      { new: true }
    );
    res.json(post);
  } else {
    const post = await Post.findByIdAndUpdate(
      postId,
      {
        $push: { disLikes: loginUserId },
        isDisLiked: true,
      },
      { new: true }
    );
    res.json(post);
  }
});

module.exports = {
  createPostCtrl,
  fetchPostsCtrl,
  fetchPostCtrl,
  updatePostCtrl,
  deletePostCtrl,
  toggleAddLikeToPostCtrl,
  toggleAddDislikeToPostCtrl,
};
