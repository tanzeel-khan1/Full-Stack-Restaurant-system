import Attendance from "../models/Attendance.js";
import User from "../models/User.js";
import moment from "moment-timezone";

export const markAttendance = async (req, res) => {
  try {
    const { userId } = req.body;

    // 1️⃣ Check user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User does not exist",
      });
    }

    // 2️⃣ Aaj ka din (Date OBJECT — very important)
    const startOfDay = moment.tz("Asia/Karachi").startOf("day").toDate();

    const endOfDay = moment.tz("Asia/Karachi").endOf("day").toDate();

    const now = new Date();

    // 3️⃣ Check agar aaj ki attendance already hai
    const existing = await Attendance.findOne({
      userId,
      date: { $gte: startOfDay, $lte: endOfDay },
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Attendance already marked",
      });
    }

    // 4️⃣ PRESENT mark karo (Date object save hoga)
    const attendance = await Attendance.create({
      userId,
      date: startOfDay, // ✅ Date object ONLY
      status: "present",
      checkIn: now,
    });

    res.json({
      success: true,
      message: "Attendance marked successfully",
      attendance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
/* GET USER ATTENDANCE */
export const getUserAttendance = async (req, res) => {
  try {
    const { userId } = req.params;

    const attendance = await Attendance.find({ userId }).sort({ date: -1 });

    res.json({ success: true, attendance });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
export const deleteAttendanceByDate = async (req, res) => {
  try {
    const { userId, date } = req.body;

    // ✅ User check
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User does not exist",
      });
    }

    // ✅ Validate date (Pakistan format)
    const formattedDate = moment
      .tz(date, "YYYY-MM-DD", "Asia/Karachi")
      .format("YYYY-MM-DD");

    const deleted = await Attendance.findOneAndDelete({
      userId,
      date: formattedDate,
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Attendance not found for this date",
      });
    }

    res.json({
      success: true,
      message: "Attendance deleted successfully",
      deletedAttendance: deleted,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
