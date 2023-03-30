const mongoose = require("mongoose");
const moment = require("moment");

const STATUS_ROOM = require("../../utils/statusRoom");
const serviceSchema = new mongoose.Schema({
  serviceName: { type: String, required: [true, "Dịch vụ là bắt buộc"] },
  price: {
    type: Number,
    required: [true, `Giá dịch vụ là bắt buộc`],
    min: [0, `Giá dịch vụ phải lớn hơn hoặc bằng 1000`],
  },
  oldValue: { type: String },
  newValue: { type: String },
  paymentMethod: {
    type: String,
    default: false,
    required: [true, "Xét thay đổi là bắt buộc"],
  },
  _id: Number,
});

const roomSchema = new mongoose.Schema(
  {
    xomtro: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Xomtro",
      required: [true, "Xomtro là bắt buộc"],
    },
    user: {
      type: Object,
      required: [true, "User là bắt buộc"],
    },
    roomName: {
      type: String,
      required: [true, "Tên phòng là bắt buộc"],
    },
    floor: {
      type: String,
      required: [true, "Tầng là bắt buộc"],
    },
    acreage: {
      type: String,
      required: [true, "Diện tích là bắt buộc"],
    },
    price: {
      type: String,
      required: [true, "Giá thuê là bắt buộc"],
    },
    maxPeople: {
      type: String,
      required: [true, "Số người tối đa của phòng là bắt buộc"],
    },
    services: [serviceSchema],
    invoiceDate: {
      type: Number,
      default: 30,
    },
    paymentDeadline: {
      type: Number,
      default: 7,
    },
    rentalStatus: {
      type: String,
      default: STATUS_ROOM.EMPTY,
    },
    paymentStatus: {
      type: String,
      default: STATUS_ROOM.UPCOMING_CYCLE,
    },
    securityDeposit: { type: String, default: 0 },
    moveInDate: { type: Date },
    moveOutDate: { type: Date },
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

// Middleware to format moveInDate and moveOutDate fields
roomSchema.pre("save", function (next) {
  if (this.moveInDate && typeof this.moveInDate === "string") {
    this.moveInDate = moment(this.moveInDate, "DD-MM-YYYY").toDate();
  }
  if (this.moveOutDate && typeof this.moveOutDate === "string") {
    this.moveOutDate = moment(this.moveOutDate, "DD-MM-YYYY").toDate();
  }
  next();
});

const Room = mongoose.model("Room", roomSchema);

module.exports = Room;
