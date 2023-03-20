const expressAsyncHandler = require("express-async-handler");
const User = require("../../model/user/User");
const crypto = require("crypto");
const fs = require("fs");
const generateToken = require("../../config/token/generateToken");
const validateMongodbId = require("../../utils/validateMongodbID");
const nodemailer = require("nodemailer");
const resetURL = require("../../utils/resetURL");
const resetURLExtensions = require("../../utils/resetURLExtension");
const cloudinaryUploadImg = require("../../utils/cloudinary");
/*-------------------
//TODO: Register

//* NOTE =>  firstName: req?.body?.firstName === firstName: req.body && req.body.firstName
--------------------*/

const userRegisterCtrl = expressAsyncHandler(async (req, res) => {
  // check ì user exist
  const userExists = await User.findOne({ email: req?.body?.email });
  if (userExists) {
    throw new Error("Người dùng đã tồn tại!");
  }
  try {
    const user = await User.create({
      firstName: req?.body?.firstName,
      lastName: req?.body?.lastName,
      email: req?.body?.email,
      password: req?.body?.password,
    });
    res.json({ data: user });
  } catch (error) {
    res.json(error);
  }
});

/*-------------------
//TODO: Login User
//-------------------*/

const loginUserCtrl = expressAsyncHandler(async (req, res) => {
  const { email, password } = req.body;
  //check if user exists
  const userFound = await User.findOne({ email });

  //Check if password is match
  if (userFound && (await userFound.isPasswordMatched(password))) {
    res.json({
      data: {
        _id: userFound?._id,
        firstName: userFound?.firstName,
        lastName: userFound?.lastName,
        email: userFound?.email,
        profilePhoto: userFound?.profilePhoto,
        isAdmin: userFound?.isAdmin,
        token: generateToken(userFound?._id),
      },
    });
  } else {
    res.status(401);
    throw new Error("Username hoặc password không hợp lệ!");
  }
});

/*-------------------
//TODO: Get All User
//-------------------*/
const fetchUsersCtrl = expressAsyncHandler(async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.json(error);
  }
});

/*-------------------
//TODO: Delete User
//-------------------*/
const deleteUsersCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  //check if user id is valid
  validateMongodbId(id);
  try {
    const deletedUser = await User.findByIdAndDelete(id);
    res.json(deletedUser);
  } catch (error) {
    res.json(error);
  }
});

/*-------------------
//TODO: User Detail
//-------------------*/
const fetchUserDetailCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  //check if user id is valid
  validateMongodbId(id);
  try {
    const userDetail = await User.findById(id);
    res.json(userDetail);
  } catch (error) {
    res.json(error);
  }
});

/*-------------------
//TODO: User Profile
//-------------------*/
const userProfileCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const myProfile = await User.findById(id).populate("posts");
    res.json(myProfile);
  } catch (error) {
    res.json(error);
  }
});

/*-------------------
//TODO: Update User
//-------------------*/

const updateUserCtrl = expressAsyncHandler(async (req, res) => {
  const { _id } = req?.user;
  validateMongodbId(_id);
  const user = await User.findByIdAndUpdate(
    _id,
    {
      firstName: req?.body?.firstName,
      lastName: req?.body?.lastName,
      email: req?.body?.email,
      bio: req?.body?.bio,
    },
    { new: true, runValidations: true }
  );
  res.json(user);
});

/*-------------------
//TODO: Update Password
//-------------------*/

const updateUserPasswordCtrl = expressAsyncHandler(async (req, res) => {
  //destructure the login user
  const { _id } = req.user;
  const { password } = req.body;
  validateMongodbId(_id);
  //Find the user by _id
  const user = await User.findById(_id);

  if (password) {
    user.password = password;
    const updatedUser = await user.save();
    res.json(updatedUser);
  } else {
    res.json(user);
  }
});

/*-------------------
//TODO: Following
//* => 1. Find the user you want to follow and update it's followers fields
//*    2. Update the login user following field
//-------------------*/
const followingUserCtrl = expressAsyncHandler(async (req, res) => {
  const { followId } = req.body;
  const loginUserId = req.user.id;

  //Find the target user and check if the login id exist

  const targetUser = await User.findById(followId);

  if (targetUser.followers.includes(loginUserId)) {
    throw new Error("You have already followed this user");
  }

  // const alreadyFollowing = targetUser?.followers?.find(
  //   (user) => user?.toString() === loginUserId
  // );
  // if (alreadyFollowing) {
  //   throw new Error("You have already followed this user");
  // }

  //1. Find the user you want to follow and update it's followers fields
  await User.findByIdAndUpdate(
    followId,
    {
      $push: { followers: loginUserId },
      isFollowing: true,
    },
    { new: true }
  );
  //2. Update the login user following field
  await User.findByIdAndUpdate(
    loginUserId,
    {
      $push: { following: followId },
    },
    { new: true }
  );
  res.json("Following successfully!");
});

/*-------------------
//TODO: unfollow
//-------------------*/

