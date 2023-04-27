const express = require("express");
const { createRenterCtrl } = require("../../controllers/renters/rentersCtrl");
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

module.exports = renterRoutes;
