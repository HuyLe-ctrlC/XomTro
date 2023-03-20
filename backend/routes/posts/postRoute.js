const express = require("express");
const {
  createPostCtrl,
  fetchPostsCtrl,
  fetchPostCtrl,
  updatePostCtrl,
  deletePostCtrl,
  toggleAddLikeToPostCtrl,
  toggleAddDislikeToPostCtrl,
  fetchPostByUserCtrl,
  updateStatusCtrl
} = require("../../controllers/posts/postCtrl");
const authMiddleware = require("../../middlewares/auth/authMiddleware");

const {
  photoUpload,
  postImgResize,
} = require("../../middlewares/uploads/photoUpload");

const postRoutes = express.Router();

postRoutes.post(
  "/",
  authMiddleware,
  // photoUpload.single("image"),
  photoUpload.array("image", 4),
  postImgResize,
  createPostCtrl
);

postRoutes.put("/likes", authMiddleware, toggleAddLikeToPostCtrl);
postRoutes.put("/dislikes", authMiddleware, toggleAddDislikeToPostCtrl);
postRoutes.put("/update-publish/:id", authMiddleware, updateStatusCtrl);

postRoutes.get("/search", fetchPostsCtrl);
postRoutes.get("/getByUser", authMiddleware, fetchPostByUserCtrl);
postRoutes.get("/:id", fetchPostCtrl);
postRoutes.put(
  "/:id",
  authMiddleware,
  photoUpload.array("image", 4),
  postImgResize,
  updatePostCtrl
);
postRoutes.delete("/:id", authMiddleware, deletePostCtrl);

module.exports = postRoutes;
