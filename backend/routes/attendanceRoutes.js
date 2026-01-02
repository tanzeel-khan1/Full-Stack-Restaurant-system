import express from "express";
import {
  markAttendance,
  getUserAttendance,
  deleteAttendanceByDate,
} from "../Controllers/attendanceController.js";

import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Mark attendance – any authenticated user
router.post("/mark",  markAttendance);

// ✅ Get user attendance – any authenticated user
router.get("/:userId", protect, getUserAttendance);

// 🔐 Admin-only delete attendance
router.delete("/delete", protect, adminOnly, deleteAttendanceByDate);

export default router;
