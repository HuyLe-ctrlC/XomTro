const mongoose = require("mongoose");
const { NOT_YET_PAID } = require("../../utils/statusRoom");
const moment = require("moment");
const serviceSchema = new mongoose.Schema({
  serviceName: { type: String, required: [true, "Dịch vụ là bắt buộc"] },
  price: {
    type: Number,
    required: [true, `Giá dịch vụ là bắt buộc`],
    min: [0, `Giá dịch vụ phải lớn hơn hoặc bằng 1000`],
  },
  priceTier2: {
    type: Number,
    min: [0, `Giá dịch vụ phải lớn hơn hoặc bằng 0`],
  },
  priceTier3: {
    type: Number,
    min: [0, `Giá dịch vụ phải lớn hơn hoặc bằng 0`],
  },
  isElectricityTariff: { type: Boolean, default: false },
  oldValue: { type: String },
  newValue: { type: String },
  paymentMethod: {
    type: String,
  },
  measurement: { type: String },
  isSelected: { type: Boolean },
  _id: Number,
  isApplied: { type: Boolean, default: false },
});
const invoiceSchema = new mongoose.Schema(
  {
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: [true, "Phòng trọ là bắt buộc"],
    },
    xomtro: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Xomtro",
      required: [true, "Xomtro là bắt buộc"],
    },
    services: [serviceSchema],
    invoiceMonth: {
      type: String,
      required: [true, "Tháng lập hóa đơn là bắt buộc"],
    },
    paymentPurpose: {
      type: String,
      required: [true, "Mục đích lập hóa đơn là bắt buộc"],
    },
    numberOfMonths: {
      type: String,
      required: [true, "Số tháng là bắt buộc"],
    },
    numberOfDays: {
      type: String,
      required: [true, "Số ngày là bắt buộc"],
    },
    invoiceDate: {
      type: String,
      required: [true, "Ngày lập hóa đơn là bắt buộc"],
    },
    paymentDeadline: {
      type: String,
      required: [true, "Thời hạn đóng hóa đơn là bắt buộc"],
    },
    total: { type: String, required: [true, "Tổng hóa đơn là bắt buộc"] },
    isTakeProfit: {
      type: Boolean,
      default: true,
    },
    invoiceStatus: {
      type: String,
      default: NOT_YET_PAID,
    },
    isOtherInvoice: {
      type: Boolean,
      default: false,
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

// Middleware to format moveInDate and moveOutDate fields
invoiceSchema.pre("save", function (next) {
  if (this.invoiceMonth && typeof this.invoiceMonth === "string") {
    const invoiceMonthTemp = moment(this.invoiceMonth, "YYYY-MM-DD");
    this.invoiceMonth = invoiceMonthTemp.toDate();
    this.invoiceMonth = invoiceMonthTemp.format("YYYY-MM");
  }
  if (this.invoiceDate && typeof this.invoiceDate === "string") {
    const invoiceDateTemp = moment(this.invoiceDate, "YYYY-MM-DD");
    this.invoiceDate = invoiceDateTemp.toDate();
    this.invoiceDate = invoiceDateTemp.format("YYYY-MM-DD");
  }
  if (this.paymentDeadline && typeof this.paymentDeadline === "string") {
    const paymentDeadlineTemp = moment(this.paymentDeadline, "YYYY-MM-DD");
    this.paymentDeadline = paymentDeadlineTemp.toDate();
    this.paymentDeadline = paymentDeadlineTemp.format("YYYY-MM-DD");
  }
  next();
});

const Invoice = mongoose.model("Invoice", invoiceSchema);
module.exports = Invoice;
