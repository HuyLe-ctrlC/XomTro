const expressAsyncHandler = require("express-async-handler");
const Comment = require("../../model/comment/Comment");
const validateMongodbId = require("../../utils/validateMongodbID");
const MESSAGE = require("../../utils/constantsMessage");
/*-------------------
//TODO: Create a comment
//-------------------*/
const createCommentCtrl = expressAsyncHandler(async (req, res) => {
  //1. Get the user
  const user = req.user;
  //2. Get the post Id
  const { postId, description } = req?.body;
  try {
    const comments = await Comment.create({
      post: postId,
      user,
      description,
    });
    const commentAfterAdd = await Comment.find({ post: postId });
    const totalComment = commentAfterAdd.length;
    if (comments) {
      res.json({
        result: true,
        message: MESSAGE.UPDATE_SUCCESS,
        data: comments,
        totalComment: totalComment,
      });
    } else {
      res.json({
        result: false,
        message: MESSAGE.UPDATE_FAILED,
      });
    }
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
    res.json({
      result: true,
      message: MESSAGE.UPDATE_SUCCESS,
      data: comments,
    });
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
    const comments = await Comment.find({ post: id })
      .select(
        "user.firstName user.lastName user.profilePhoto description post createdAt updatedAt"
      )
      .sort("-createdAt");
    const totalComment = comments.length;

    res.json({
      result: true,
      data: comments,
      message: MESSAGE.GET_DATA_SUCCESS,
      totalComment: totalComment,
    });
  } catch (error) {
    res.json(error);
  }
});

/*-------------------
//TODO: Get comment detail
//-------------------*/

const fetchCommentDetail = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const comment = await Comment.findById(id).select(
      "user.firstName user.lastName user.profilePhoto description post createdAt updatedAt"
    );
    res.json({
      result: true,
      dataUpdate: comment,
      message: MESSAGE.GET_DATA_SUCCESS,
    });
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
    ).select(
      "user.firstName user.lastName user.profilePhoto description post createdAt updatedAt"
    );
    if (updateComment) {
      res.json({
        result: true,
        message: MESSAGE.UPDATE_SUCCESS,
        newData: updateComment,
      });
    } else {
      res.json({
        result: false,
        message: MESSAGE.UPDATE_FAILED,
      });
    }
    // res.json(updateComment);
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
    const commentAfter = await Comment.find({ post: deleteComment.post._id });
    const totalComment = commentAfter.length;
    // res.json(deleteComment);
    if (deleteComment) {
      res.json({
        result: true,
        data: deleteComment,
        message: MESSAGE.DELETE_SUCCESS,
        totalComment: totalComment,
      });
    } else {
      res.json({
        result: false,
        message: MESSAGE.DELETE_FAILED,
      });
    }
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
  fetchCommentDetail,
};
