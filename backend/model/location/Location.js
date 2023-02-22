const mongoose = require("mongoose");
const wardSchema = new mongoose.Schema({
  id: String,
  name: String,
});
const streetSchema = new mongoose.Schema({
  id: String,
  name: String,
  prefix: String,
});
const projectSchema = new mongoose.Schema({
  id: String,
  name: String,
  lat: String,
  lng: String,
});
const districtSchema = new mongoose.Schema({
  id: String,
  name: String,
  code: String,
  wards: [wardSchema],
  streets: [streetSchema],
  projects: [projectSchema],
});

const locationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      on_delete: "cascade",
      required: true,
    },
    id: {
      type: String,
    },
    name: {
      type: String,
    },
    code: {
      type: String,
    },
    districts: [districtSchema],
  },
  {
    timestamps: true,
  }
);
const Location = mongoose.model("Location", locationSchema);

module.exports = Location;
