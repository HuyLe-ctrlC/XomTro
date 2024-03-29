const express = require("express");
const {
  userRegisterCtrl,
  loginUserCtrl,
  fetchUsersCtrl,
  deleteUsersCtrl,
  fetchUserDetailCtrl,
  userProfileCtrl,
  updateUserCtrl,
  updateUserPasswordCtrl,
  followingUserCtrl,
  unfollowUserCtrl,
  blockUserCtrl,
  unblockUserCtrl,
  generateVerificationTokenCtrl,
  accountVerificationCtrl,
  forgetPasswordToken,
  passwordResetCtrl,
  profilePhotoUploadCtrl,
  updateStatusCtrl,
  adminRegisterCtrl,
} = require("../../controllers/users/usersCtrl");
const authMiddleware = require("../../middlewares/auth/authMiddleware");

const {
  photoUpload,
  profilePhotoResize,
} = require("../../middlewares/uploads/photoUpload");
const userRoutes = express.Router();

userRoutes.post("/register", userRegisterCtrl);
userRoutes.post(
  "/admin-register",
  authMiddleware,
  photoUpload.array("image", 4),
  profilePhotoResize,
  adminRegisterCtrl
);
userRoutes.post("/login", loginUserCtrl);
userRoutes.get("/search", authMiddleware, fetchUsersCtrl);
//password reset
userRoutes.put("/password", authMiddleware, updateUserPasswordCtrl);
userRoutes.post("/forget-password-token", forgetPasswordToken);
userRoutes.put("/reset-password", passwordResetCtrl);
userRoutes.put("/follow", authMiddleware, followingUserCtrl);
userRoutes.post(
  "/generate-verify-email-token",
  authMiddleware,
  generateVerificationTokenCtrl
);
userRoutes.put("/verify-account", authMiddleware, accountVerificationCtrl);
userRoutes.put("/unfollow", authMiddleware, unfollowUserCtrl);
userRoutes.put("/block-user/:id", authMiddleware, blockUserCtrl);
userRoutes.put("/unblock-user/:id", authMiddleware, unblockUserCtrl);
userRoutes.put("/update-publish/:id", authMiddleware, updateStatusCtrl);
// userRoutes.put(
//   "/profile-photo-upload",
//   authMiddleware,
//   photoUpload.single("image"),
//   profilePhotoResize,
//   profilePhotoUploadCtrl
// );
userRoutes.get("/profile/:id", authMiddleware, userProfileCtrl);
userRoutes.put(
  "/:id",
  authMiddleware,
  photoUpload.array("image", 4),
  profilePhotoResize,
  updateUserCtrl
);
userRoutes.delete("/:id", deleteUsersCtrl);
userRoutes.get("/:id", fetchUserDetailCtrl);

module.exports = userRoutes;
