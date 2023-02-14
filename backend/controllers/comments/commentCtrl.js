const expressAsyncHandler = require("express-async-handler");
const Comment = require("../../model/comment/Comment");
const validateMongodbId = require("../../utils/validateMongodbID");
/*-------------------
//TODO: Create a comment
//-------------------*/
const createCommentCtrl = expressAsyncHandler(async (req, res) => {
  //1. Get the user
  const user = req.user;
  //2. Get the post Id
  const { postId, description } = req?.body;
  try {
    const comment = await Comment.create({
      post: postId,
      user,
      description,
    });
    res.json(comment);
  } catch (error) {
    res.json(error);
  }
});

/*-------------------
//TODO: Fetch all comments
//-------------------*/

const fetchAllCommentsCtrl = expressAsyncHandler(async (req, res) => {
  try {
    const comments = await Comment.find({}).sort("-createdAt");
    res.json(comments);
  } catch (error) {
    res.json(error);
  }
});

/*-------------------
//TODO: Fetch a comment
//-------------------*/

const fetchCommentCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const comment = await Comment.findById(id);
    res.json(comment);
  } catch (error) {
    res.json(error);
  }
});

/*-------------------
//TODO: Update a comment
//-------------------*/
const updateCommentCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);

  try {
    const updateComment = await Comment.findByIdAndUpdate(
      id,
      {
        user: req?.user,
        description: req?.body?.description,
      },
      { new: true, runValidators: true }
    );
    res.json(updateComment);
  } catch (error) {
    res.json(error);
  }
});

/*-------------------
//TODO: Delete a comment
//-------------------*/
const deleteCommentCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const deleteComment = await Comment.findByIdAndDelete(id);
    res.json(deleteComment);
  } catch (error) {
    res.json(error);
  }
});

module.exports = {
  createCommentCtrl,
  fetchAllCommentsCtrl,
  fetchCommentCtrl,
  updateCommentCtrl,
  deleteCommentCtrl,
};
