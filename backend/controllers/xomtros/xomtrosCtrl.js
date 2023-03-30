const expressAsyncHandler = require("express-async-handler");
const User = require("../../model/user/User");
const Xomtro = require("../../model/xomtro/Xomtro");
const Category = require("../../model/category/Category");
const Room = require("../../model/room/Room");
const MESSAGE = require("../../utils/constantsMessage");
const { removeVietnameseTones } = require("../../utils/slug");
const validateMongodbId = require("../../utils/validateMongodbID");
const blockUser = require("../../utils/blockUser");
const idMaxInRoom = require("../../utils/idMaxInRoom");
const createXomtroCtrl = expressAsyncHandler(async (req, res) => {
  //1. Get the user
  const user = req.user;
  //check user isBlocked
  blockUser(user);
  const { _id } = req.user;
  validateMongodbId(_id);
  const { numberRoom, numberOfFloors } = req.body;
  try {
    const xomtro = await Xomtro.create({
      ...req.body,
      user: req?.user,
      services: req.body.services.map((service, index) => {
        return {
          ...service,
          _id: index + 1,
        };
      }),
    });
    // Create rooms
    const rooms = [];
    let roomCount = 1;
    for (let i = 1; i <= numberOfFloors; i++) {
      for (let j = 1; j <= numberRoom; j++) {
        const room = await Room.create({
          xomtro: xomtro._id,
          user: req?.user,
          roomName: `Phòng ${roomCount.toString()}`,
          floor: `Tầng ${i.toString()}`,
          acreage: req.body.acreage,
          price: req.body.price,
          maxPeople: req.body.maxPeople,
          // services: req.body.services,
          services: req.body.services.map((service, index) => {
            return {
              ...service,
              _id: index + 1,
            };
          }),
          internetServices: req.body.internetServices,
          invoiceDate: req.body.invoiceDate,
          paymentDeadline: req.body.paymentDeadline,
        });
        rooms.push(room);
        roomCount++;
      }
    }
    //plus 1 xomtroCount when xomtro created
    await User.findByIdAndUpdate(
      _id,
      {
        $inc: { xomtroCount: 1 },
      },
      {
        new: true,
      }
    );
    res.json({
      result: true,
      data: { xomtro, rooms },
      message: MESSAGE.MESSAGE_SUCCESS,
    });
  } catch (error) {
    res.json(error);
  }
});

const fetchXomtrosCtrl = expressAsyncHandler(async (req, res) => {
  try {
    const { keyword = "", offset = 0, limit = 10 } = req.query;
    let pipeline = [];

    pipeline.push({
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "user",
      },
    });
    pipeline.push({
      $lookup: {
        from: "categories",
        localField: "category",
        foreignField: "_id",
        as: "category",
      },
    });
    pipeline.push({
      $match: {
        $or: [
          { nameXomtro: { $regex: keyword, $options: "i" } },
          { "user.firstName": { $regex: keyword, $options: "i" } },
          { "user.lastName": { $regex: keyword, $options: "i" } },
        ],
      },
    });
    pipeline.push({
      $project: {
        nameXomtro: 1,
        numberRoom: 1,
        category: 1,
        numberOfFloors: 1,
        acreage: 1,
        price: 1,
        maxPeople: 1,
        createdAt: 1,
        updatedAt: 1,
        addressDetail: 1,
        services: 1,
        internetServices: 1,
        assetManagement: 1,
        vehicleManagement: 1,
        invoiceDate: 1,
        paymentDeadline: 1,
        roomCount: 1,
        user: {
          $arrayToObject: [
            [
              {
                k: "firstName",
                v: { $arrayElemAt: ["$user.firstName", 0] },
              },
              {
                k: "lastName",
                v: { $arrayElemAt: ["$user.lastName", 0] },
              },
              { k: "email", v: { $arrayElemAt: ["$user.email", 0] } },
              {
                k: "profilePhoto",
                v: { $arrayElemAt: ["$user.profilePhoto", 0] },
              },
            ],
          ],
        },
        category: {
          $arrayToObject: [
            [
              {
                k: "title",
                v: { $arrayElemAt: ["$category.title", 0] },
              },
              {
                k: "_id",
                v: { $arrayElemAt: ["$category._id", 0] },
              },
            ],
          ],
        },
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
    const [result] = await Xomtro.aggregate(pipeline);
    const [resultNoLimit] = await Xomtro.aggregate(updatedPipeline);
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

const deleteXomtroCtrl = expressAsyncHandler(async (req, res) => {
  //1. Get the user
  const user = req.user;
  //check user isBlocked
  blockUser(user);
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const deleteXomtro = await Xomtro.findByIdAndDelete(id);
    await Room.deleteMany({ xomtro: id });
    if (deleteXomtro) {
      res.json({
        result: true,
        _id: deleteXomtro._id,
        message: MESSAGE.DELETE_SUCCESS,
      });
    } else {
      res.json({ result: false, message: MESSAGE.DELETE_FAILED });
    }
  } catch (error) {
    res.json(error);
  }
});

const updateXomtroCtrl = expressAsyncHandler(async (req, res) => {
  //1. Get the user
  const user = req.user;
  //check user isBlocked
  blockUser(user);
  const { id } = req.params;
  validateMongodbId(id);

  try {
    const updateXomtro = await Xomtro.findByIdAndUpdate(
      id,
      {
        ...req?.body,
      },
      { new: true, runValidators: true }
    );
    await Room.updateMany({ xomtro: id }, { $set: { ...req.body } });
    if (updateXomtro) {
      res.json({
        result: true,
        message: MESSAGE.UPDATE_SUCCESS,
        newData: updateXomtro,
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

const addUtilityXomtroCtrl = expressAsyncHandler(async (req, res) => {
  //1. Get the user
  const user = req.user;
  //check user isBlocked
  blockUser(user);
  try {
    const { id, dataAdded } = req.body;
    const room = await Room.find({ xomtro: id }).select("services");
    let maxID = idMaxInRoom(room);
    const xomtro = await Xomtro.findById(id);
    let latestId = 0;
    if (xomtro && xomtro.services && xomtro.services.length > 0) {
      latestId = xomtro.services[xomtro.services.length - 1]._id;
    }

    if (maxID < latestId) {
      dataAdded["_id"] = latestId + 1;
    } else {
      dataAdded["_id"] = maxID + 1;
    }

    await Xomtro.findByIdAndUpdate(
      id,
      {
        $push: { services: dataAdded },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    await Room.updateMany(
      { xomtro: id },
      {
        $push: { services: dataAdded },
      },
      { multi: true }
    );

    res.json({
      result: true,
      message: MESSAGE.UPDATE_SUCCESS,
    });
  } catch (error) {
    res.json(error);
  }
});

module.exports = {
  createXomtroCtrl,
  fetchXomtrosCtrl,
  deleteXomtroCtrl,
  updateXomtroCtrl,
  addUtilityXomtroCtrl,
};
