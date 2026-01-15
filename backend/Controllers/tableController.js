
const Table = require("../models/Table");
const mongoose = require("mongoose");

exports.getTables = async (req, res) => {
  try {
    const tables = await Table.find();
    res.json(tables);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getTableById = async (req, res) => {
  try {
    const table = await Table.findById(req.params.id);
    if (!table) return res.status(404).json({ message: "Table not found" });
    res.json(table);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// exports.createTable = async (req, res) => {
//   const {
//     number,
//     capacity,
//     reservationDateTime,
//     reservationDuration,
//     category
//   } = req.body;

//   try {
//     if (!number || !capacity || !reservationDateTime || !reservationDuration) {
//       return res.status(400).json({
//         success: false,
//         message: "Required fields are missing"
//       });
//     }

//     const startTime = new Date(reservationDateTime);
//     const endTime = new Date(startTime.getTime() + reservationDuration * 60000);

//     const existingReservation = await Table.findOne({
//       number,
//       status: { $in: ["reserved", "pending"] },
//       reservationEndTime: { $gt: new Date() }
//     });

//     if (existingReservation) {
//       return res.status(400).json({
//         success: false,
//         message: "Table already pending or reserved"
//       });
//     }

//     // 🔐 IMPORTANT: status force pending
//     const table = new Table({
//       number,
//       capacity,
//       reservationDateTime: startTime,
//       reservationDuration,
//       reservationEndTime: endTime,
//       category: category || "normal",
//       userId: req.user._id,
//       status: "pending" // 👈 hard coded, client se nahi
//     });

//     const savedTable = await table.save();

//     res.status(201).json({
//       success: true,
//       message: "Table created. Waiting for admin approval.",
//       table: savedTable
//     });

//   } catch (err) {
//     res.status(500).json({
//       success: false,
//       message: err.message
//     });
//   }
// };
exports.createTable = async (req, res) => {
  const {
    number,
    capacity,
    reservationDateTime,
    reservationDuration,
    category
  } = req.body;

  try {
    if (!number || !capacity || !reservationDateTime || !reservationDuration) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing"
      });
    }

    const startTime = new Date(reservationDateTime);
    const endTime = new Date(startTime.getTime() + reservationDuration * 60000);

    // 🔒 SAME USER — SAME DAY CHECK
    const startOfDay = new Date(startTime);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(startTime);
    endOfDay.setHours(23, 59, 59, 999);

    const existingUserReservation = await Table.findOne({
      userId: req.user._id,
      reservationDateTime: {
        $gte: startOfDay,
        $lte: endOfDay
      }
    });

    if (existingUserReservation) {
      return res.status(400).json({
        success: false,
        message: "You can create only one table per day"
      });
    }

    // 🔁 SAME TABLE NUMBER CHECK
    const existingReservation = await Table.findOne({
      number,
      status: { $in: ["reserved", "pending"] },
      reservationEndTime: { $gt: new Date() }
    });

    if (existingReservation) {
      return res.status(400).json({
        success: false,
        message: "Table already pending or reserved"
      });
    }

    const table = new Table({
      number,
      capacity,
      reservationDateTime: startTime,
      reservationDuration,
      reservationEndTime: endTime,
      category: category || "normal",
      userId: req.user._id,
      status: "pending"
    });

    const savedTable = await table.save();

    res.status(201).json({
      success: true,
      message: "Table created. Waiting for admin approval.",
      table: savedTable
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};


// Step 2: Process payment and confirm reservation
exports.processPayment = async (req, res) => {
  const { tableId } = req.params;
  const { paymentMethod, transactionId } = req.body;

  try {
    const table = await Table.findById(tableId);

    if (!table) {
      return res.status(404).json({ message: "Table reservation not found" });
    }

    if (table.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    if (table.paymentStatus === "paid") {
      return res.status(400).json({ message: "Payment already completed" });
    }

    if (table.status !== "pending") {
      return res.status(400).json({ message: "Invalid reservation status" });
    }

    // Simulate payment processing
    // In real app, integrate with payment gateway (Stripe, PayPal, etc.)
    const paymentSuccess = true; // Replace with actual payment gateway response

    if (paymentSuccess) {
      table.status = "reserved";
      table.paymentStatus = "paid";
      table.paymentMethod = paymentMethod;
      table.transactionId = transactionId;
      table.paidAt = new Date();

      await table.save();

      // Set timer to auto-release table after reservation ends
      setTimeout(async () => {
        const t = await Table.findById(table._id);
        if (t && t.status === "reserved") {
          t.status = "available";
          t.reservationDateTime = null;
          t.reservationDuration = null;
          t.reservationEndTime = null;
          await t.save();
        }
      }, table.reservationDuration * 60000);

      res.status(200).json({
        success: true,
        table,
        message: "Payment successful! Table confirmed."
      });
    } else {
      await Table.findByIdAndDelete(tableId);
      res.status(400).json({ 
        success: false,
        message: "Payment failed. Reservation cancelled." 
      });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateTable = async (req, res) => {
  try {
    const table = await Table.findById(req.params.id);
    if (!table) return res.status(404).json({ message: "Table not found" });

    const { number, capacity, status, paymentStatus } = req.body;
    table.number = number ?? table.number;
    table.capacity = capacity ?? table.capacity;
    table.status = status ?? table.status;
    table.paymentStatus = paymentStatus ?? table.paymentStatus;

    const updatedTable = await table.save();
    res.json(updatedTable);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteTable = async (req, res) => {
  try {
    const table = await Table.findById(req.params.id);
    if (!table) return res.status(404).json({ message: "Table not found" });

    await table.deleteOne();
    res.json({ message: "Table removed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getTablesByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    const tables = await Table.find({ userId });

    if (tables.length === 0) {
      return res.status(200).json({
        success: true,
        tables: [],
        message: "No tables found for this user",
      });
    }

    res.status(200).json({
      success: true,
      tables,
    });

  } catch (err) {
    console.error("Error in getTablesByUserId:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Cancel pending reservation
exports.cancelReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const table = await Table.findById(id);

    if (!table) {
      return res.status(404).json({ message: "Table not found" });
    }

    if (table.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    if (table.status === "reserved" && table.paymentStatus === "paid") {
      return res.status(400).json({ 
        message: "Cannot cancel confirmed reservation. Please contact support." 
      });
    }

    await Table.findByIdAndDelete(id);
    res.json({ 
      success: true,
      message: "Reservation cancelled successfully" 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};