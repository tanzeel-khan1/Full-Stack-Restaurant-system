const express = require("express");
const router = express.Router();
const { protect } = require("../Middleware/authMiddleware");
const {
  getTables,
  getTableById,
  getTablesByUserId,   
  createTable,
  updateTable,
  deleteTable
} = require("../Controllers/tableController");

// Routes
router.get("/", protect, getTables);             
router.get("/:id", protect, getTableById);       
router.get("/user/:userId", protect, getTablesByUserId);   
router.post("/", protect, createTable);          
router.put("/:id", protect, updateTable);        
router.delete("/:id", protect, deleteTable);     

module.exports = router;
