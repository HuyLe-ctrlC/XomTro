const express = require("express");
const {
  createRenterCtrl,
  fetchRentersCtrl,
  fetchRenterByIdCtrl,
  updateRenterCtrl,
  deleteRenterCtrl,
} = require("../../controllers/renters/rentersCtrl");
const authMiddleware = require("../../middlewares/auth/authMiddleware");

const {
  photoUpload,
  postImgResize,
} = require("../../middlewares/uploads/photoUpload");

const renterRoutes = express.Router();

renterRoutes.post(
  "/",
  authMiddleware,
  // photoUpload.single("image"),
  photoUpload.array("image", 2),
  postImgResize,
  createRenterCtrl
);
renterRoutes.get("/search", authMiddleware, fetchRentersCtrl);
renterRoutes.get("/:id", authMiddleware, fetchRenterByIdCtrl);
renterRoutes.put(
  "/:id",
  authMiddleware,
  photoUpload.array("image", 2),
  postImgResize,
  updateRenterCtrl
);
renterRoutes.delete("/:id", authMiddleware, deleteRenterCtrl);
module.exports = renterRoutes;
