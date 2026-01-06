import express from "express";
import {
  markAttendance,
  getUserAttendance,
  deleteAttendanceById,
  applyLeave,
  getPendingLeaves,
  leaveDecision,
  getAllAttendance,
} from "../Controllers/attendanceController.js";

import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Mark attendance – any authenticated user
router.post("/mark", markAttendance);

// ✅ Get user attendance – any authenticated user
router.get("/:userId", protect, getUserAttendance);
router.post("/apply-leave", applyLeave);
router.get("/pending-leaves", getPendingLeaves);
router.get("/", getAllAttendance);

// 🔐 Admin-only delete attendance
router.delete(
  "/delete/:attendanceId",
  protect,
  adminOnly,
  deleteAttendanceById
);
router.put("/decision/:attendanceId", protect, leaveDecision);

export default router;
