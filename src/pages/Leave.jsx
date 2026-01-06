import React, { useState } from "react";
import { useApplyLeave } from "../hooks/useAttendance"; // path adjust karo
import { toast } from "sonner"; // ✅ Sonner import

const Leave = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;

  const { mutate: applyLeave, isLoading } = useApplyLeave();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!userId) {
      toast.error("User not logged in ❌"); // Sonner error
      return;
    }

    applyLeave(
      {
        userId,
        startDate,
        endDate,
        reason,
      },
      {
        onSuccess: (data) => {
          toast.success(`Leave Applied Successfully  Total Days: ${data.totalDays}`); // Sonner success
          setStartDate("");
          setEndDate("");
          setReason("");
        },
        onError: (error) => {
          toast.error(error.response?.data?.message || "Something went wrong ❌"); // Sonner error
        },
      }
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#181C14] via-[#1f241a] to-black text-amber-400 p-4">
      <div className="w-full max-w-md bg-[#1f241a] p-6 rounded-lg border-b border-amber-500/30 shadow-md">
        <h2 className="text-2xl font-semibold mb-4 border-b border-amber-500/30 pb-2">
          Apply Leave
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col">
            <label className="mb-1">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
              className="p-2 rounded bg-[#181C14] border border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
              className="p-2 rounded bg-[#181C14] border border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1">Reason</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              rows={4}
              className="p-2 rounded bg-[#181C14] border border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 cursor-pointer bg-amber-400 text-black font-semibold rounded hover:bg-amber-300 transition disabled:opacity-50"
          >
            {isLoading ? "Applying..." : "Apply Leave"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Leave;
