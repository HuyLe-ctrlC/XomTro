const express = require("express");

const authMiddleware = require("../../middlewares/auth/authMiddleware");
const {
  createInvoiceRoomCtrl,
  updateInvoiceRoomCtrl,
  fetchInvoicesCtrl,
  deleteInvoiceCtrl,
  fetchInvoiceById,
  createInvoiceMultiRoomCtrl,
} = require("../../controllers/invoice/invoiceCtrl");

const invoiceRoutes = express.Router();

invoiceRoutes.post("/", authMiddleware, createInvoiceRoomCtrl);
invoiceRoutes.post("/add-invoices", authMiddleware, createInvoiceMultiRoomCtrl);
invoiceRoutes.get("/search", authMiddleware, fetchInvoicesCtrl);
invoiceRoutes.get("/:id", authMiddleware, fetchInvoiceById);
invoiceRoutes.put("/:id", authMiddleware, updateInvoiceRoomCtrl);
invoiceRoutes.delete("/:id", authMiddleware, deleteInvoiceCtrl);

module.exports = invoiceRoutes;
