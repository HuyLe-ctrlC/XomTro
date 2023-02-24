const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
  img: {
    type: String,
    default:
      "https://res.cloudinary.com/huyleminh/image/upload/v1675929721/avatar-default_yxdthk.png",
  },
  publicId: {
    type: String,
  },
});

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Post title is required"],
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
    description: {
      type: String,
      required: [true, "Post description is required"],
    },
    city: {
      type: String,
      required: [true, "City is required"],
    },
    district: {
      type: String,
      required: [true, "District is required"],
    },
    ward: {
      type: String,
      required: [true, "Ward is required"],
    },
    image: [imageSchema],
    // image: {
    //   type: String,
    //   default:
    //     "https://res.cloudinary.com/huyleminh/image/upload/v1675929721/avatar-default_yxdthk.png",
    // },
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
    timestamp: true,
  }
);

//compile

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
