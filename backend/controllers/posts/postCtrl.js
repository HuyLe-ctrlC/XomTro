const expressAsyncHandler = require("express-async-handler");
const Filter = require("bad-words");
const fs = require("fs");
const Post = require("../../model/post/Post");
const User = require("../../model/user/User");
const validateMongodbId = require("../../utils/validateMongodbID");
const {
  cloudinaryUploadImg,
  cloudinaryDeleteImg,
  cloudinaryUploadMultiImg,
  cloudinaryUpdateImg,
} = require("../../utils/cloudinary");
const { json } = require("express");
const path = require("path");
const MESSAGE = require("../../utils/constantsMessage");

/*-------------------
//TODO: Create a Post
//-------------------*/
const createPostCtrl = expressAsyncHandler(async (req, res) => {
  const { _id } = req.user;
  //Display message if user is blocked
  //! blockUser(req.user); later
  //validateMongodbId(req.body.user);
  //Check for bad words
  const filter = new Filter();
  const isProfane = filter.isProfane(req.body.title, req.body.description);
  //Block user
  if (isProfane) {
    await User.findByIdAndUpdate(_id, {
      isBlocked: true,
    });
    throw new Error(
      "Creating Failed because it contains profane words and you have been blocked"
    );
  }
  //upload to cloudinary
  // const files = req.files;

  // ---------------------
  // let localPath = [];
  // //push file name in to a array, file is created in public folder
  // files.map(async (file) => {
  //   localPath.push(`public/images/posts/${file.filename}`);
  // });
  //----------------------
  // console.log("localPath", localPath);
  // //2.Upload to cloudinary
  // const imgUploaded = await cloudinaryUploadMultiImg(localPath);

  const files = req.resizedAndFormattedImages;
  // console.log("req.body", req.body);

  const imgUploaded = [];

  for (const file of files) {
    const filename = file.filename;
    const type = file.type;
    const filepath = `public/images/posts/${file.filename}`;
    const fileBuffer = file.buffer;
    const preview = fileBuffer.toString("base64");

    imgUploaded.push({ filename, preview, type });
    fs.unlinkSync(filepath);
  }
  // console.log("imgUploaded", imgUploaded);
  try {
    const post = await Post.create({
      ...req.body,
      user: req?.user,
      image: imgUploaded,
    });
    res.json({
      result: true,
      data: post,
      message: MESSAGE.MESSAGE_SUCCESS,
    });
  } catch (error) {
    res.json(error);
  }
});

/*-------------------
//TODO: Fetch All Post
//-------------------*/

