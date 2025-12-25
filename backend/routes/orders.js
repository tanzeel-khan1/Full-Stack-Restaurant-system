const express = require("express");
const router = express.Router();
const { protect } = require("../Middleware/authMiddleware");
const { getOrders, getOrderById, createOrder, updateOrder,getOrdersByUserID, deleteOrder } = require("../Controllers/orderController");

router.get("/", protect, getOrders);
router.get("/:id", protect, getOrderById);
router.post("/", protect, createOrder);
router.get("/user/:userId", protect, getOrdersByUserID);   
router.put("/:id", protect, updateOrder);
router.delete("/:id", protect, deleteOrder);

module.exports = router; 