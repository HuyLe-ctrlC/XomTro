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
    //.populate("user", "email lastName firstName profilePhoto")
    const keyword = req.query.keyword;
    const offset = req.query.offset;
    const limit = req.query.limit;
    // Do something with the parameters
    console.log("keyword", keyword);
    console.log("offset", offset);
    console.log("limit", limit);
    let searchResult = [];
    if (keyword == "") {
      searchResult = await Category.find({
        $or: [{ title: { $regex: keyword, $options: "i" } }],
      })
        .populate("user", "email lastName firstName profilePhoto")
        .skip(parseInt(offset))
        .limit(parseInt(limit))
        .lean()
        .sort("-createdAt");
    } else {
      console.log(123);
      searchResult = await Category.aggregate([
        {
          $lookup: {
            from: "users",
            localField: "user",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $match: {
            $or: [
              { title: { $regex: keyword, $options: "i" } },
              { "user.firstName": { $regex: keyword, $options: "i" } },
              { "user.lastName": { $regex: keyword, $options: "i" } },
            ],
          },
        },
        {
          $project: {
            title: 1,
            user: {
              //convert array to Object for every field
              $arrayToObject: [
                [
                  {
                    //key & value
                    k: "firstName",
                    v: { $arrayElemAt: ["$user.firstName", 0] },
                  },
                  { k: "lastName", v: { $arrayElemAt: ["$user.lastName", 0] } },
                  { k: "email", v: { $arrayElemAt: ["$user.email", 0] } },
                  {
                    k: "profilePhoto",
                    v: { $arrayElemAt: ["$user.profilePhoto", 0] },
                  },
                ],
              ],
            },
          },
        },
        { $skip: parseInt(offset) },
        { $limit: parseInt(limit) },
      ]);
    }
    console.log("searchResult", Object.keys(searchResult).length);
    const searchCount = Object.keys(searchResult).length;
    // const searchCount = await Category.countDocuments({
    //   title: { $regex: keyword, $options: "i" },
    // });
    const totalPage = Math.ceil(searchCount / limit);
    res.json({ totalPage: totalPage, data: searchResult });
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
