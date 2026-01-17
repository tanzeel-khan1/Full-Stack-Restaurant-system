const Order = require("../models/Order");
const Table = require("../models/Table");
const mongoose = require("mongoose");
const User = require("../models/User");

/* ======================
   GET ALL ORDERS
====================== */
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("dishes.dish", "name price")
      .populate("userId", "name email")
      .populate("tableId", "price reservationDuration");

    res.status(200).json(orders);
  } catch (err) {
    console.error("Get Orders Error:", err);
    res.status(500).json({ message: err.message });
  }
};

/* ======================
   GET ORDER BY ID
====================== */
exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid order id" });
    }

    const order = await Order.findById(id)
      .populate("dishes.dish", "name price")
      .populate("tableId", "price reservationDuration");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(order);
  } catch (err) {
    console.error("Get Order By ID Error:", err);
    res.status(500).json({ message: err.message });
  }
};

/* ======================
   GET ORDERS BY USER ID
====================== */

exports.getOrdersByUserID = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    const orders = await Order.find({ userId })
      .populate("dishes.dish", "name price")
      .populate("tableId", "price reservationDuration");

    // ✅ Calculate full bill for each order
    const ordersWithBill = orders.map((order) => {
      // 🍽️ dishes total
      const dishesTotal = order.dishes.reduce((sum, item) => {
        const price = item.dish?.price || 0;
        const qty = item.quantity || item.qty || 1;
        return sum + price * qty;
      }, 0);

      // 🪑 table total
      const tablePrice = order.tableId?.price || 0;
      const duration = order.tableId?.reservationDuration || 0;
      const tableTotal = tablePrice * duration;

      const grandTotal = dishesTotal + tableTotal;

      return {
        ...order.toObject(),
        bill: {
          dishesTotal,
          tableTotal,
          grandTotal,
        },
      };
    });

    res.status(200).json({
      success: true,
      orders: ordersWithBill,
    });
  } catch (err) {
    console.error("Get Orders By User Error:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* ======================
   CREATE ORDER
====================== */
exports.createOrder = async (req, res) => {
  try {
    const { dishes, totalPrice, tableId } = req.body;
    const userId = req.user._id;

    if (!dishes || dishes.length === 0 || !totalPrice) {
      return res.status(400).json({
        success: false,
        message: "Dishes and total price are required",
      });
    }

    let table = null;
    if (tableId) {
      table = await Table.findById(tableId);
      if (!table) {
        return res.status(404).json({
          success: false,
          message: "Table not found",
        });
      }
    }

    const order = new Order({
      userId,
      dishes,
      totalPrice,
      tableId: table ? table._id : null,
      status: "pending",
    });

    const savedOrder = await order.save();

    if (table) {
      table.status = "occupied";
      await table.save();
    }

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: savedOrder,
    });
  } catch (err) {
    console.error("Create Order Error:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* ======================
   UPDATE ORDER
====================== */
exports.updateOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const { dishes, totalPrice } = req.body;
    if (dishes) order.dishes = dishes;
    if (totalPrice) order.totalPrice = totalPrice;

    const updatedOrder = await order.save();
    res.status(200).json(updatedOrder);
  } catch (err) {
    console.error("Update Order Error:", err);
    res.status(500).json({ message: err.message });
  }
};

/* ======================
   DELETE ORDER
====================== */
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    await order.deleteOne();
    res.status(200).json({ message: "Order removed" });
  } catch (err) {
    console.error("Delete Order Error:", err);
    res.status(500).json({ message: err.message });
  }
};