const unfollowUserCtrl = expressAsyncHandler(async (req, res) => {
  const { unfollowId } = req.body;
  const loginUserId = req.user.id;
  await User.findByIdAndUpdate(
    unfollowId,
    {
      $pull: { followers: loginUserId },
      isFollowing: false,
    },
    { new: true }
  );

  await User.findByIdAndUpdate(
    loginUserId,
    {
      $pull: { following: unfollowId },
    },
    { new: true }
  );
  res.json("Unfollow successfully");
});

/*-------------------
//TODO: Block user
//-------------------*/

const blockUserCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);

  const user = await User.findByIdAndUpdate(
    id,
    {
      isBlock: true,
    },
    { new: true }
  );
  res.json(user);
});

/*-------------------
//TODO: UnBlock user
//-------------------*/

const unblockUserCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);

  const user = await User.findByIdAndUpdate(
    id,
    {
      isBlock: false,
    },
    { new: true }
  );
  res.json(user);
});

/*-------------------
//TODO: Generate email verification token
//-------------------*/

const generateVerificationTokenCtrl = expressAsyncHandler(async (req, res) => {
  const { email } = req.body;
  const loginUserId = req.user.id;
  const user = await User.findById(loginUserId);
  try {
    //generate the token
    const verificationToken = await user.createAccountVerificationToken();
    //save the user
    await user.save();
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: `${process.env.EMAIL}`,
        pass: `${process.env.EMAIL_PASSWORD}`,
      },
    });
    //build a email
    const msg = {
      from: `${process.env.EMAIL}`, // Sender email
      to: `${email}`, // Receiver email
      subject: "Verification", // Title email
      text: "Please Confirm Your Account", // Text in email
      html: resetURL(
        verificationToken,
        resetURLExtensions.confirmAccount,
        resetURLExtensions.confirmSlug
      ), // Html in email
    };

    await transporter.sendMail(msg);

    res.json(
      resetURL(
        verificationToken,
        resetURLExtensions.confirmAccount,
        resetURLExtensions.confirmSlug
      )
    );
  } catch (error) {
    res.json(error);
  }
});

/*-------------------
//TODO: Account verification
//-------------------*/

const accountVerificationCtrl = expressAsyncHandler(async (req, res) => {
  const { token } = req.body;
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  //find this user by token
  const userFind = await User.findOne({
    accountVerificationToken: hashedToken,
    accountVerificationTokenExpires: { $gt: new Date() },
  });
  if (!userFind) {
    throw new Error("Token expired, try again later");
  }
  //update the properties to true
  userFind.isAccountVerified = true;
  userFind.accountVerificationToken = undefined;
  userFind.accountVerificationTokenExpires = undefined;
  await userFind.save();
  res.json(userFind);
});

/*-------------------
//TODO: Forget token Generator
//-------------------*/

const forgetPasswordToken = expressAsyncHandler(async (req, res) => {
  //configure behavior

  //find the user by email
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw new Error(`User not found`);
  }
  try {
    const token = await user.createPasswordResetToken();
    await user.save();
    //
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "ongconoizzz@gmail.com",
        pass: "pnpakzxeiwvyzovm",
      },
    });
    //build a email
    let msg = {
      from: "ongconoizzz@gmail.com", // Sender email
      to: `${email}`, // Receiver email
      subject: "Reset Password", // Title email
      text: "Please Reset Your Password", // Text in email
      html: resetURL(
        token,
        resetURLExtensions.resetPassword,
        resetURLExtensions.resetPasswordSlug
      ), // Html in email
    };

    const emailMsg = await transporter.sendMail(msg);
    //
    res.json({
      msg: `A verification message is successfully sent to ${
        user?.email
      }. Reset now within 10 minutes!\\n ${resetURL(
        token,
        resetURLExtensions.resetPassword,
        resetURLExtensions.resetPasswordSlug
      )}`,
    });
  } catch (error) {
    res.json(error);
  }
});

/*-------------------
//TODO: Password reset
//-------------------*/

const passwordResetCtrl = expressAsyncHandler(async (req, res) => {
  const { token, password } = req.body;
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  //find the user by token
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) {
    throw new Error("Token expired, try again later");
  }
  //Update/change the password
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  res.json(user);
});

/*-------------------
//TODO: Profile photo upload
//-------------------*/

const profilePhotoUploadCtrl = expressAsyncHandler(async (req, res) => {
  //Find the login user
  const { _id } = req.user;

  //1. Get the path to img
  const localPath = `public/images/profile/${req.file.filename}`;
  //2. Upload to cloudinary
  //cloudinaryUploadImg return promise so I need to "await"
  const imgUploaded = await cloudinaryUploadImg(localPath);

  const foundUser = await User.findByIdAndUpdate(
    _id,
    {
      profilePhoto: imgUploaded?.url,
    },
    { new: true }
  );
  //Remove the saved img
  fs.unlinkSync(localPath);
  res.json(foundUser);
});

module.exports = {
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
};
