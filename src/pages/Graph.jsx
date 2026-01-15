import React, { useMemo } from "react";
import { useAttendanceByUser } from "../hooks/useAttendance";

const Graph = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;

  const { data: attendance = [], isLoading } = useAttendanceByUser(userId);

  // ✅ Decide correct year (current year)
  const year = new Date().getFullYear();

  // const weeks = useMemo(() => {
  //   // 53 weeks to safely cover full year
  //   const grid = Array.from({ length: 53 }, () =>
  //     Array.from({ length: 7 }, () => ({
  //       level: 0,
  //       date: null,
  //       status: null,
  //     }))
  //   );

  //   attendance.forEach((item) => {
  //     const date = new Date(item.date);

  //     // ❌ Skip other years
  //     if (date.getFullYear() !== year) return;

  //     const startOfYear = new Date(year, 0, 1);

  //     const dayOfYear = Math.floor(
  //       (date - startOfYear) / (1000 * 60 * 60 * 24)
  //     );

  //     const weekIndex = Math.floor(dayOfYear / 7);
  //     const dayIndex = (date.getDay() + 6) % 7; // Monday first

  //     if (weekIndex < 53) {
  //       grid[weekIndex][dayIndex] = {
  //         level: getLevelFromStatus(item.status),
  //         date: date.toDateString(),
  //         status: item.status,
  //       };
  //     }
  //   });

  //   return grid;
  // }, [attendance, year]);
const weeks = useMemo(() => {
  const grid = Array.from({ length: 53 }, () =>
    Array.from({ length: 7 }, () => ({
      level: 0,
      date: null,
      status: null,
    }))
  );

  // ✅ Start from first Monday of the year
  const startOfYear = new Date(year, 0, 1);
  const startDay = startOfYear.getDay(); // 0 = Sun
  const firstMonday =
    startDay === 0
      ? new Date(year, 0, 2)
      : new Date(year, 0, 1 + (8 - startDay));

  attendance.forEach((item) => {
    const date = new Date(item.date);
    if (date.getFullYear() !== year) return;

    const diffDays = Math.floor(
      (date - firstMonday) / (1000 * 60 * 60 * 24)
    );

    if (diffDays < 0) return;

    const weekIndex = Math.floor(diffDays / 7);
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

  if (!userId) return <div className="text-red-500">User not found!</div>;

  if (isLoading) return <div className="text-gray-400">Loading heatmap...</div>;

  return (
    <div className="bg-[#0d1117] p-4 rounded-lg inline-block text-gray-400 text-xs w-full md:w-auto">
      {/* ✅ Year Heading */}
      <div className="mb-3 text-sm font-semibold text-gray-300">
        Attendance – {year}
      </div>

      <div className="overflow-x-auto md:overflow-x-visible -mx-4 md:mx-0 px-4 md:px-0 scrollbar-hide">
        <div className="grid grid-flow-col gap-[3px] min-w-max md:min-w-0">
          {weeks.map((week, wIndex) => (
            <div key={wIndex} className="grid grid-rows-7 gap-[3px]">
              {week.map((cell, dIndex) => (
                <div
                  key={dIndex}
                  title={
                    cell.date ? `${cell.date} • ${cell.status}` : "No data"
                  }
                  className={`
              w-[10px] h-[10px] 
              md:w-[12px] md:h-[12px]
              rounded-[2px]
              ${getGoldenColor(cell.level)}
            `}
                />
              ))}
            </div>
          ))}
        </div>
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
      return "bg-red-800"; // absent
    case 2:
      return "bg-blue-400"; // leave
    case 4:
      return "bg-[#ffd700]"; // present
    default:
      return "bg-[#161b22]";
  }
};

export default Graph;