/* ======================
   MARK ORDER COMPLETED
====================== */
exports.markOrderAsCompleted = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.status = "completed";
    await order.save();

    if (order.tableId) {
      await Table.findByIdAndUpdate(order.tableId, {
        status: "available",
        reservationDateTime: null,
        reservationDuration: null,
        reservationEndTime: null,
      });
    }

    res.status(200).json({
      success: true,
      message: "Order completed & table released",
      order,
    });
  } catch (err) {
    console.error("Mark Order Completed Error:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* ======================
   GET INCOMPLETE ORDERS
====================== */
exports.getIncompleteOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      status: { $ne: "completed" },
    })
      .populate("dishes.dish", "name price")
      .populate("userId", "name email");

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (err) {
    console.error("Get Incomplete Orders Error:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getOrdersByUserName = async (req, res) => {
  try {
    const { name } = req.params;

    const user = await User.findOne({ name });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const orders = await Order.find({ userId: user._id })
      .sort({ createdAt: -1 }) // ✅ latest first
      .populate("dishes.dish", "name price")
      .populate("tableId", "price reservationDuration");

    const ordersWithBill = orders.map((order) => {
      const dishesTotal = order.dishes.reduce((sum, item) => {
        const price = item.dish?.price || 0;
        const qty = item.quantity || 1;
        return sum + price * qty;
      }, 0);

      const tableTotal =
        (order.tableId?.price || 0) *
        (order.tableId?.reservationDuration || 0);

      return {
        ...order.toObject(),

        // ✅ Date fields
        orderDate: order.createdAt.toISOString().split("T")[0], // 2026-01-16
        orderTime: order.createdAt.toLocaleTimeString(),         // 8:05 PM
        completedAt: order.completedAt || null,

        bill: {
          dishesTotal,
          tableTotal,
          grandTotal: dishesTotal + tableTotal,
        },
      };
    });

    res.status(200).json({
      success: true,
      count: ordersWithBill.length,
      orders: ordersWithBill,
    });
  } catch (err) {
    console.error("Get Orders By Username Error:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

exports.getOrdersByUserNameAndDate = async (req, res) => {
  try {
    const { name, date } = req.body; // admin se username + date aayega

    if (!name || !date) {
      return res.status(400).json({
        success: false,
        message: "Username and date are required",
      });
    }

    // 1️⃣ Find user by name
    const user = await User.findOne({ name });

    // 2️⃣ If user doesn't exist, return empty orders
    if (!user) {
      return res.status(200).json({
        success: true,
        count: 0,
        orders: [],
        message: "No orders found for this user on this date",
      });
    }

    // 3️⃣ Parse date
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    // 4️⃣ Find orders for that user on that date
    const orders = await Order.find({
      userId: user._id,
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    })
      .sort({ createdAt: -1 })
      .populate("dishes.dish", "name price")
      .populate("tableId", "price reservationDuration");

    // 5️⃣ If no orders, return empty array
    if (!orders.length) {
      return res.status(200).json({
        success: true,
        count: 0,
        orders: [],
        message: "No orders found for this user on this date",
      });
    }

    // 6️⃣ Calculate bill & add date/time fields
    const ordersWithBill = orders.map((order) => {
      // Total for dishes
      const dishesTotal = order.dishes.reduce((sum, item) => {
        const price = item.dish?.price || 0;
        const qty = item.quantity || 1;
        return sum + price * qty;
      }, 0);

      // Table total (default 1 hour if duration null)
      const tableDuration = order.tableId?.reservationDuration ?? 1;
      const tablePricePerHour = order.tableId?.price || 0;
      const tableTotal = tablePricePerHour * tableDuration;

      return {
        ...order.toObject(),
        orderDate: order.createdAt.toISOString().split("T")[0],
        orderTime: order.createdAt.toLocaleTimeString(),
        completedAt: order.completedAt || null,

        // Table info
        table: order.tableId
          ? {
              pricePerHour: tablePricePerHour,
              duration: tableDuration,
              total: tableTotal,
            }
          : null,

        // Bill info
        bill: {
          dishesTotal,
          tableTotal,
          grandTotal: dishesTotal + tableTotal,
        },
      };
    });

    // 7️⃣ Send response
    res.status(200).json({
      success: true,
      count: ordersWithBill.length,
      orders: ordersWithBill,
    });
  } catch (err) {
    console.error("Get Orders By Username & Date Error:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
