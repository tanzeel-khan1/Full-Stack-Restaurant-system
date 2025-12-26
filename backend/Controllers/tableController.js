// const Table = require("../models/Table");
// const mongoose = require("mongoose");


// exports.getTables = async (req, res) => {
//   try {
//     const tables = await Table.find();
//     res.json(tables);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// exports.getTableById = async (req, res) => {
//   try {
//     const table = await Table.findById(req.params.id);
//     if (!table) return res.status(404).json({ message: "Table not found" });
//     res.json(table);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// exports.createTable = async (req, res) => {
//   const { number, capacity, reservationDateTime, reservationDuration, totalAmount, category } = req.body;

//   try {
//     if (!number || !capacity || !reservationDateTime || !reservationDuration) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     const startTime = new Date(reservationDateTime);
//     const endTime = new Date(startTime.getTime() + reservationDuration * 60000);

//     const table = new Table({
//       number,
//       capacity,
//       status: "reserved",
//       reservationDateTime: startTime,
//       reservationDuration,
//       reservationEndTime: endTime,
//       paymentStatus: "paid",
//       totalAmount,
//       category: category || "normal",
//       userId: req.user._id  
//     });

//     const savedTable = await table.save();

//     setTimeout(async () => {
//       const t = await Table.findById(savedTable._id);
//       if (t && t.status === "available") {
//         t.status = "available";
//         t.reservationDateTime = null;
//         t.reservationDuration = null;
//         t.reservationEndTime = null;
//         await t.save();
//       }
//     }, reservationDuration * 60000);

//     res.status(201).json(savedTable);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };



// exports.updateTable = async (req, res) => {
//   try {
//     const table = await Table.findById(req.params.id);
//     if (!table) return res.status(404).json({ message: "Table not found" });

//     const { number, capacity, status, paymentStatus } = req.body;
//     table.number = number ?? table.number;
//     table.capacity = capacity ?? table.capacity;
//     table.status = status ?? table.status;
//     table.paymentStatus = paymentStatus ?? table.paymentStatus;

//     const updatedTable = await table.save();
//     res.json(updatedTable);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };


// exports.deleteTable = async (req, res) => {
//   try {
//     const table = await Table.findById(req.params.id);
//     if (!table) return res.status(404).json({ message: "Table not found" });

//     await table.remove();
//     res.json({ message: "Table removed" });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };
// // exports.getTablesByUserId = async (req, res) => {
// //   try {
// //     const { userId } = req.params;
// //     const tables = await Table.find({ userId });

// //     if (!tables || tables.length === 0) {
// //       return res.status(404).json({ message: "No tables found for this user" });
// //     }

// //     res.json(tables);
// //   } catch (err) {
// //     res.status(500).json({ message: err.message });
// //   }
// // };
// exports.getTablesByUserId = async (req, res) => {
//   try {
//     const { userId } = req.params;

//     // ✅ userId validation
//     if (!mongoose.Types.ObjectId.isValid(userId)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid user ID",
//       });
//     }

//     const tables = await Table.find({ userId });

//     // ✅ Empty data ≠ error
//     if (tables.length === 0) {
//       return res.status(200).json({
//         success: true,
//         tables: [],
//         message: "No tables found for this user",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       tables,
//     });

//   } catch (err) {
//     console.error("Error in getTablesByUserId:", err);
//     res.status(500).json({
//       success: false,
//       message: "Server error",
//     });
//   }
// };

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

// Step 1: Create table reservation (pending payment)
exports.createTable = async (req, res) => {
  const { number, capacity, reservationDateTime, reservationDuration, totalAmount, category } = req.body;

  try {
    if (!number || !capacity || !reservationDateTime || !reservationDuration || !totalAmount) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const startTime = new Date(reservationDateTime);
    const endTime = new Date(startTime.getTime() + reservationDuration * 60000);

    // Check if table is already booked for this time
    const existingReservation = await Table.findOne({
      number,
      status: { $in: ["reserved", "pending"] },
      reservationEndTime: { $gt: new Date() }
    });

    if (existingReservation) {
      return res.status(400).json({ 
        message: "Table is already booked for this time slot" 
      });
    }

    const table = new Table({
      number,
      capacity,
      status: "pending", // Pending until payment
      reservationDateTime: startTime,
      reservationDuration,
      reservationEndTime: endTime,
      paymentStatus: "pending",
      totalAmount,
      category: category || "normal",
      userId: req.user._id  
    });

    const savedTable = await table.save();

    // Auto-cancel if payment not received in 10 minutes
    setTimeout(async () => {
      const t = await Table.findById(savedTable._id);
      if (t && t.paymentStatus === "pending") {
        await Table.findByIdAndDelete(savedTable._id);
        console.log(`Reservation ${savedTable._id} cancelled due to no payment`);
      }
    }, 10 * 60000); // 10 minutes

    res.status(201).json({
      success: true,
      table: savedTable,
      message: "Table reserved. Please complete payment within 10 minutes."
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
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