const expressAsyncHandler = require("express-async-handler");
const User = require("../../model/user/User");
const Xomtro = require("../../model/xomtro/Xomtro");
const Category = require("../../model/category/Category");
const Room = require("../../model/room/Room");
const Invoice = require("../../model/invoice/Invoice");
const Renter = require("../../model/renter/Renter");
const MESSAGE = require("../../utils/constantsMessage");
const { removeVietnameseTones } = require("../../utils/slug");
const validateMongodbId = require("../../utils/validateMongodbID");
const blockUser = require("../../utils/blockUser");
const idMaxInRoom = require("../../utils/idMaxInRoom");
const { default: mongoose } = require("mongoose");
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
    const xomtroCountByUser = await Xomtro.countDocuments({ user: _id });

    res.json({
      result: true,
      data: { xomtro, rooms },
      message: MESSAGE.MESSAGE_SUCCESS,
      searchCount: xomtroCountByUser,
    });
  } catch (error) {
    res.json(error);
  }
});

const fetchXomtrosCtrl = expressAsyncHandler(async (req, res) => {
  blockUser(req.user);
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
        isPublish: 1,
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

/*-------------------
//TODO: Fetch Xomtro By User
//-------------------*/

const fetchXomtroByUserCtrl = expressAsyncHandler(async (req, res) => {
  blockUser(req.user);
  const { _id } = req.user;

  const { keyword = "", offset = 0, limit = 10, publish } = req.query;
  let pipeline = [];
  try {
    if (publish === "true") {
      pipeline.push({ $match: { isPublish: true } });
    } else if (publish === "false") {
      pipeline.push({ $match: { isPublish: false } });
    }

    pipeline.push({
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "user",
      },
    });

    pipeline.push({
      $match: {
        "user._id": _id,
        $or: [
          {
            nameXomtro: {
              $regex: keyword,
              $options: "i",
            },
          },
          {
            "user.firstName": {
              $regex: removeVietnameseTones(keyword),
              $options: "i",
            },
          },
          {
            "user.lastName": {
              $regex: removeVietnameseTones(keyword),
              $options: "i",
            },
          },
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
        isPublish: 1,
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
        renters: {
          $map: {
            input: "$renters",
            as: "renter",
            in: {
              renterName: "$$renter.renterName",
              roomName: "$$renter.roomName",
            },
          },
        },
      },
    });

    // Add the $lookup stage to get invoices from rooms
    pipeline.push({
      $lookup: {
        from: "renters",
        let: { xomtroId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [{ $eq: ["$xomtro", "$$xomtroId"] }],
              },
            },
          },
          // project invoice fields
          {
            $project: {
              renterName: 1,
              roomName: 1,
            },
          },
        ],
        as: "renters",
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
  } catch (error) {
    res.json(error);
  }
});

/*-------------------
//TODO: Fetch Xomtro By ID
//-------------------*/

const fetchXomtroCtrl = expressAsyncHandler(async (req, res) => {
  blockUser(req.user);
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const xomtro = await Xomtro.findById(id);

    if (xomtro) {
      res.json({
        result: true,
        data: xomtro,
        message: MESSAGE.GET_DATA_SUCCESS,
      });
    } else {
      res.json({ result: false, message: MESSAGE.DATA_NOT_FOUND });
    }
  } catch (error) {
    res.json(error);
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
    await Invoice.deleteMany({ xomtro: id });
    await Renter.deleteMany({ xomtro: id });
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

/*-------------------
//TODO: Get utility applied HUYPRO
//-------------------*/
const getUtilityAppliedByIdCtrl = expressAsyncHandler(async (req, res) => {
  blockUser(req.user);
  const { xomtroId, serviceId } = req.query;
  validateMongodbId(xomtroId);
  try {
    // const xomtroTargeted = await Xomtro.findById({
    //   _id: xomtroId,
    // }).select("services");
    const xomtroTargeted = await Xomtro.findById({ _id: xomtroId })
      .select("services")
      .populate({
        path: "services.appliedBy",
        model: "Room",
        select: "roomName",
      });
    if (!xomtroTargeted) {
      return res.json({ result: false, message: MESSAGE.NOT_FOUND_XOMTRO });
    }
    const found = xomtroTargeted.services.find(
      (element) => element._id == serviceId
    );
    let appliedBy = found.appliedBy;
    // if (appliedBy.length === 0) {
    //   appliedBy = await Room.find({ xomtro: xomtroId }).select("roomName");
    // }
    res.json({ result: true, data: appliedBy });
  } catch (error) {
    res.json(error);
  }
});

const updateStatusCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const { publish } = req.body;
    const xomtro = await Xomtro.findByIdAndUpdate(
      id,
      {
        isPublish: publish,
      },
      { new: true }
    );
    if (xomtro) {
      res.json({
        result: true,
        data: xomtro,
        message: MESSAGE.UPDATE_SUCCESS,
      });
    } else {
      res.json({
        result: false,
        message: MESSAGE.UPDATE_SUCCESS,
      });
    }
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
  fetchXomtroCtrl,
  fetchXomtroByUserCtrl,
  getUtilityAppliedByIdCtrl,
  updateStatusCtrl,
};
