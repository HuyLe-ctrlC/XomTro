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
const image64Default = require("../../utils/image64Default");
const MESSAGE = require("../../utils/constantsMessage");
const blockUser = require("../../utils/blockUser");
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
    const profileDefault = [
      {
        filename: "default.jpg",
        preview: image64Default,
        type: "image/jpeg",
      },
    ];
    const user = await User.create({
      // firstName: req?.body?.firstName,
      // lastName: req?.body?.lastName,
      // email: req?.body?.email,
      // password: req?.body?.password,
      ...req.body,
      profilePhoto: profileDefault,
    });
    res.json({ data: user });
  } catch (error) {
    res.json(error);
  }
});

const adminRegisterCtrl = expressAsyncHandler(async (req, res) => {
  // check ì user exist
  const userExists = await User.findOne({ email: req?.body?.email });
  if (userExists) {
    throw new Error("Người dùng đã tồn tại!");
  }
  try {
    const files = req.resizedAndFormattedImages;

    const imgUploaded = [];

    for (const file of files) {
      const filename = file.filename;
      const type = file.type;
      const filepath = `public/images/profile/${file.filename}`;
      const fileBuffer = file.buffer;
      const preview = fileBuffer.toString("base64");

      imgUploaded.push({ filename, preview, type });
      fs.unlinkSync(filepath);
    }

    const user = await User.create({
      ...req.body,
      profilePhoto: imgUploaded,
    });
    res.json({ result: true, newData: user, message: MESSAGE.UPDATE_SUCCESS });
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
  if (userFound?.isBlocked) throw new Error("Tài khoản này đã bị chặn!");
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
        isAccountVerified: userFound?.isAccountVerified,
        token: generateToken(userFound?._id),
      },
    });
  } else {
    res.status(401);
    throw new Error("Email hoặc mật khẩu không hợp lệ!");
  }
});

/*-------------------
//TODO: Get All User
//-------------------*/
const fetchUsersCtrl = expressAsyncHandler(async (req, res) => {
  // try {
  //   const users = await User.find({});
  //   res.json(users);
  // } catch (error) {
  //   res.json(error);
  // }
  try {
    const { keyword = "", offset = 0, limit = 10 } = req.query;
    let pipeline = [];

    pipeline.push({
      $match: {
        $or: [
          { email: { $regex: keyword, $options: "i" } },
          { firstName: { $regex: keyword, $options: "i" } },
          { lastName: { $regex: keyword, $options: "i" } },
        ],
      },
    });

    pipeline.push({
      $project: {
        _id: 1,
        firstName: 1,
        lastName: 1,
        profilePhoto: 1,
        email: 1,
        isBlocked: 1,
        isAdmin: 1,
        isAccountVerified: 1,
        postCount: 1,
        createdAt: 1,
        updatedAt: 1,
      },
    });
    pipeline.push({ $skip: parseInt(offset) });
    pipeline.push({ $limit: parseInt(limit) });
    pipeline.push({
      $facet: {
        searchResult: [{ $sort: { createdAt: -1 } }],
        searchCount: [{ $count: "total" }],
      },
    });

    const updatedPipeline = pipeline.filter((element) => {
      return !("$limit" in element);
    });
    const [result] = await User.aggregate(pipeline);
    const [resultNoLimit] = await User.aggregate(updatedPipeline);
    const { searchResult = [], searchCount = [] } = result;

    const {
      searchResult: searchResultNoLimit = [],
      searchCount: searchCountRename = [],
    } = resultNoLimit;
    const totalPage = Math.ceil(searchCountRename[0]?.total / limit);
    res.json({
      data: searchResult,
      searchCount: searchCount[0]?.total || 0,
      totalPage,
    });
  } catch (err) {
    res.json(err);
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
  //1.Find the login user
  //2. Check this particular if the login user exists in the array of viewedBy

  //Get the login user
  const loginUserId = req?.user?._id?.toString();

  try {
    const myProfile = await User.findById(id)
      .select(
        "-password -accountVerificationToken -accountVerificationTokenExpires"
      )
      .populate("posts")
      .populate({
        path: "viewedBy",
        select:
          "-password -accountVerificationToken -accountVerificationTokenExpires",
      });

    const alreadyViewed = myProfile?.viewedBy?.find((user) => {
      return user?._id?.toString() === loginUserId;
    });

    if (alreadyViewed || loginUserId === id) {
      res.json({
        result: true,
        data: myProfile,
      });
    } else {
      const profile = await User.findByIdAndUpdate(myProfile?._id, {
        $push: { viewedBy: loginUserId },
      });
      res.json({
        result: true,
        data: profile,
      });
    }
  } catch (error) {
    res.json(error);
  }
});

/*-------------------
//TODO: Update User
//-------------------*/

const updateUserCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req?.params;
  validateMongodbId(id);
  // const { _id } = req?.user;
  // validateMongodbId(_id);
  blockUser(req.user);
  //middleware implement resize and convert to buffer
  try {
    const files = req.resizedAndFormattedImages;
    if (!files.length) {
      const postUpdate = await User.findByIdAndUpdate(
        id,
        // _id,

        {
          ...req.body,
        },
        { new: true }
      )
        .select(
          "-password -accountVerificationToken -accountVerificationTokenExpires"
        )
        .populate("posts")
        .populate({
          path: "viewedBy",
          select:
            "-password -accountVerificationToken -accountVerificationTokenExpires",
        });

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
        const filepath = `public/images/profile/${filename}`;
        fs.unlinkSync(filepath);
        return { filename, preview, type };
      }
    });
    const user = await User.findByIdAndUpdate(
      id,
      // _id,
      {
        firstName: req?.body?.firstName,
        lastName: req?.body?.lastName,
        email: req?.body?.email,
        bio: req?.body?.bio,
        profilePhoto: imgUploaded,
      },
      { new: true, runValidations: true }
    )
      .select(
        "-password -accountVerificationToken -accountVerificationTokenExpires"
      )
      .populate("posts")
      .populate({
        path: "viewedBy",
        select:
          "-password -accountVerificationToken -accountVerificationTokenExpires",
      });

    res.json({
      result: true,
      message: MESSAGE.UPDATE_SUCCESS,
      newData: user,
    });
  } catch (error) {
    res.json({ message: error });
  }
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
    throw new Error("Bạn đã theo dõi người này rồi!");
  }

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
  res.json({ result: true, message: MESSAGE.FOLLOW_SUCCESS });
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
  res.json({ result: true, message: MESSAGE.UNFOLLOW_SUCCESS });
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
      isBlocked: true,
    },
    { new: true }
  ).select(
    "-password -accountVerificationToken -accountVerificationTokenExpires"
  );
  res.json({
    result: true,
    message: MESSAGE.BLOCKED_SUCCESS,
    newData: user,
  });
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
      isBlocked: false,
    },
    { new: true }
  ).select(
    "-password -accountVerificationToken -accountVerificationTokenExpires"
  );
  res.json({
    result: true,
    message: MESSAGE.UNBLOCKED_SUCCESS,
    newData: user,
  });
});

const updateStatusCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const { publish } = req.body;
    const user = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: publish,
      },
      { new: true }
    ).select(
      "-password -accountVerificationToken -accountVerificationTokenExpires"
    );
    if (user) {
      res.json({
        result: true,
        data: user,
        message: MESSAGE.UPDATE_SUCCESS,
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
//TODO: Generate email verification token
//-------------------*/

const generateVerificationTokenCtrl = expressAsyncHandler(async (req, res) => {
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
      to: user?.email, // Receiver email
      subject: "Xác thực", // Title email
      text: "Vui lòng xác thực tài khoản của bạn", // Text in email
      html: resetURL(
        verificationToken,
        resetURLExtensions.confirmAccount,
        resetURLExtensions.confirmSlug
      ), // Html in email
    };

    await transporter.sendMail(msg);

    res.json({
      result: true,
      message: "Đã gửi email xác thực thành công! Vui lòng kiểm tra email",
    });
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
    throw new Error("Token đã hết hạn, thử lại sau!");
  }
  //update the properties to true
  userFind.isAccountVerified = true;
  userFind.accountVerificationToken = undefined;
  userFind.accountVerificationTokenExpires = undefined;
  await userFind.save();
  res.json({ result: true, data: userFind, message: MESSAGE.VERIFIED_SUCCESS });
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
    throw new Error(`Không tìm thấy user`);
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
      text: "Vui lòng reset password của bạn", // Text in email
      html: resetURL(
        token,
        resetURLExtensions.resetPassword,
        resetURLExtensions.resetPasswordSlug
      ), // Html in email
    };

    const emailMsg = await transporter.sendMail(msg);
    //
    res.json({
      msg: `Một tin nhắn xác nhận đã được gửi đến thành công email: ${
        user?.email
      }. Quá trình reset sẽ hết hạn trong vòng 10 phút!\\n ${resetURL(
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
    throw new Error("Token đã hết hạn, thử lại sau!");
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
  updateStatusCtrl,
  adminRegisterCtrl,
};
