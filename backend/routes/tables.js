// const express = require("express");
// const router = express.Router();
// const { protect } = require("../Middleware/authMiddleware");
// const {
//   getTables,
//   getTableById,
//   getTablesByUserId,   
//   createTable,
//   updateTable,
//   deleteTable,
//   cancelReservation,
//   processPayment,
//   getAvailableTables
// } = require("../Controllers/tableController");

// // Routes
// router.get("/", protect, getTables);             
// router.get("/:id", protect, getTableById);       
// router.get("/user/:userId", protect, getTablesByUserId);   
// router.post("/", protect, createTable);          
// router.put("/:id", protect, updateTable);        
// router.delete("/:id", protect, deleteTable);     
// router.post('/:tableId/payment', protect, processPayment);
// router.get("/getav",getAvailableTables)
// router.delete('/cancel/:id', protect, cancelReservation);

// module.exports = router;
const express = require("express");
const router = express.Router();
const { protect } = require("../Middleware/authMiddleware");
const {
  getTables,
  getTableById,
  getTablesByUserId,   
  createTable,
  updateTable,
  deleteTable,
  cancelReservation,
} = require("../Controllers/tableController");

// Specific routes first
router.get("/user/:userId", protect, getTablesByUserId);

// General routes last
router.get("/", protect, getTables);             
router.get("/:id", protect, getTableById);       
router.post("/", protect, createTable);          
router.put("/:id", protect, updateTable);        
router.delete("/:id", protect, deleteTable);     
router.delete('/cancel/:id', protect, cancelReservation);

module.exports = router;
