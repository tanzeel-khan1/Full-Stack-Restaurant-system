import Attendance from "../models/Attendance.js";
import User from "../models/User.js";
import moment from "moment-timezone";

export const markAttendance = async (req, res) => {
  try {
    const { userId } = req.body;

    // 1️⃣ User check
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User does not exist",
      });
    }

    // 2️⃣ Aaj ki date (STRING)
    const today = moment
      .tz("Asia/Karachi")
      .format("YYYY-MM-DD");

    // 3️⃣ Check existing attendance
    const existing = await Attendance.findOne({
      userId,
      date: today,
    });

    // 🟡 Agar leave lagi hai → PRESENT bana do
    if (existing && existing.status === "leave") {
      existing.status = "present";
      existing.checkIn = new Date();
      existing.leaveReason = undefined;
      existing.approvalStatus = "approved";

      await existing.save();

      return res.json({
        success: true,
        message: "Leave converted to present",
        attendance: existing,
      });
    }

    // 🔴 Agar already present
    if (existing && existing.status === "present") {
      return res.status(400).json({
        success: false,
        message: "Attendance already marked for today",
      });
    }

    // 🟢 No record → create present
    const attendance = await Attendance.create({
      userId,
      date: today,
      status: "present",
      checkIn: new Date(),
    });

    res.json({
      success: true,
      message: "Attendance marked as present",
      attendance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* APPLY LEAVE */
export const applyLeave = async (req, res) => {
  try {
    const { userId, startDate, endDate, reason } = req.body;

    if (!startDate || !endDate || !reason) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const start = moment(startDate);
    const end = moment(endDate);

    if (end.isBefore(start)) {
      return res.status(400).json({
        success: false,
        message: "End date cannot be before start date",
      });
    }

    let records = [];

    for (
      let date = start.clone();
      date.isSameOrBefore(end);
      date.add(1, "day")
    ) {
      const formattedDate = date.format("YYYY-MM-DD");

      const exists = await Attendance.findOne({
        userId,
        date: formattedDate,
      });

      if (exists) continue; // skip already marked

      records.push({
        userId,
        date: formattedDate,
        status: "leave",
        leaveReason: reason,
        approvalStatus: "pending",
      });
    }

    await Attendance.insertMany(records);

    res.json({
      success: true,
      message: "Leave applied successfully",
      totalDays: records.length,
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

/* DELETE ATTENDANCE BY DATE */
export const deleteAttendanceByDate = async (req, res) => {
  try {
    const { userId, date } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User does not exist",
      });
    }

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

export const getPendingLeaves = async (req, res) => {
  const leaves = await Attendance.find({
    status: "leave",
    approvalStatus: "pending",
  }).populate("userId", "name email");

  res.json({ success: true, leaves });
};

export const leaveDecision = async (req, res) => {
  const { attendanceId, decision } = req.body;

  if (!["approved", "rejected"].includes(decision)) {
    return res.status(400).json({
      success: false,
      message: "Invalid decision",
    });
  }

  const leave = await Attendance.findById(attendanceId);

  if (!leave) {
    return res.status(404).json({
      success: false,
      message: "Leave not found",
    });
  }

  leave.approvalStatus = decision;
  leave.approvedBy = req.user.id; // admin id
  await leave.save();

  res.json({
    success: true,
    message: `Leave ${decision}`,
  });
};
