const mongoose = require("mongoose");

const citySchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: [true, "Thành phố là bắt buộc"] },
});
const districtSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: [true, "Quận/huyện là bắt buộc"] },
});
const wardSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: [true, "Phường/xã là bắt buộc"] },
  prefix: { type: String, required: [true, "Tiền tố phường/xã là bắt buộc"] },
});

const imageSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  preview: { type: String, required: true },
  type: { type: String, required: true },
});

const renterSchema = new mongoose.Schema(
  {
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: [true, "Phòng trọ là bắt buộc"],
    },
    renterName: {
      type: String,
      required: [true, "Tên khách thuê là bắt buộc"],
    },
    numberPhone: {
      type: String,
      required: [true, "Số điện thoại là bắt buộc"],
    },
    zaloNumber: {
      type: String,
      required: [true, "Số zalo là bắt buộc"],
    },
    nationalID: {
      type: String,
      required: [true, "Căn cước công dân là bắt buộc"],
    },
    dateOfBirth: {
      type: String,
      required: [true, "Ngày sinh là bắt buộc"],
    },
    gender: {
      type: String,
      required: [true, "Giới tính là bắt buộc"],
    },
    city: citySchema,
    district: districtSchema,
    ward: wardSchema,
    addressDetail: {
      type: String,
      required: [true, "Địa chỉ thường trú là bắt buộc"],
    },
    career: {
      type: String,
      required: [true, "Công việc là bắt buộc"],
    },
    nationalIdDate: {
      type: String,
      required: [true, "Ngày cấp CCCD là bắt buộc"],
    },
    nationalIdIssuer: {
      type: String,
      required: [true, "Nơi cấp là bắt buộc"],
    },
    IDCardPhoto: [imageSchema],
    isContact: {
      type: String,
    },
    isVerified: {
      type: String,
    },
    isRegister: {
      type: String,
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
    timestamps: true,
  }
);

const Renter = mongoose.model("Renter", renterSchema);

module.exports = Renter;