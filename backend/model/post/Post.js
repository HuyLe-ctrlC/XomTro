const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
  // img: {
  //   type: String,
  //   default:
  //     "https://res.cloudinary.com/huyleminh/image/upload/v1675929721/avatar-default_yxdthk.png",
  // },
  // publicId: {
  //   type: String,
  // },
  filename: { type: String, required: true },
  preview: { type: String, required: true },
  type: { type: String, required: true },
});

const citySchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: [true, "Thành phố là bắt buộc"] },
});
const districtSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: [true, "Quận/huyện là bắt buộc"] },
});
const wardSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: [true, "Phường/xã là bắt buộc"] },
  prefix: { type: String, required: [true, "Tiền tố phường/xã là bắt buộc"] },
});

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Post title is required"],
      trim: true,
    },
    removeVietnameseTonesTitle: {
      type: String,
      required: [true, "Remove vietnamese tones title is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      default: "All",
    },
    price: {
      type: String,
      required: [true, "Price is required"],
    },
    acreage: {
      type: String,
      required: [true, "Acreage is required"],
    },
    electricityPrice: {
      type: String,
      required: [true, "Electricity Price is required"],
    },
    waterPrice: {
      type: String,
      required: [true, "Water Price is required"],
    },
    isLiked: {
      type: Boolean,
      default: false,
    },
    isDisLiked: {
      type: Boolean,
      default: false,
    },
    numViews: {
      type: Number,
      default: 0,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    disLikes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please Author is required"],
    },
    // description: {
    //   type: String,
    //   required: [true, "Post description is required"],
    // },
    city: citySchema,
    district: districtSchema,
    ward: wardSchema,
    addressDetail: {
      type: String,
      required: [true, "Address detail is required"],
    },
    houseLessor: {
      type: String,
      required: [true, "House lessor is required"],
    },
    phoneNumber: {
      type: String,
      required: [true, "Number phone is required"],
    },
    image: [imageSchema],
    isPublish: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
    timestamps: true,
  }
);

//populate comments
postSchema.virtual("comments", {
  ref: "Comment",
  foreignField: "post",
  localField: "_id",
});


postSchema.pre("remove", async function (next) {
  try {
    // Delete all comments that belong to the post
    await Comment.deleteMany({ post: this._id });

    // Call the next middleware function to continue with deleting the post
    next();
  } catch (err) {
    // Handle the error if the deletion of the comments fails
    next(err);
  }
});

//compile

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