const fetchPostsCtrl = expressAsyncHandler(async (req, res) => {
  try {
    const keyword = req.query.keyword;
    const offset = req.query.offset;
    const limit = req.query.limit;
    // Do something with the parameters
    let searchResult = [];
    let searchCount = 0;
    if (keyword == "") {
      searchCount = await Post.countDocuments({
        title: { $regex: keyword, $options: "i" },
      });
      searchResult = await Post.find({
        $or: [{ title: { $regex: keyword, $options: "i" } }],
      })
        .populate("user", "email lastName firstName profilePhoto")
        .skip(parseInt(offset))
        .limit(parseInt(limit))
        .lean()
        .sort("-createdAt");
    } else {
      searchResult = await Post.aggregate([
        {
          $lookup: {
            from: "users",
            localField: "user",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $match: {
            $or: [
              { title: { $regex: keyword, $options: "i" } },
              { "user.firstName": { $regex: keyword, $options: "i" } },
              { "user.lastName": { $regex: keyword, $options: "i" } },
            ],
          },
        },
        {
          $project: {
            title: 1,
            user: {
              //convert array to Object for every field
              $arrayToObject: [
                [
                  {
                    //key & value
                    k: "firstName",
                    v: { $arrayElemAt: ["$user.firstName", 0] },
                  },
                  { k: "lastName", v: { $arrayElemAt: ["$user.lastName", 0] } },
                  { k: "email", v: { $arrayElemAt: ["$user.email", 0] } },
                  {
                    k: "profilePhoto",
                    v: { $arrayElemAt: ["$user.profilePhoto", 0] },
                  },
                ],
              ],
            },
          },
        },
        { $skip: parseInt(offset) },
        { $limit: parseInt(limit) },
      ]);
      const count = await Post.aggregate([
        {
          $lookup: {
            from: "users",
            localField: "user",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $match: {
            $or: [
              { title: { $regex: keyword, $options: "i" } },
              { "user.firstName": { $regex: keyword, $options: "i" } },
              { "user.lastName": { $regex: keyword, $options: "i" } },
            ],
          },
        },
        { $count: "total" },
      ]);
      searchCount = count[0].total;
    }
    // const searchCount = Object.keys(searchResult).length;

    const totalPage = Math.ceil(searchCount / limit);
    res.json({ totalPage: totalPage, data: searchResult });
  } catch (err) {
    res.json(err);
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

  const files = req.resizedAndFormattedImages;
  if (!files.length) {
    const postUpdate = await Post.findByIdAndUpdate(
      id,

      {
        ...req.body,
        user: req?.user,
      },
      { new: true }
    ).populate("user", "email lastName firstName profilePhoto");

    return res.json({
      result: true,
      message: MESSAGE.UPDATE_SUCCESS,
      newData: postUpdate,
    });
  }
  // console.log("files", files)
  const imgUploaded = files.map((file) => {
    if (file?.preview?.startsWith("/")) {
      const filename = file?.filename;
      const type = file?.type;
      const preview = file?.preview;
      return { filename, preview, type };
    } else {
      const filename = file?.filename;
      const type = file?.type;
      const preview = file?.buffer?.toString("base64");
      const filepath = `public/images/posts/${filename}`;
      fs.unlinkSync(filepath);
      return { filename, preview, type };
    }
  });

  const postUpdate = await Post.findByIdAndUpdate(
    id,
    {
      ...req.body,
      user: req?.user,
      image: imgUploaded,
    },
    { new: true }
  ).populate("user", "email lastName firstName profilePhoto");

  res.json({
    result: true,
    message: MESSAGE.UPDATE_SUCCESS,
    newData: postUpdate,
  });
});

/*-------------------
//TODO: Update a cloudinary
//-------------------*/

// const updatePostCtrl = expressAsyncHandler(async (req, res) => {
//   const { id } = req.params;
//   validateMongodbId(id);
//   let publicIDs = [];
//   const getPublicID = await Post.findById(id);
//   getPublicID?.image.map((file) => {
//     publicIDs.push(file.publicId);
//   });
//   // console.log("publicIDs", publicIDs);
//   //get files in request
//   const files = req.resizedAndFormattedImages;
//   console.log("files.length", files.length);
//   let localPath = [];
//   if (files.length !== 0) {
//     // //push file name in to a array, file is created in public folder
//     // files.map((file) => {
//     //   localPath.push(`public/images/posts/${file.filename}`);
//     // });
//     // // Upload to cloudinary
//     // const imgUploaded = await cloudinaryUpdateImg(publicIDs, localPath);

//     const imgUploaded = [];

//     for (const file of files) {
//       const filename = file.filename;
//       const filepath = `public/images/posts/${file.filename}`;
//       const fileBuffer = file.buffer;
//       const data = fileBuffer.toString("base64");

//       imgUploaded.push({ filename, data });
//       fs.unlinkSync(filepath);
//     }
//     try {
//       const postUpdate = await Post.findByIdAndUpdate(
//         id,
//         {
//           ...req.body,
//           user: req.user?._id,
//           image: imgUploaded,
//         },
//         { new: true }
//       );
//       // Remove uploaded img
//       localPath.map((item) => {
//         fs.unlinkSync(item);
//       });
//       res.json(postUpdate);
//     } catch (error) {
//       res.json(error);
//     }
//   } else {
//     try {
//       const postUpdate = await Post.findByIdAndUpdate(
//         id,
//         {
//           ...req.body,
//           user: req.user?._id,
//         },
//         { new: true }
//       );
//       res.json(postUpdate);
//     } catch (error) {
//       res.json(error);
//     }
//   }
// });

/*-------------------
//TODO: Delete a Post
//-------------------*/
const deletePostCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    //!change this code
    const posts = await Post.findOneAndDelete(id);
    if (posts) {
      res.json({
        result: true,
        _id: posts._id,
        message: MESSAGE.DELETE_SUCCESS,
      });
    } else {
      res.json({ result: false, message: MESSAGE.MESSAGE_FAILED });
    }
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
