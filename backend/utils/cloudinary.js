const cloudinary = require("cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const cloudinaryUploadImg = async (fileToUpload) => {
  try {
    // console.log("fileToUpload", fileToUpload);
    const data = await cloudinary.uploader.upload(fileToUpload, {
      resource_type: "auto",
    });
    //return promise
    return {
      url: data?.secure_url,
    };
  } catch (error) {
    return error;
  }
};

const cloudinaryUploadMultiImg = async (files) => {
  try {
    // console.log("files", files);
    // let urls = [];
    // files.map(async (file) => {
    //   try {
    //     const result = await cloudinary.uploader.upload(file, {
    //       resource_type: "auto",
    //     });
    //     urls.push(result.secure_url);
    //     console.log("result", result.secure_url);
    //   } catch (err) {
    //     console.log("Error:", err);
    //     return { message: "Upload failed!", error: err };
    //   }
    // });

    // return { urls: urls };

    //upload 1 to  4 images
    if (files.length == 1) {
      const data1 = await cloudinary.uploader.upload(files[0], {
        resource_type: "auto",
      });
      //return promise
      // console.log("data", data1);
      return [{ img: data1?.secure_url, publicId: data1?.public_id }];
    } else if (files.length == 2) {
      const data1 = await cloudinary.uploader.upload(files[0], {
        resource_type: "auto",
      });
      const data2 = await cloudinary.uploader.upload(files[1], {
        resource_type: "auto",
      });
      //return promise
      return [
        { img: data1?.secure_url, publicId: data1?.public_id },
        { img: data2?.secure_url, publicId: data2?.public_id },
      ];
    } else if (files.length == 3) {
      const data1 = await cloudinary.uploader.upload(files[0], {
        resource_type: "auto",
      });
      const data2 = await cloudinary.uploader.upload(files[1], {
        resource_type: "auto",
      });
      const data3 = await cloudinary.uploader.upload(files[2], {
        resource_type: "auto",
      });
      //return promise
      return [
        { img: data1?.secure_url, publicId: data1?.public_id },
        { img: data2?.secure_url, publicId: data2?.public_id },
        { img: data3?.secure_url, publicId: data3?.public_id },
      ];
    } else {
      const data1 = await cloudinary.uploader.upload(files[0], {
        resource_type: "auto",
      });
      const data2 = await cloudinary.uploader.upload(files[1], {
        resource_type: "auto",
      });
      const data3 = await cloudinary.uploader.upload(files[2], {
        resource_type: "auto",
      });
      const data4 = await cloudinary.uploader.upload(files[3], {
        resource_type: "auto",
      });
      //return promise
      return [
        { img: data1?.secure_url, publicId: data1?.public_id },
        { img: data2?.secure_url, publicId: data2?.public_id },
        { img: data3?.secure_url, publicId: data3?.public_id },
        { img: data4?.secure_url, publicId: data4?.public_id },
      ];
    }
  } catch (error) {
    return error;
  }
};

// Define the function to update the image
const cloudinaryUpdateImg = async (publicId, newPath) => {
  try {
    if (newPath.length == 1) {
      const data1 = await cloudinary.uploader.upload(newPath[0], {
        public_id: publicId[0],
        overwrite: true,
      });

      // Delete the old image with the same public_id
      await cloudinary.uploader.destroy(publicId[0]);

      return [{ img: data1?.secure_url, publicId: data1?.public_id }];
    } else if (newPath.length == 2) {
      const data1 = await cloudinary.uploader.upload(newPath[0], {
        public_id: publicId[0],
        overwrite: true,
      });
      const data2 = await cloudinary.uploader.upload(newPath[1], {
        public_id: publicId[1],
        overwrite: true,
      });
      await cloudinary.uploader.destroy(publicId[0]);
      await cloudinary.uploader.destroy(publicId[1]);
      //return promise
      return [
        { img: data1?.secure_url, publicId: data1?.public_id },
        { img: data2?.secure_url, publicId: data2?.public_id },
      ];
    } else if (newPath.length == 3) {
      const data1 = await cloudinary.uploader.upload(newPath[0], {
        public_id: publicId[0],
        overwrite: true,
      });
      const data2 = await cloudinary.uploader.upload(newPath[1], {
        public_id: publicId[1],
        overwrite: true,
      });
      const data3 = await cloudinary.uploader.upload(newPath[2], {
        public_id: publicId[2],
        overwrite: true,
      });
      await cloudinary.uploader.destroy(publicId[0]);
      await cloudinary.uploader.destroy(publicId[1]);
      await cloudinary.uploader.destroy(publicId[2]);
      //return promise
      return [
        { img: data1?.secure_url, publicId: data1?.public_id },
        { img: data2?.secure_url, publicId: data2?.public_id },
        { img: data3?.secure_url, publicId: data3?.public_id },
      ];
    } else {
      const data1 = await cloudinary.uploader.upload(newPath[0], {
        public_id: publicId[0],
        overwrite: true,
      });
      const data2 = await cloudinary.uploader.upload(newPath[1], {
        public_id: publicId[1],
        overwrite: true,
      });
      const data3 = await cloudinary.uploader.upload(newPath[2], {
        public_id: publicId[2],
        overwrite: true,
      });
      const data4 = await cloudinary.uploader.upload(newPath[3], {
        public_id: publicId[3],
        overwrite: true,
      });
      await cloudinary.uploader.destroy(publicId[0]);
      await cloudinary.uploader.destroy(publicId[1]);
      await cloudinary.uploader.destroy(publicId[2]);
      await cloudinary.uploader.destroy(publicId[3]);
      //return promise
      return [
        { img: data1?.secure_url, publicId: data1?.public_id },
        { img: data2?.secure_url, publicId: data2?.public_id },
        { img: data3?.secure_url, publicId: data3?.public_id },
        { img: data4?.secure_url, publicId: data4?.public_id },
      ];
    }
  } catch (err) {
    // console.log("Error:", err);
    throw new Error("Update failed!");
  }
};

const cloudinaryDeleteImg = async (publicId) => {
  cloudinary.uploader.destroy(publicId, function (error, result) {
    if (error) {
      // console.log("Error:", error);
    } else {
      // console.log("Result:", result);
    }
  });
};

module.exports = {
  cloudinaryUploadImg,
  cloudinaryUploadMultiImg,
  cloudinaryDeleteImg,
  cloudinaryUpdateImg,
};
