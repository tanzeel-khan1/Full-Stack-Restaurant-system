import cron from "node-cron";
import moment from "moment-timezone";
import Attendance from "../models/Attendance.js";
import User from "../models/User.js";

cron.schedule(
"8 0 * * *" ,// 12:10 AM daily
  async () => {
    try {
      console.log("⏰ 12:8 AM cron running");

      // ✅ Karachi timezone start & end of day
      const startOfDay = moment.tz("Asia/Karachi").startOf("day").toDate();

      const endOfDay = moment.tz("Asia/Karachi").endOf("day").toDate();

      // ✅ Sirf waiters
      const users = await User.find({ role: "waiter" }).select("_id");

      for (const user of users) {
        // ✅ Date RANGE se check (IMPORTANT)
        const existingAttendance = await Attendance.findOne({
          userId: user._id,
          date: {
            $gte: startOfDay,
            $lte: endOfDay,
          },
        });

        // ❌ Agar present ya leave already hai → skip
        if (
          existingAttendance &&
          ["present", "leave"].includes(existingAttendance.status)
        ) {
          continue;
        }

        // ❌ Agar absent already hai → skip (duplicate na bane)
        if (existingAttendance && existingAttendance.status === "absent") {
          continue;
        }

        // ✅ Nahi hai → absent mark karo
        await Attendance.create({
          userId: user._id,
          date: startOfDay, // ✅ Date object only
          status: "absent",
        });
      }

      console.log("✅ Absent marked correctly (no duplicates)");
    } catch (error) {
      console.error("❌ Cron error:", error);
    }
  },
  {
    timezone: "Asia/Karachi",
  }
);
