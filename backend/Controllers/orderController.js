const Order = require("../models/Order");
const Dish = require("../models/Dish");
const mongoose = require("mongoose");

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("dishes.dish", "name price")
      .populate("userId", "name email"); 
    res.json(orders);
  } catch (err) {
    console.error("Get Orders Error:", err);
    res.status(500).json({ message: err.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("dishes.dish", "name price")
      .populate("userId", "name email");
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (err) {
    console.error("Get Order By ID Error:", err);
    res.status(500).json({ message: err.message });
  }
};

// exports.createOrder = async (req, res) => {
//   const { userId, dishes, totalPrice } = req.body;

//   try {
//     console.log("Incoming order data:", req.body);

//     const order = new Order({
//       userId,   
//       dishes,
//       totalPrice,
//     });

//     const savedOrder = await order.save();

//     res.status(201).json(savedOrder);
//   } catch (err) {
//     console.error("Create Order Error:", err);
//     res.status(500).json({ message: err.message });
//   }
// };
exports.createOrder = async (req, res) => {
  const { userId, dishes, totalPrice } = req.body;

  try {
    console.log("Incoming order data:", req.body);

    const order = new Order({
      userId,   
      dishes,
      totalPrice,
      status: "pending" // ya "abhi aayega"
    });

    const savedOrder = await order.save();

    res.status(201).json(savedOrder);
  } catch (err) {
    console.error("Create Order Error:", err);
    res.status(500).json({ message: err.message });
  }
};

exports.updateOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const { dishes, totalPrice } = req.body;
    if (dishes) order.dishes = dishes;
    if (totalPrice) order.totalPrice = totalPrice;

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (err) {
    console.error("Update Order Error:", err);
    res.status(500).json({ message: err.message });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    await order.deleteOne();
    res.json({ message: "Order removed" });
  } catch (err) {
    console.error("Delete Order Error:", err);
    res.status(500).json({ message: err.message });
  }
};

// exports.getOrdersByUserID = async (req, res) => {
//   try {
//     const { userId } = req.params;
//     console.log("🔎 Searching orders for user:", userId);

//     const orders = await Order.find({ userId }).populate("dishes.dish");

//     console.log("Found orders:", orders);

//     if (!orders || orders.length === 0) {
//       return res.status(404).json({ message: "No Orders found for this user" });
//     }

//     res.json(orders);
//   } catch (err) {
//     console.error("Error in getOrdersByUserID:", err);
//     res.status(500).json({ message: err.message });
//   }
// };
exports.getOrdersByUserID = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log("🔎 Searching orders for user:", userId);

    // ✅ userId validation
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    const orders = await Order.find({ userId })
      .populate("dishes.dish");

    console.log("Found orders:", orders.length);

    // ✅ Empty orders ≠ error
    if (orders.length === 0) {
      return res.status(200).json({
        success: true,
        orders: [],
        message: "No Orders found for this user",
      });
    }

    // ✅ Normal success
    res.status(200).json({
      success: true,
      orders,
    });

  } catch (err) {
    console.error("Error in getOrdersByUserID:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
exports.markOrderAsCompleted = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    order.status = "completed"; // ya "khaya gaya"
    await order.save();

    res.status(200).json({
      success: true,
      message: "Order marked as completed successfully",
      order
    });
  } catch (err) {
    console.error("Mark Order Completed Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};
