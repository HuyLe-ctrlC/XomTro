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

const servicesXomtroSchema = new mongoose.Schema({
  serviceName: { type: String, required: [true, "Tên dịch vụ là bắt buộc"] },
  price: {
    type: Number,
    required: [true, `Giá dịch vụ là bắt buộc`],
    min: [0, `Giá dịch vụ phải lớn hơn hoặc bằng 0`],
  },
  oldValue: { type: String, default: 0 },
  newValue: { type: String, default: 0 },
  paymentMethod: {
    type: String,
    required: [true, "Phương thức thanh toán là bắt buộc"],
    default: "Theo tháng",
  },
  measurement: { type: String},
  _id: Number,
});

const xomtroSchema = new mongoose.Schema(
  {
    nameXomtro: { type: String, required: [true, "Số phòng là bắt buộc"] },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Thể loại là bắt buộc"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Chủ Xomtro là bắt buộc"],
    },
    numberRoom: {
      type: String,
      required: [true, "Số phòng là bắt buộc"],
    },
    numberOfFloors: {
      type: String,
      required: [true, "Số tầng là bắt buộc"],
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
      required: [true, "Số người tối đã của phòng là bắt buộc"],
    },
    city: citySchema,
    district: districtSchema,
    ward: wardSchema,
    addressDetail: {
      type: String,
      required: [true, "Địa chỉ Xomtro là bắt buộc"],
    },
    services: [servicesXomtroSchema],
    // waterServices: {
    //   type: String,
    //   required: [true, "Dịch vụ nước là bắt buộc"],
    //   default: "Theo đồng hồ",
    // },
    // garbageServices: {
    //   type: String,
    //   required: [true, "Dịch vụ rác là bắt buộc"],
    //   default: "Theo tháng",
    // },
    // internetServices: {
    //   type: String,
    //   required: [true, "Dịch vụ internet là bắt buộc"],
    //   default: "Theo tháng",
    // },
    assetManagement: {
      type: Boolean,
      default: false,
    },
    vehicleManagement: {
      type: Boolean,
      default: false,
    },
    invoiceDate: {
      type: Number,
      default: 30,
    },
    paymentDeadline: {
      type: Number,
      default: 7,
    },
    roomCount: {
      type: Number,
      default: 0,
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

//compile

const Xomtro = mongoose.model("Xomtro", xomtroSchema);

module.exports = Xomtro;
