import React, { useEffect, useState } from "react";
import { useCreateAttendance } from "../hooks/useAttendance";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const CreateAttendance = () => {
  const { mutate: createAttendance, isLoading } = useCreateAttendance();
  const navigate = useNavigate();

  const [date, setDate] = useState("");

  // 🔹 userId from localStorage
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;

  // 🔹 always today (fixed)
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setDate(today);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!userId) {
      toast.error("User not found. Please login again.");
      return;
    }

    const attendanceData = {
      userId,
      date,                 // ✅ always today
      status: "present",
      checkIn: new Date(),
    };

    createAttendance(attendanceData, {
      onSuccess: () => {
        toast.success("Attendance marked successfully ✅");

        // 🔁 redirect after short delay
        setTimeout(() => {
          navigate("/waiter");
        }, 1200);
      },
      onError: (error) => {
        toast.error(
          error?.response?.data?.message ||
            "Attendance already marked or error occurred ❌"
        );
      },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f120d] via-[#141812] to-black flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#111] border border-amber-500/20 rounded-2xl shadow-xl p-6">
        
        <h2 className="text-2xl font-bold text-amber-400 text-center mb-6">
          Mark Attendance
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Date (LOCKED) */}
          <div>
            <label className="block text-gray-300 mb-1">
              Date (Today)
            </label>
            <input
              type="date"
              value={date}
              disabled
              className="w-full px-4 py-2 rounded-lg bg-[#1c1c1c] border border-gray-700 text-gray-400 cursor-not-allowed"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl cursor-pointer bg-amber-500 text-black font-semibold hover:bg-amber-400 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? "Marking Attendance..." : "Mark Present"}
          </button>
        </form>

      </div>
    </div>
  );
};

export default CreateAttendance;
