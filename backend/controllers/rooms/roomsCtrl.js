const expressAsyncHandler = require("express-async-handler");
const User = require("../../model/user/User");
const Xomtro = require("../../model/xomtro/Xomtro");
const Category = require("../../model/category/Category");
const Room = require("../../model/room/Room");
const MESSAGE = require("../../utils/constantsMessage");
const validateMongodbId = require("../../utils/validateMongodbID");
const blockUser = require("../../utils/blockUser");
const mongoose = require("mongoose");
const idMaxInRoom = require("../../utils/idMaxInRoom");
const createRoomCtrl = expressAsyncHandler(async (req, res) => {
  //1. Get the user
  const user = req.user;
  //check user isBlocked
  blockUser(user);
  const { _id } = req.user;
  const { xomtro } = req.body;
  validateMongodbId(_id);
  validateMongodbId(xomtro);
  try {
    const xomtroTarget = await Xomtro.findById({ _id: xomtro });
    if (xomtroTarget) {
      const room = await Room.create({
        ...req.body,
        user: req?.user,
        // price: xomtroTarget.price,
        maxPeople: xomtroTarget.maxPeople,
        services: xomtroTarget.services,
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

    // pipeline.push({
    //   $lookup: {
    //     from: "invoices",
    //     let: { roomId: "$_id" },
    //     pipeline: [
    //       {
    //         $match: {
    //           $expr: {
    //             $and: [{ $eq: ["$room", "$$roomId"] }],
    //           },
    //         },
    //       },
    //       // project invoice fields
    //       {
    //         $project: {
    //           invoiceStatus: 1,
    //           paymentPurpose: 1,
    //         },
    //       },
    //     ],
    //     as: "invoices",
    //   },
    // });

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

        // // extract first element of invoices array
        // invoice: { $arrayElemAt: ["$invoices", 0] },
        // extract all elements of invoices array
        invoices: {
          $map: {
            input: "$invoices",
            as: "invoice",
            in: {
              invoicePurpose: "$$invoice.invoicePurpose",
              invoiceStatus: "$$invoice.invoiceStatus",
            },
          },
        },
      },
    });

    // Add the $lookup stage to get invoices from rooms
    pipeline.push({
      $lookup: {
        from: "invoices",
        let: { roomId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [{ $eq: ["$room", "$$roomId"] }],
              },
            },
          },
          // project invoice fields
          {
            $project: {
              invoicePurpose: 1,
              invoiceStatus: 1,
            },
          },
        ],
        as: "invoices",
      },
    });

    //@note Get all data (specific field above) when a collection does not contain _id
    // Add the $lookup stage to get invoices from rooms
    // pipeline.push({
    //   $lookup: {
    //     from: "invoices",
    //     localField: "_id",
    //     foreignField: "room",
    //     as: "invoices",
    //   },
    // });

    // Add the $lookup stage to get invoices from rooms

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

    //get name Xomtro
    const nameAndServicesXomtro = await Xomtro.findById(xomtroId).select(
      "nameXomtro services"
    );
    res.json({
      data: searchResult,
      searchCount: searchCount[0]?.total || 0,
      totalPage,
      nameAndServicesXomtro,
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
    ).populate({ path: "invoice", select: "invoiceStatus paymentPurpose" });
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
        roomId: deleteRoom._id,
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
    const { xomtroId, listRoomId, dataAdded } = req.body;

    const room = await Room.find({ xomtro: xomtroId }).select("services");
    let maxIdServiceInRoom = idMaxInRoom(room);
    const xomtro = await Xomtro.findById(xomtroId);
    let latestId = 0;

    if (xomtro && xomtro.services && xomtro.services.length > 0) {
      latestId = xomtro.services[xomtro.services.length - 1]._id;
    }

    if (maxIdServiceInRoom < latestId) {
      dataAdded["_id"] = latestId + 1;
    } else {
      dataAdded["_id"] = maxIdServiceInRoom + 1;
    }

    for (const roomId of listRoomId) {
      await Room.findByIdAndUpdate(
        roomId,
        {
          $push: { services: dataAdded },
        },
        {
          new: true,
          runValidators: true,
        }
      );
    }

    dataAdded["appliedBy"] = listRoomId;

    const xomtroTargeted = await Xomtro.findByIdAndUpdate(
      xomtroId,
      {
        $push: { services: dataAdded },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    res.json({
      result: true,
      newData: xomtroTargeted.services,
      message: MESSAGE.UPDATE_SUCCESS,
    });
  } catch (error) {
    res.json(error);
  }
});
//update multi for all room or some room
const updateUtilityCtrl = expressAsyncHandler(async (req, res) => {
  const { xomtroId, listRoomId, dataUpdated } = req.body;

  const updateService = async (service) => {
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
    if (dataUpdated.measurement !== undefined) {
      service.measurement = dataUpdated.measurement;
    }
    await service.parent().save();
  };

  try {
    await Promise.all(
      listRoomId.map(async (roomId) => {
        const roomTargeted = await Room.findById(roomId);
        const service = roomTargeted.services.id(dataUpdated._id);
        if (service) {
          await updateService(service);
        }
      })
    );

    const xomtroTargeted = await Xomtro.findById(xomtroId);
    const serviceXomtro = xomtroTargeted.services.id(dataUpdated._id);
    if (serviceXomtro) {
      serviceXomtro.appliedBy = listRoomId;
      await updateService(serviceXomtro);
    }

    res.json({
      result: true,
      newData: xomtroTargeted.services,
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

/*-------------------
//TODO: Get utility HUYPRO
//-------------------*/
const getUtilityByIdCtrl = expressAsyncHandler(async (req, res) => {
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
    let dataUpdate = {
      price: found.price,
      nameService: found.serviceName,
      measurement: found.measurement,
      paymentMethod: found.paymentMethod,
      _id: found._id,
    };
    res.json({ result: true, dataUpdate });
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
  getUtilityByIdCtrl,
};
