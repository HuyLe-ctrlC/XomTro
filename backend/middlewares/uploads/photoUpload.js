const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
//storage
const multerStorage = multer.memoryStorage();

//file type checking
const multerFilter = (req, file, callback) => {
  // console.log("file", file);
  //check file types
  if (file?.mimetype.startsWith("image")) {
    callback(null, true);
  } else {
    //rejected files
    callback(
      {
        massage: "Unsupported file format",
      },
      false
    );
  }
};

const photoUpload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: { fileSize: 1000000 }, //1MB
});

//Image Resizing Profile
const profilePhotoResize = async (req, res, next) => {
  //check if there is no file
  if (!req.file) {
    return next();
  }
  req.file.filename = `user-${Date.now()}-${req.file.originalname}`;
  await sharp(req.file.buffer)
    .resize(250, 250)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(path.join(`public/images/profile/${req.file.filename}`));

  next();
};

//Post Image Resizing
const postImgResize = async (req, res, next) => {
  //check if there is no file
  const files = req.files;
  // // console.log("files", files);
  if (!req.files) {
    return next();
  }
  //store file in public folder and resize it
  files.map(async (file) => {
    file.filename = `user-${Date.now()}-${file.originalname}`;
    await sharp(file.buffer)
      .resize(500, 500)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(path.join(`public/images/posts/${file.filename}`));
  });

  // req.file.filename = `user-${Date.now()}-${req.file.originalname}`;
  // await sharp(req.file.buffer)
  //   .resize(500, 500)
  //   .toFormat("jpeg")
  //   .jpeg({ quality: 90 })
  //   .toFile(path.join(`public/images/posts/${req.file.filename}`));

  next();
};

module.exports = {
  photoUpload,
  profilePhotoResize,
  postImgResize,
};
