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

exports.createTable = async (req, res) => {
  const { number, capacity, reservationDateTime, reservationDuration, totalAmount, category } = req.body;

  try {
    if (!number || !capacity || !reservationDateTime || !reservationDuration) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const startTime = new Date(reservationDateTime);
    const endTime = new Date(startTime.getTime() + reservationDuration * 60000);

    const table = new Table({
      number,
      capacity,
      status: "reserved",
      reservationDateTime: startTime,
      reservationDuration,
      reservationEndTime: endTime,
      paymentStatus: "paid",
      totalAmount,
      category: category || "normal",
      userId: req.user._id  
    });

    const savedTable = await table.save();

    setTimeout(async () => {
      const t = await Table.findById(savedTable._id);
      if (t && t.status === "available") {
        t.status = "available";
        t.reservationDateTime = null;
        t.reservationDuration = null;
        t.reservationEndTime = null;
        await t.save();
      }
    }, reservationDuration * 60000);

    res.status(201).json(savedTable);
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

    await table.remove();
    res.json({ message: "Table removed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// exports.getTablesByUserId = async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const tables = await Table.find({ userId });

//     if (!tables || tables.length === 0) {
//       return res.status(404).json({ message: "No tables found for this user" });
//     }

//     res.json(tables);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };
exports.getTablesByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    // ✅ userId validation
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    const tables = await Table.find({ userId });

    // ✅ Empty data ≠ error
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

