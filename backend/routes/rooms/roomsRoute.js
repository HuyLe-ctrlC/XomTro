const express = require("express");
const {
  createRoomCtrl,
  fetchRoomsCtrl,
  updateRoomCtrl,
  deleteRoomCtrl,
  addUtilityCtrl,
  updateUtilityCtrl,
  deleteUtilityCtrl,
} = require("../../controllers/rooms/RoomsCtrl");

const authMiddleware = require("../../middlewares/auth/authMiddleware");

const roomRoutes = express.Router();

roomRoutes.post("/", authMiddleware, createRoomCtrl);
roomRoutes.get("/search", authMiddleware, fetchRoomsCtrl);
roomRoutes.put("/update-utility", authMiddleware, updateUtilityCtrl);
roomRoutes.put("/:id", authMiddleware, updateRoomCtrl);
roomRoutes.delete("/delete-utility/:id", authMiddleware, deleteUtilityCtrl);
roomRoutes.delete("/:id", authMiddleware, deleteRoomCtrl);
roomRoutes.post("/add-utility", authMiddleware, addUtilityCtrl);

module.exports = roomRoutes;
