const express = require("express");
const {
  createXomtroCtrl,
  fetchXomtrosCtrl,
  deleteXomtroCtrl,
  updateXomtroCtrl,
  addUtilityXomtroCtrl,
  fetchXomtroCtrl,
  fetchXomtroByUserCtrl,
  getUtilityAppliedByIdCtrl,
} = require("../../controllers/xomtros/xomtrosCtrl");
const authMiddleware = require("../../middlewares/auth/authMiddleware");

const xomtroRoutes = express.Router();
xomtroRoutes.post("/add-utility", authMiddleware, addUtilityXomtroCtrl);
xomtroRoutes.post("/", authMiddleware, createXomtroCtrl);
xomtroRoutes.get("/search", authMiddleware, fetchXomtrosCtrl);
xomtroRoutes.get("/getByUser", authMiddleware, fetchXomtroByUserCtrl);
xomtroRoutes.get("/get-utility-applied", authMiddleware, getUtilityAppliedByIdCtrl);
xomtroRoutes.get("/:id", authMiddleware, fetchXomtroCtrl);
xomtroRoutes.delete("/:id", authMiddleware, deleteXomtroCtrl);
xomtroRoutes.put("/:id", authMiddleware, updateXomtroCtrl);

module.exports = xomtroRoutes;
