const expressAsyncHandler = require("express-async-handler");
const User = require("../../model/user/User");
const Xomtro = require("../../model/xomtro/Xomtro");
const Category = require("../../model/category/Category");
const Room = require("../../model/room/Room");
const MESSAGE = require("../../utils/constantsMessage");
const validateMongodbId = require("../../utils/validateMongodbID");
const blockUser = require("../../utils/blockUser");
const mongoose = require("mongoose");
const createRoomCtrl = expressAsyncHandler(async (req, res) => {
  //1. Get the user
  const user = req.user;
  //check user isBlocked
  blockUser(user);
  const { _id } = req.user;
  validateMongodbId(_id);
  const { xomtro } = req.body;
  try {
    const xomtroTarget = await Xomtro.findById({ _id: xomtro });
    if (xomtroTarget) {
      const room = await Room.create({
        ...req.body,
        user: req?.user,
        price: xomtroTarget.price,
        maxPeople: xomtroTarget.maxPeople,
        services: xomtroTarget.services,
        internetServices: xomtroTarget.internetServices,
        invoiceDate: xomtroTarget.invoiceDate,
        paymentDeadline: xomtroTarget.paymentDeadline,
      });
      await Xomtro.findByIdAndUpdate(
        xomtro,
        {
          $inc: { roomCount: 1 },
        },
        {
          new: true,
        }
      );
      await room.save();
      res.json({
        result: true,
        data: room,
        message: MESSAGE.MESSAGE_SUCCESS,
      });
    } else {
      res.json({
        result: false,
        message: MESSAGE.NOT_FOUND_XOMTRO,
      });
    }
  } catch (error) {
    res.json(error);
  }
});

