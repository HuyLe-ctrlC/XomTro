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
  // //check if there is no file
  // const files = req.files;
  // // // console.log("files", files);
  // if (!req.files) {
  //   return next();
  // }
  // //store file in public folder and resize it
  // await files.map(async (file) => {
  //   file.filename = `user-${Date.now()}-${file.originalname}`;
  //   await sharp(file.buffer)
  //     .resize(500, 500)
  //     .toFormat("jpeg")
  //     .jpeg({ quality: 90 })
  //     .toFile(path.join(`public/images/posts/${file.filename}`));
  //   console.log("file middleware", file);
  // });

  // next();

  const images = req.files;
  const body = req.body.image;
  // console.log("images", images);
  const resizedAndFormattedImages = [];
  try {
    for (const image of images) {
      const resizedAndFormatted = await sharp(image.buffer)
        .resize({
          width: 800,
          fit: sharp.fit.inside,
        })
        .toFormat("jpeg")
        .jpeg({ quality: 70 })
        .toBuffer();
      // const filename = `resized_${image.filename}`;
      const filename = `user-${Date.now()}-${image.originalname}`;
      const type = image.mimetype;
      const data = { filename, buffer: resizedAndFormatted, type };

      resizedAndFormattedImages.push(data);
      await sharp(resizedAndFormatted).toFile(
        path.join(`public/images/posts/${filename}`)
      );
    }
    if (Array.isArray(req?.body?.image?.filename)) {
      for (let index = 0; index < req.body.image?.type?.length; index++) {
        resizedAndFormattedImages.push({
          preview: req.body.image?.preview[index],
          filename: req.body.image?.filename[index],
          type: req.body.image?.type[index],
        });
      }
    } else {
      for (let index = 0; index < 1; index++) {
        resizedAndFormattedImages.push({
          preview: req.body.image?.preview,
          filename: req.body.image?.filename,
          type: req.body.image?.type,
        });
      }
    }

    req.resizedAndFormattedImages = resizedAndFormattedImages;
    next();
  } catch (err) {
    console.error(err);
    res.status(500).send("Error resizing and formatting images");
  }
};

module.exports = {
  photoUpload,
  profilePhotoResize,
  postImgResize,
};
