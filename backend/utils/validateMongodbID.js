const mongoose = require("mongoose");

const validateMongodbId = (id) => {
  const isValidId = mongoose.Types.ObjectId.isValid(id);
  if (!isValidId) {
    throw new Error("ID không hợp lệ hoặc không tìm thấy!");
  }
};

module.exports = validateMongodbId;
