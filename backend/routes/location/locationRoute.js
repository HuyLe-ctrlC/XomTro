const express = require("express");
const {
  getAllCtrl,
  getCityCtrl,
  getDistrictCtrl,
  getWardByIDCtrl,
} = require("../../controllers/location/locationCtrl");
const authMiddleware = require("../../middlewares/auth/authMiddleware");
const locationRoutes = express.Router();

locationRoutes.get("/getWard", authMiddleware, getWardByIDCtrl);
locationRoutes.get("/getAll", authMiddleware, getAllCtrl);
locationRoutes.get("/getCity", authMiddleware, getCityCtrl);
locationRoutes.get("/getDistrict/:id", authMiddleware, getDistrictCtrl);
module.exports = locationRoutes;
