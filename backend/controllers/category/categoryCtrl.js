const expressAsyncHandler = require("express-async-handler");
const Category = require("../../model/category/Category");
const validateMongodbId = require("../../utils/validateMongodbID");
const MESSAGE = require("../../utils/constantsMessage");
/*-------------------
//TODO: Create a Category
//-------------------*/
const createCategoryCtrl = expressAsyncHandler(async (req, res) => {
  try {
    if (req?.body?.title) {
      // const { firstName, lastName, email, profilePhoto } = req?.user;
      const category = await Category.create({
        user: req?.user,
        title: req?.body?.title,
      });
      res.json({
        result: true,
        data: category,
        message: MESSAGE.MESSAGE_SUCCESS,
      });
    } else {
      res.json({
        result: false,
        message: MESSAGE.MESSAGE_FAILED,
      });
    }
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
    // console.log("keyword", keyword);
    // console.log("offset", offset);
    // console.log("limit", limit);
    let searchResult = [];
    let searchCount = 0;
    if (keyword == "") {
      searchCount = await Category.countDocuments({
        title: { $regex: keyword, $options: "i" },
      });
      searchResult = await Category.find({
        $or: [{ title: { $regex: keyword, $options: "i" } }],
      })
        .populate("user", "email lastName firstName profilePhoto")
        .skip(parseInt(offset))
        .limit(parseInt(limit))
        .lean()
        .sort("-createdAt");
    } else {
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
      const count = await Category.aggregate([
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
        { $count: "total" },
      ]);
      searchCount = count[0].total;
    }
    // const searchCount = Object.keys(searchResult).length;

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
    if (req?.body?.title) {
      const updateCategory = await Category.findByIdAndUpdate(
        id,
        {
          title: req?.body?.title,
        },
        { new: true, runValidators: true }
      ).populate("user", "email lastName firstName profilePhoto");
      res.json({
        result: true,
        message: MESSAGE.UPDATE_SUCCESS,
        newData: updateCategory,
      });
    } else {
      res.json({
        result: false,
        message: MESSAGE.MESSAGE_FAILED,
      });
    }
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
    if (deleteCategory) {
      // res.json(deleteCategory);
      res.json({
        result: true,
        message: MESSAGE.MESSAGE_SUCCESS,
        _id: deleteCategory._id,
      });
    } else {
      res.json({ result: false, message: MESSAGE.MESSAGE_FAILED });
    }
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
