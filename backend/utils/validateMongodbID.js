const mongoose = require("mongoose");

const validateMongodbId = (id) => {
  const isValidId = mongoose.Types.ObjectId.isValid(id);
  if (!isValidId) {
    throw new Error("The ID is not a valid or found");
  }
};

module.exports = validateMongodbId;
