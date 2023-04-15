const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema(
  {
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: [true, "Phòng trọ là bắt buộc"],
    },
    invoiceMonth: {
      type: String,
      required: [true, "Tháng lập phiếu là bắt buộc"],
    },
    paymentPurpose: {
      type: String,
      required: [true, "Tháng lập phiếu là bắt buộc"],
    },
    numberOfMonths: {
      type: String,
      required: [true, "Tháng lập phiếu là bắt buộc"],
    },
    numberOfDays: {
      type: String,
      required: [true, "Tháng lập phiếu là bắt buộc"],
    },
    invoiceDate: {
      type: String,
      required: [true, "Tháng lập phiếu là bắt buộc"],
    },
    paymentDeadline: {
      type: String,
      required: [true, "Tháng lập phiếu là bắt buộc"],
    },
    invoiceStatus: {
      type: String,
      required: [true, "Tháng lập phiếu là bắt buộc"],
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

const Invoice = mongoose.model("Invoice", invoiceSchema);
module.exports = Invoice;
