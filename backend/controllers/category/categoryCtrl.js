const expressAsyncHandler = require("express-async-handler");
const Category = require("../../model/category/Category");
const validateMongodbId = require("../../utils/validateMongodbID");
/*-------------------
//TODO: Create a Category
//-------------------*/
const createCategoryCtrl = expressAsyncHandler(async (req, res) => {
  try {
    const category = await Category.create({
      user: req?.user?._id,
      title: req?.body?.title,
    });
    res.json(category);
  } catch (error) {
    res.json(error);
  }
});

/*-------------------
//TODO: Fetch all Categories
//-------------------*/

const fetchCategoriesCtrl = expressAsyncHandler(async (req, res) => {
  try {
    const categories = await Category.find({})
      .populate("user")
      .sort("-createdAt");
    res.json(categories);
  } catch (error) {
    res.json(error);
  }
});

/*-------------------
//TODO: Search Categories
//-------------------*/
const searchCategoryCtrl = expressAsyncHandler(async (req, res) => {
  try {
    const keyword = req.query.keyword;
    const offset = req.query.offset;
    const limit = req.query.limit;
    // Do something with the parameters

    // console.log("keyword", keyword);
    // console.log("offset", offset);
    // console.log("limit", limit);
    const searchResult = await Category.find({
      $or: [{ title: { $regex: keyword, $options: "i" } }],
    })
      .skip(parseInt(offset))
      .limit(parseInt(limit));
    const searchCount = await Category.countDocuments({
      title: { $regex: keyword, $options: "i" },
    });
    res.json({ totalPage: searchCount, data: searchResult });
  } catch (err) {
    res.json(err);
  }
});
/*-------------------
//TODO: Fetch a Category
//-------------------*/

const fetchCategoryCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const category = await Category.findById(id).populate("user");
    res.json(category);
  } catch (error) {
    res.json(error);
  }
});

/*-------------------
//TODO: Update a Category
//-------------------*/

const updateCategoryCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const updateCategory = await Category.findByIdAndUpdate(
      id,
      {
        title: req?.body?.title,
      },
      { new: true, runValidators: true }
    );
    res.json(updateCategory);
  } catch (error) {
    res.json(error);
  }
});

/*-------------------
//TODO: Delete a Category
//-------------------*/

const deleteCategoryCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const deleteCategory = await Category.findByIdAndDelete(id);
    res.json(deleteCategory);
  } catch (error) {
    res.json(error);
  }
});

module.exports = {
  createCategoryCtrl,
  fetchCategoriesCtrl,
  fetchCategoryCtrl,
  updateCategoryCtrl,
  deleteCategoryCtrl,
  searchCategoryCtrl,
};
