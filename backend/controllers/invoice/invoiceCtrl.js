const expressAsyncHandler = require("express-async-handler");
const User = require("../../model/user/User");
const Xomtro = require("../../model/xomtro/Xomtro");
const Category = require("../../model/category/Category");
const Room = require("../../model/room/Room");
const Invoice = require("../../model/invoice/Invoice");
const MESSAGE = require("../../utils/constantsMessage");
const validateMongodbId = require("../../utils/validateMongodbID");
const blockUser = require("../../utils/blockUser");
const mongoose = require("mongoose");
const idMaxInRoom = require("../../utils/idMaxInRoom");
const maxLengthElement = require("../../utils/maxLengthElement");

const createInvoiceRoomCtrl = expressAsyncHandler(async (req, res) => {
  //get the user
  const user = req.user;
  blockUser(user);
  try {
    const invoice = await Invoice.create({
      ...req.body,
    });
    await Room.findByIdAndUpdate(
      invoice.room,
      {
        $push: { invoice: invoice.id },
      },
      { new: true }
    ).populate({
      path: "invoice",
      select:
        "invoiceStatus",
    });
    res.json({
      result: true,
      data: invoice,
      message: MESSAGE.UPDATE_SUCCESS,
    });
  } catch (error) {
    res.json(error);
  }
});

const createInvoiceMultiRoomCtrl = expressAsyncHandler(async (req, res) => {
  //get the user
  const user = req.user;
  blockUser(user);
  const { listRoomId } = req.body;

  try {
    // const invoices = await Promise.all(
    //   listRoomId.map(async (roomId) => {
    //     await Invoice.create({
    //       room: roomId,
    //       ...req.body,
    //     });
    //     return await Invoice.findOne({
    //       room: mongoose.Types.ObjectId(roomId),
    //     }).populate({
    //       path: "room",
    //       select: "roomName",
    //     });
    //   })
    // );
    // res.json({
    //   result: true,
    //   data: invoices.flat(),
    //   message: MESSAGE.UPDATE_SUCCESS,
    // });
    //@note Promise.allSettle
    const results = await Promise.allSettled(
      listRoomId.map(async (roomId) => {
        const invoice = await Invoice.create({
          room: roomId,
          ...req.body,
        });
        return Invoice.findOne({
          room: mongoose.Types.ObjectId(roomId),
        })
          .sort("-createdAt")
          .populate({
            path: "room",
            select: "roomName",
          });
      })
    );

    const invoices = results
      .filter((result) => result.status === "fulfilled")
      .map((result) => result.value);

    res.json({
      result: true,
      data: invoices,
      message: MESSAGE.UPDATE_SUCCESS,
    });
  } catch (error) {
    res.json(error);
  }
});

const fetchInvoicesCtrl = expressAsyncHandler(async (req, res) => {
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
      $lookup: {
        from: "rooms",
        localField: "room",
        foreignField: "_id",
        as: "room",
      },
    });

    pipeline.push({
      $match: {
        $or: [
          {
            "room.roomName": {
              $regex: keyword,
              $options: "i",
            },
          },
        ],
      },
    });

    pipeline.push({
      $project: {
        xomtro: 1,
        services: 1,
        invoiceMonth: 1,
        paymentPurpose: 1,
        invoiceDate: 1,
        paymentDeadline: 1,
        numberOfMonths: 1,
        numberOfDays: 1,
        total: 1,
        isTakeProfit: 1,
        invoiceStatus: 1,
        createdAt: 1,
        updatedAt: 1,
        room: {
          $arrayToObject: [
            [
              {
                k: "roomName",
                v: { $arrayElemAt: ["$room.roomName", 0] },
              },
              {
                k: "_id",
                v: { $arrayElemAt: ["$room._id", 0] },
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
    const [result] = await Invoice.aggregate(pipeline);
    const [resultNoLimit] = await Invoice.aggregate(updatedPipeline);
    const { searchResult = [], searchCount = [] } = result;

    const {
      searchResult: searchResultNoLimit = [],
      searchCount: searchCountRename = [],
    } = resultNoLimit;
    const totalPage = Math.ceil(searchCountRename[0]?.total / limit);

    const roomServices = await Room.find({ xomtro: xomtroId }).select(
      "services"
    );
    const maxService = maxLengthElement(roomServices);

    res.json({
      data: searchResult,
      searchCount: searchCount[0]?.total || 0,
      maxService,
      totalPage,
    });
  } catch (err) {
    res.json(err);
  }
});

const fetchInvoiceById = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    //@note populate with specific data
    //!HUYPRO
    const invoice = await Invoice.findById(id).populate({
      path: "room",
      select: "roomName price",
    });

    if (invoice) {
      res.json({
        result: true,
        data: invoice,
        message: MESSAGE.GET_DATA_SUCCESS,
      });
    } else {
      res.json({ result: false, message: MESSAGE.DATA_NOT_FOUND });
    }
  } catch (error) {
    res.json(error);
  }
});

const updateInvoiceRoomCtrl = expressAsyncHandler(async (req, res) => {
  //get the user
  const user = req.user;
  blockUser(user);
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const updateInvoice = await Invoice.findByIdAndUpdate(
      id,
      {
        ...req?.body,
      },
      { new: true, runValidators: true }
    ).populate({
      path: "room",
      select: "roomName",
    });
    await updateInvoice.save();
    if (updateInvoice) {
      res.json({
        result: true,
        message: MESSAGE.UPDATE_SUCCESS,
        newData: updateInvoice,
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

const deleteInvoiceCtrl = expressAsyncHandler(async (req, res) => {
  //1. Get the user
  const user = req.user;
  //check user isBlocked
  blockUser(user);
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const deleteInvoice = await Invoice.findByIdAndDelete(id);
    if (deleteInvoice) {
      res.json({
        result: true,
        _id: deleteInvoice._id,
        message: MESSAGE.DELETE_SUCCESS,
      });
    } else {
      res.json({ result: false, message: MESSAGE.DELETE_FAILED });
    }
  } catch (error) {
    res.json(error);
  }
});

module.exports = {
  createInvoiceRoomCtrl,
  updateInvoiceRoomCtrl,
  fetchInvoicesCtrl,
  deleteInvoiceCtrl,
  fetchInvoiceById,
  createInvoiceMultiRoomCtrl,
};
