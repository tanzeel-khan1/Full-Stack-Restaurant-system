// import express from "express";
// import {
//   markAttendance,
//   getUserAttendance,
//     deleteAttendanceByDate,
// } from "../Controllers/attendanceController.js";

// const router = express.Router();

// router.post("/mark", markAttendance);
// router.get("/:userId", getUserAttendance);
// router.delete("/delete", deleteAttendanceByDate);

// export default router;
import express from "express";
import {
  markAttendance,
  getUserAttendance,
  deleteAttendanceByDate,
} from "../Controllers/attendanceController.js";

import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Mark attendance – any authenticated user
router.post("/mark", protect, markAttendance);

// ✅ Get user attendance – any authenticated user
router.get("/:userId", protect, getUserAttendance);

// 🔐 Admin-only delete attendance
router.delete("/delete", protect, adminOnly, deleteAttendanceByDate);

export default router;
