const express = require("express");
const {
  createRoomCtrl,
  fetchRoomsCtrl,
  updateRoomCtrl,
  deleteRoomCtrl,
  addUtilityCtrl,
  updateUtilityCtrl,
  deleteUtilityCtrl,
  fetchRoomsByIdXomTroCtrl,
  fetchRoomCtrl,
  getUtilityByIdCtrl,
  checkOutOfTheRoomCtrl,
} = require("../../controllers/rooms/roomsCtrl");

const authMiddleware = require("../../middlewares/auth/authMiddleware");

const roomRoutes = express.Router();

roomRoutes.post("/", authMiddleware, createRoomCtrl);
roomRoutes.get("/search", authMiddleware, fetchRoomsCtrl);
roomRoutes.get("/roomByXomtroId", authMiddleware, fetchRoomsByIdXomTroCtrl);
roomRoutes.get("/get-utility", authMiddleware, getUtilityByIdCtrl);
roomRoutes.get("/:id", authMiddleware, fetchRoomCtrl);
roomRoutes.put("/update-utility", authMiddleware, updateUtilityCtrl);
roomRoutes.put("/:id", authMiddleware, updateRoomCtrl);
roomRoutes.put("/delete-utility/:id", authMiddleware, deleteUtilityCtrl);
roomRoutes.put("/checkout/:id", authMiddleware, checkOutOfTheRoomCtrl);
roomRoutes.delete("/:id", authMiddleware, deleteRoomCtrl);
roomRoutes.post("/add-utility", authMiddleware, addUtilityCtrl);

module.exports = roomRoutes;
