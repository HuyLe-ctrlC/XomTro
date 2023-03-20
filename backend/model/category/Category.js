const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      on_delete: "cascade",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
//populate comments
categorySchema.virtual("posts", {
  ref: "Post",
  foreignField: "category",
  localField: "_id",
});
const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
