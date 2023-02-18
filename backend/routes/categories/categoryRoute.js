const express = require("express");
const {
  createCategoryCtrl,
  fetchCategoriesCtrl,
  fetchCategoryCtrl,
  updateCategoryCtrl,
  deleteCategoryCtrl,
  searchCategoryCtrl,
} = require("../../controllers/category/categoryCtrl");
const authMiddleware = require("../../middlewares/auth/authMiddleware");
const categoryRoutes = express.Router();

categoryRoutes.get("/search", authMiddleware, searchCategoryCtrl);
categoryRoutes.post("/", authMiddleware, createCategoryCtrl);
// categoryRoutes.get("/", authMiddleware, fetchCategoriesCtrl);
categoryRoutes.get("/:id", authMiddleware, fetchCategoryCtrl);
categoryRoutes.put("/:id", authMiddleware, updateCategoryCtrl);
categoryRoutes.delete("/:id", authMiddleware, deleteCategoryCtrl);

module.exports = categoryRoutes;