const fetchRoomsCtrl = expressAsyncHandler(async (req, res) => {
  try {
    const { keyword = "", offset = 0, limit = 10 } = req.query;
    let pipeline = [];

    pipeline.push({
      $match: {
        $or: [{ roomName: { $regex: keyword, $options: "i" } }],
      },
    });
    pipeline.push({
      $project: {
        roomName: 1,
        floor: 1,
        acreage: 1,
        price: 1,
        maxPeople: 1,
        createdAt: 1,
        updatedAt: 1,
        services: 1,
        internetServices: 1,
        invoiceDate: 1,
        paymentDeadline: 1,
        rentalStatus: 1,
        paymentStatus: 1,
        securityDeposit: 1,
        moveInDate: 1,
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
    const [result] = await Room.aggregate(pipeline);
    const [resultNoLimit] = await Room.aggregate(updatedPipeline);
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

const fetchRoomsByIdXomTroCtrl = expressAsyncHandler(async (req, res) => {
  try {
    const { keyword = "", offset = 0, limit = 10 } = req.query;
    const xomtroId = req.query.xomtroId
      ? mongoose.Types.ObjectId(req.query.xomtroId)
      : null;
    let pipeline = [];

    if (xomtroId) {
      pipeline.push({
        $match: {
          xomtro: xomtroId,
        },
      });
    }

    pipeline.push({
      $match: {
        $or: [{ roomName: { $regex: keyword, $options: "i" } }],
      },
    });

    pipeline.push({
      $project: {
        roomName: 1,
        floor: 1,
        acreage: 1,
        price: 1,
        maxPeople: 1,
        createdAt: 1,
        updatedAt: 1,
        services: 1,
        internetServices: 1,
        invoiceDate: 1,
        paymentDeadline: 1,
        rentalStatus: 1,
        paymentStatus: 1,
        securityDeposit: 1,
        moveInDate: 1,
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
    const [result] = await Room.aggregate(pipeline);
    const [resultNoLimit] = await Room.aggregate(updatedPipeline);
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

const fetchRoomCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const room = await Room.findById(id);

    if (room) {
      res.json({
        result: true,
        data: room,
        message: MESSAGE.GET_DATA_SUCCESS,
      });
    } else {
      res.json({ result: false, message: MESSAGE.DATA_NOT_FOUND });
    }
  } catch (error) {
    res.json(error);
  }
});

const updateRoomCtrl = expressAsyncHandler(async (req, res) => {
  //1. Get the user
  const user = req.user;
  //check user isBlocked
  blockUser(user);
  const { id } = req.params;
  validateMongodbId(id);

  try {
    const updateRoom = await Room.findByIdAndUpdate(
      id,
      {
        ...req?.body,
      },
      { new: true, runValidators: true }
    );
    if (updateRoom) {
      res.json({
        result: true,
        message: MESSAGE.UPDATE_SUCCESS,
        newData: updateRoom,
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

const deleteRoomCtrl = expressAsyncHandler(async (req, res) => {
  //1. Get the user
  const user = req.user;
  //check user isBlocked
  blockUser(user);
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const deleteRoom = await Room.findByIdAndDelete(id);

    // res.json(deleteRoom);
    if (deleteRoom) {
      res.json({
        result: true,
        data: deleteRoom,
        message: MESSAGE.DELETE_SUCCESS,
      });
    } else {
      res.json({
        result: false,
        message: MESSAGE.DELETE_FAILED,
      });
    }
  } catch (error) {
    res.json(error);
  }
});

//add multi for all room or some room
const addUtilityCtrl = expressAsyncHandler(async (req, res) => {
  try {
    const updates = req.body;

    for (const update of updates) {
      const { id, dataAdded } = update;

      // Get the latest _id used in the services array
      const room = await Room.findById(id);
      let latestId = 0;
      if (room && room.services && room.services.length > 0) {
        latestId = room.services[room.services.length - 1]._id;
      }

      dataAdded["_id"] = latestId + 1;

      await Room.findByIdAndUpdate(
        id,
        {
          $push: { services: dataAdded },
        },
        {
          new: true,
          runValidators: true,
        }
      );
    }

    res.json({
      result: true,
      message: MESSAGE.UPDATE_SUCCESS,
    });
  } catch (error) {
    res.json(error);
  }
});
//update multi for all room or some room
const updateUtilityCtrl = expressAsyncHandler(async (req, res) => {
  const updates = req.body;
  try {
    await Promise.all(
      updates.map(async (update) => {
        const { id, dataUpdated } = update;
        const roomTargeted = await Room.findById(id);
        const service = roomTargeted.services.id(dataUpdated._id);
        if (service) {
          if (dataUpdated.serviceName !== undefined) {
            service.serviceName = dataUpdated.serviceName;
          }
          if (dataUpdated.price !== undefined) {
            service.price = dataUpdated.price;
          }
          if (dataUpdated.paymentMethod !== undefined) {
            service.paymentMethod = dataUpdated.paymentMethod;
          }
          if (dataUpdated.oldValue !== undefined) {
            service.oldValue = dataUpdated.oldValue;
          }
          if (dataUpdated.newValue !== undefined) {
            service.newValue = dataUpdated.newValue;
          }
          await roomTargeted.save();
        }
      })
    );

    res.json({
      result: true,
      message: MESSAGE.UPDATE_SUCCESS,
    });
  } catch (error) {
    res.json(error);
  }
});

const deleteUtilityCtrl = expressAsyncHandler(async (req, res) => {
  //1. Get the user
  const user = req.user;
  //check user isBlocked
  blockUser(user);
  const { id } = req.params;
  const { xomtroId } = req.body;
  // validateMongodbId(id);
  try {
    await Xomtro.updateMany(
      { _id: xomtroId },
      { $pull: { services: { _id: parseInt(id) } } },
      { multi: true }
    );
    const result = await Room.updateMany(
      {},
      { $pull: { services: { _id: parseInt(id) } } },
      { multi: true }
    );
    if (result) {
      res.json({
        result: true,
        message: MESSAGE.DELETE_SUCCESS,
      });
    } else {
      res.json({
        result: false,
        message: MESSAGE.DELETE_FAILED,
      });
    }
  } catch (error) {
    res.json(error);
  }
});

module.exports = {
  createRoomCtrl,
  fetchRoomsCtrl,
  updateRoomCtrl,
  deleteRoomCtrl,
  addUtilityCtrl,
  updateUtilityCtrl,
  deleteUtilityCtrl,
  fetchRoomsByIdXomTroCtrl,
  fetchRoomCtrl,
};
