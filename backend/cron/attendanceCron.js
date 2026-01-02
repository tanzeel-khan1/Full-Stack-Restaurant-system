import cron from "node-cron";
import moment from "moment-timezone";
import Attendance from "../models/Attendance.js";
import User from "../models/User.js";

cron.schedule(
  "34 22 * * *", // 10:25 PM
  async () => {
    try {
      console.log("⏰ 10:34 PM cron running");

      // ✅ Karachi timezone ke start & end of day
      const startOfDay = moment
        .tz("Asia/Karachi")
        .startOf("day")
        .toDate();

      const endOfDay = moment
        .tz("Asia/Karachi")
        .endOf("day")
        .toDate();

      // ✅ Sirf waiters
      const users = await User.find({ role: "waiter" }).select("_id");

      for (const user of users) {
        // ✅ Day-range match (string / Date dono cover)
        const existingAttendance = await Attendance.findOne({
          userId: user._id,
          date: {
            $gte: startOfDay,
            $lte: endOfDay,
          },
        });

        // ❌ Agar already present/absent hai → kuch nahi karo
        if (existingAttendance) continue;

        // ✅ Nahi hai to absent mark karo
        await Attendance.create({
          userId: user._id,
          date: startOfDay, // hamesha Date object
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
