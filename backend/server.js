// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// require("dotenv").config();

// const app = express();

// app.use(cors());
// app.use(express.json());

// const authRoutes = require("./routes/auth");
// const dishRoutes = require("./routes/dishes");
// const tableRoutes = require("./routes/tables");
// const orderRoutes = require("./routes/orders");
// const adminRoutes = require("./routes/admin");
// const contactRoutes = require("./routes/contactRoutes");
// const attendanceRoutes = require("./routes/attendanceRoutes");
// import "./cron/attendanceCron.js"; 

// console.log("authRoutes type:", typeof authRoutes);
// console.log("dishRoutes type:", typeof dishRoutes);
// console.log("tableRoutes type:", typeof tableRoutes);
// console.log("orderRoutes type:", typeof orderRoutes);
// console.log("adminRoutes type:", typeof adminRoutes);
// console.log("contactRoutes type:", typeof contactRoutes);
// console.log("attendanceRoutes type:", typeof attendanceRoutes);

// app.use("/api/auth", authRoutes);
// app.use("/api/dishes", dishRoutes);
// app.use("/api/tables", tableRoutes);
// app.use("/api/orders", orderRoutes);
// app.use("/api/admin", adminRoutes);
// app.use("/api/contact", contactRoutes);
// app.use("/api/attendance", attendanceRoutes);

// app.get("/", (req, res) => {
//   res.send("Restaurant API is running...");
// });

// mongoose
//   .connect(process.env.MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log("MongoDB connected"))
//   .catch((err) => console.error("MongoDB connection error:", err));

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js";
import dishRoutes from "./routes/dishes.js";
import tableRoutes from "./routes/tables.js";
import orderRoutes from "./routes/orders.js";
import adminRoutes from "./routes/admin.js";
import contactRoutes from "./routes/contactRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";

import "./cron/attendanceCron.js"; // ✅ cron auto start

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/dishes", dishRoutes);
app.use("/api/tables", tableRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/attendance", attendanceRoutes);

app.get("/", (req, res) => {
  res.send("Restaurant API is running...");
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected ✅"))
  .catch((err) => console.error("MongoDB error ❌", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
