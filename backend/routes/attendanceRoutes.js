import express from "express";
import {
  markAttendance,
  getUserAttendance,
  deleteAttendanceByDate,
  applyLeave,
  getPendingLeaves,
  leaveDecision,
} from "../Controllers/attendanceController.js";

import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Mark attendance – any authenticated user
router.post("/mark", markAttendance);

// ✅ Get user attendance – any authenticated user
router.get("/:userId", protect, getUserAttendance);
router.post("/apply-leave", applyLeave);
router.get("/pending-leaves", getPendingLeaves);
// 🔐 Admin-only delete attendance
router.delete("/delete", protect, adminOnly, deleteAttendanceByDate);
router.patch("/decision", leaveDecision);
export default router;
