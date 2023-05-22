const expressAsyncHandler = require("express-async-handler");
const User = require("../../model/user/User");
const Xomtro = require("../../model/xomtro/Xomtro");
const Category = require("../../model/category/Category");
const Room = require("../../model/room/Room");
const Invoice = require("../../model/invoice/Invoice");
const Renter = require("../../model/renter/Renter");
const MESSAGE = require("../../utils/constantsMessage");
const validateMongodbId = require("../../utils/validateMongodbID");
const blockUser = require("../../utils/blockUser");
const mongoose = require("mongoose");
const idMaxInRoom = require("../../utils/idMaxInRoom");
const STATUS_ROOM = require("../../utils/statusRoom");

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
  //Display message if user is blocked
  blockUser(req.user);
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
  //Display message if user is blocked
  blockUser(req.user);
  try {
    const { keyword = "", offset = 0, limit = 10, isEmpty } = req.query;
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
      pipeline.push({
        $match: {
          $or: [{ roomName: { $regex: keyword, $options: "i" } }],
        },
      });

      if (isEmpty === "true") {
        pipeline.push({ $match: { rentalStatus: STATUS_ROOM.EMPTY } });
      } else if (isEmpty === "false") {
        pipeline.push({ $match: { rentalStatus: STATUS_ROOM.OCCUPIED } });
      }

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
                isOtherInvoice: "$$invoice.isOtherInvoice",
              },
            },
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
                isOtherInvoice: 1,
              },
            },
          ],
          as: "invoices",
        },
      });
      // Add the $lookup stage to get invoices from rooms
      pipeline.push({
        $lookup: {
          from: "renters",
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
                renterName: 1,
                roomName: 1,
              },
            },
          ],
          as: "renters",
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
    } else {
      res.json({
        data: [],
        searchCount: 0,
        totalPage: 0,
        nameAndServicesXomtro: null,
      });
    }
  } catch (err) {
    res.json(err);
  }
});

const fetchRoomCtrl = expressAsyncHandler(async (req, res) => {
  //Display message if user is blocked
  blockUser(req.user);
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
    await Invoice.deleteMany({ room: id });
    await Renter.deleteMany({ room: id });
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
  //Display message if user is blocked
  blockUser(req.user);
  try {
    const { xomtroId, listRoomId, dataAdded, allRoomId } = req.body;

    const filteredArray = allRoomId.filter(
      (item) => !listRoomId.includes(item._id)
    );

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

    dataAdded["isApplied"] = true;
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

    dataAdded["isApplied"] = false;
    await Promise.all(
      filteredArray.map(async (roomId) => {
        await Room.findByIdAndUpdate(
          roomId?._id,
          {
            $push: { services: dataAdded },
          },
          {
            new: true,
            runValidators: true,
          }
        );
      })
    );

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
  const { xomtroId, listRoomId, dataUpdated, selectedOld } = req.body;
  const filteredArray = selectedOld.filter(
    (item) => !listRoomId.includes(item._id)
  );

  const updateService = async (service) => {
    if (dataUpdated.serviceName !== undefined) {
      service.serviceName = dataUpdated.serviceName;
    }
    if (dataUpdated.price !== undefined) {
      service.price = dataUpdated.price;
    }
    if (dataUpdated.priceTier2 !== undefined) {
      service.priceTier2 = dataUpdated.priceTier2;
    }
    if (dataUpdated.priceTier3 !== undefined) {
      service.priceTier3 = dataUpdated.priceTier3;
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
    service.isApplied = true;
    await service.parent().save();
  };

  const updateServiceNotApplied = async (service) => {
    if (dataUpdated.serviceName !== undefined) {
      service.serviceName = dataUpdated.serviceName;
    }
    if (dataUpdated.price !== undefined) {
      service.price = dataUpdated.price;
    }
    if (dataUpdated.priceTier2 !== undefined) {
      service.priceTier2 = dataUpdated.priceTier2;
    }
    if (dataUpdated.priceTier3 !== undefined) {
      service.priceTier3 = dataUpdated.priceTier3;
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
    service.isApplied = false;
    await service.parent().save();
  };

  try {
    if (filteredArray.length !== 0) {
      await Promise.all(
        filteredArray.map(async (roomId) => {
          const roomTargetedFilter = await Room.findById(roomId?._id);
          const serviceFilter = roomTargetedFilter.services.id(dataUpdated._id);
          if (serviceFilter) {
            await updateServiceNotApplied(serviceFilter);
          }
        })
      );
    }

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
const checkOutOfTheRoomCtrl = expressAsyncHandler(async (req, res) => {
  //1. Get the user
  const user = req.user;
  //check user isBlocked
  blockUser(user);
  const { id } = req.params;

  validateMongodbId(id);
  try {
    const roomUpdated = await Room.findByIdAndUpdate(
      id,
      { $set: { renterIds: [] } },
      { new: true, runValidators: true }
    );
    await Renter.deleteMany({ room: id });
    if (roomUpdated) {
      res.json({
        result: true,
        newData: roomUpdated,
        message: MESSAGE.CHECK_OUT_SUCCESS,
      });
    } else {
      res.json({
        result: false,
        message: MESSAGE.CHECK_OUT_FAILED,
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
  //Display message if user is blocked
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
  checkOutOfTheRoomCtrl,
};
