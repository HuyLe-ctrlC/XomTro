const express = require("express");
const {
  createCommentCtrl,
  fetchAllCommentsCtrl,
  fetchCommentCtrl,
  updateCommentCtrl,
  deleteCommentCtrl,
  fetchCommentDetail,
} = require("../../controllers/comments/commentCtrl");
const authMiddleware = require("../../middlewares/auth/authMiddleware");

const commentRoutes = express.Router();

commentRoutes.post("/", authMiddleware, createCommentCtrl);
commentRoutes.get("/", authMiddleware, fetchAllCommentsCtrl);
commentRoutes.get("/:id", authMiddleware, fetchCommentCtrl);
commentRoutes.put("/:id", authMiddleware, updateCommentCtrl);
commentRoutes.delete("/:id", authMiddleware, deleteCommentCtrl);
commentRoutes.get("/getDetail/:id", authMiddleware, fetchCommentDetail);

module.exports = commentRoutes;
