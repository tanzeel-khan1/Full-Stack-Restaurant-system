import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";

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


app.use(morgan("dev"));


app.use((req, res, next) => {
  console.log(`\x1b[36m ${req.method} ${req.url}\x1b[0m`);

  next();
});


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

// --------------------------
// MongoDB connection
// --------------------------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected ✅"))
  .catch((err) => console.error("MongoDB error ❌", err));

// --------------------------
// Start server
// --------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
