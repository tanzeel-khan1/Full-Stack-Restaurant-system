import React, { useMemo } from "react";
import { useAttendanceByUser } from "../hooks/useAttendance";

const Graph = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;

  const { data: attendance = [], isLoading } = useAttendanceByUser(userId);

  // ✅ Decide correct year (current year)
  const year = new Date().getFullYear();

  const weeks = useMemo(() => {
    // 53 weeks to safely cover full year
    const grid = Array.from({ length: 53 }, () =>
      Array.from({ length: 7 }, () => ({
        level: 0,
        date: null,
        status: null,
      }))
    );

    attendance.forEach((item) => {
      const date = new Date(item.date);

      // ❌ Skip other years
      if (date.getFullYear() !== year) return;

      const startOfYear = new Date(year, 0, 1);

      const dayOfYear = Math.floor(
        (date - startOfYear) / (1000 * 60 * 60 * 24)
      );

      const weekIndex = Math.floor(dayOfYear / 7);
      const dayIndex = (date.getDay() + 6) % 7; // Monday first

      if (weekIndex < 53) {
        grid[weekIndex][dayIndex] = {
          level: getLevelFromStatus(item.status),
          date: date.toDateString(),
          status: item.status,
        };
      }
    });

    return grid;
  }, [attendance, year]);

  if (!userId)
    return <div className="text-red-500">User not found!</div>;

  if (isLoading)
    return <div className="text-gray-400">Loading heatmap...</div>;

  return (
    <div className="bg-[#0d1117] p-4 rounded-lg inline-block text-gray-400 text-xs">
      {/* ✅ Year Heading */}
      <div className="mb-3 text-sm font-semibold text-gray-300">
        Attendance – {year}
      </div>

      <div className="grid grid-flow-col gap-[3px]">
        {weeks.map((week, wIndex) => (
          <div key={wIndex} className="grid grid-rows-7 gap-[3px]">
            {week.map((cell, dIndex) => (
              <div
                key={dIndex}
                title={
                  cell.date
                    ? `${cell.date} • ${cell.status}`
                    : "No data"
                }
                className={`w-[12px] h-[12px] rounded-[2px] ${getGoldenColor(
                  cell.level
                )}`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

/* ================= HELPERS ================= */

const getLevelFromStatus = (status) => {
  switch (status) {
    case "absent":
      return 1;
    case "leave":
      return 2;
    case "present":
      return 4;
    default:
      return 0;
  }
};

const getGoldenColor = (level) => {
  switch (level) {
    case 0:
      return "bg-[#161b22]";
    case 1:
      return "bg-[#453200]"; // absent
    case 2:
      return "bg-[#7d5a00]"; // leave
    case 4:
      return "bg-[#ffd700]"; // present
    default:
      return "bg-[#161b22]";
  }
};

export default Graph;
