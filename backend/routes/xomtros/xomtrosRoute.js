const express = require("express");
const {
  createXomtroCtrl,
  fetchXomtrosCtrl,
  deleteXomtroCtrl,
  updateXomtroCtrl,
  addUtilityXomtroCtrl,
} = require("../../controllers/xomtros/xomtrosCtrl");
const authMiddleware = require("../../middlewares/auth/authMiddleware");

const xomtroRoutes = express.Router();
xomtroRoutes.post("/add-utility", authMiddleware, addUtilityXomtroCtrl);
xomtroRoutes.post("/", authMiddleware, createXomtroCtrl);
xomtroRoutes.get("/search", authMiddleware, fetchXomtrosCtrl);
xomtroRoutes.delete("/:id", authMiddleware, deleteXomtroCtrl);
xomtroRoutes.put("/:id", authMiddleware, updateXomtroCtrl);

module.exports = xomtroRoutes;
