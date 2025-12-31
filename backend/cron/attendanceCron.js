import cron from "node-cron";
import moment from "moment-timezone";
import Attendance from "../models/Attendance.js";
import User from "../models/User.js";

// ⏰ 9:01 AM Pakistan Time
cron.schedule(
  "1 9 * * *",
  async () => {
    console.log("⏰ Karachi time cron running...");

    const today = moment()
      .tz("Asia/Karachi")
      .format("YYYY-MM-DD");

    const users = await User.find({ role: "user" });

    for (const user of users) {
      const existing = await Attendance.findOne({
        userId: user._id,
        date: today,
      });

      // ❌ Agar attendance mark nahi hui
      if (!existing) {
        await Attendance.create({
          userId: user._id,
          date: today,
          status: "absent",
        });
      }
    }

    console.log("✅ Absent marked (Pakistan Time)");
  },
  {
    timezone: "Asia/Karachi", // 🔥 VERY IMPORTANT
  }
);
