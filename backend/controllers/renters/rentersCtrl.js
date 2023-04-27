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
const Renter = require("../../model/renter/Renter");
const fs = require("fs");
/*-------------------
//TODO: Create a Renter
//-------------------*/
const createRenterCtrl = expressAsyncHandler(async (req, res) => {
  //Display message if user is blocked
  blockUser(req.user);

  const files = req.resizedAndFormattedImages;
  // console.log("req.body", req.body);

  const imgUploaded = [];

  for (const file of files) {
    const filename = file.filename;
    const type = file.type;
    const filepath = `public/images/posts/${file.filename}`;
    const fileBuffer = file.buffer;
    const preview = fileBuffer.toString("base64");

    imgUploaded.push({ filename, preview, type });
    fs.unlinkSync(filepath);
  }
  // console.log("imgUploaded", imgUploaded);
  try {
    const post = await Renter.create({
      ...req.body,
      user: req?.user,
      IDCardPhoto: imgUploaded,
    });

    res.json({
      result: true,
      data: post,
      message: MESSAGE.MESSAGE_SUCCESS,
    });
  } catch (error) {
    res.json(error);
  }
});

const fetchRentersCtrl = expressAsyncHandler(async (req, res) => {
  try {
    const { keyword = "", offset = 0, limit = 10 } = req.query;
    const xomtroId = req.query.xomtroId
      ? mongoose.Types.ObjectId(req.query.xomtroId)
      : null;
    const roomId = req.query.roomId
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
    if (roomId) {
      pipeline.push({
        $match: {
          room: roomId,
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
        room: 1,
        xomtro: 1,
        user: 1,
        invoice: 1,
        renterName: 1,
        numberPhone: 1,
        zaloNumber: 1,
        nationalID: 1,
        dateOfBirth: 1,
        gender: 1,
        city: 1,
        district: 1,
        ward: 1,
        addressDetail: 1,
        career: 1,
        nationalIdDate: 1,
        nationalIdIssuer: 1,
        IDCardPhoto: 1,
        isContact: 1,
        isVerified: 1,
        isRegister: 1,
        createdAt: 1,
        updatedAt: 1,
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
    const [result] = await Renter.aggregate(pipeline);
    const [resultNoLimit] = await Renter.aggregate(updatedPipeline);
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

module.exports = { createRenterCtrl };