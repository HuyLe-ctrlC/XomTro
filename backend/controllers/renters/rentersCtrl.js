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
      ? mongoose.Types.ObjectId(req.query.roomId)
      : null;

    let pipeline = [];
    if (xomtroId == null && xomtroId == null) {
      res.json({
        data: [],
        searchCount: 0,
        totalPage: 0,
      });
    } else {
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
          roomName: 1,
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
    }
  } catch (err) {
    res.json(err);
  }
});

/*-------------------
//TODO: Fetch a Renter
//-------------------*/

const fetchRenterByIdCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const renter = await Renter.findById(id).populate({
      path: "room",
      select: "_id roomName",
    });

    if (renter) {
      res.json({
        result: true,
        dataUpdate: renter,
        message: MESSAGE.GET_DATA_SUCCESS,
      });
    } else {
      res.json({ result: false, message: MESSAGE.DATA_NOT_FOUND });
    }
  } catch (error) {
    res.json(error);
  }
});

/*-------------------
//TODO: Update a Renter
//-------------------*/

const updateRenterCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);

  const files = req.resizedAndFormattedImages;
  if (!files.length) {
    const postUpdate = await Renter.findByIdAndUpdate(
      id,

      {
        ...req.body,
        user: req?.user,
      },
      { new: true }
    );

    return res.json({
      result: true,
      message: MESSAGE.UPDATE_SUCCESS,
      newData: postUpdate,
    });
  }
  // console.log("files", files)
  const imgUploaded = files.map((file) => {
    if (file?.preview?.startsWith("/")) {
      const filename = file?.filename;
      const type = file?.type;
      const preview = file?.preview;
      return { filename, preview, type };
    } else {
      const filename = file?.filename;
      const type = file?.type;
      const preview = file?.buffer?.toString("base64");
      const filepath = `public/images/posts/${filename}`;
      fs.unlinkSync(filepath);
      return { filename, preview, type };
    }
  });

  const renterUpdate = await Renter.findByIdAndUpdate(
    id,
    {
      ...req.body,
      user: req?.user,
      IDCardPhoto: imgUploaded,
    },
    { new: true }
  ).populate("user", "email lastName firstName profilePhoto");

  res.json({
    result: true,
    message: MESSAGE.UPDATE_SUCCESS,
    newData: renterUpdate,
  });
});

/*-------------------
//TODO: Delete a Renter
//-------------------*/
const deleteRenterCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const renter = await Renter.findOneAndDelete(id);

    if (renter) {
      res.json({
        result: true,
        _id: renter._id,
        message: MESSAGE.DELETE_SUCCESS,
      });
    } else {
      res.json({ result: false, message: MESSAGE.MESSAGE_FAILED });
    }
  } catch (error) {
    res.json(error);
  }
});

module.exports = {
  createRenterCtrl,
  fetchRentersCtrl,
  fetchRenterByIdCtrl,
  updateRenterCtrl,
  deleteRenterCtrl,
};
