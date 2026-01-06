import React from "react";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { FaLongArrowAltLeft } from "react-icons/fa";
import { Link } from "react-router-dom";
import {
  useAttendance,
  useDeleteAttendance,
  useApproveAttendance,
} from "../../hooks/useAttendance";

const AttendanceDash = () => {
  const { data, isLoading, isError, error } = useAttendance();
  const { mutate: deleteAttendance } = useDeleteAttendance();
  const { mutate: approveAttendance } = useApproveAttendance();

  const attendanceList = data?.attendance ?? [];

  // Approve
  const handleApprove = (id) => {
    approveAttendance(
      { id, decision: "approved" },
      {
        onSuccess: () => toast.success("Attendance approved"),
        onError: () => toast.error("Approval failed"),
      }
    );
  };

  // Reject
  const handleReject = (id) => {
    approveAttendance(
      { id, decision: "rejected" },
      {
        onSuccess: () => toast.success("Attendance rejected"),
        onError: () => toast.error("Reject failed"),
      }
    );
  };

  // Delete
  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this attendance?"))
      return;

    deleteAttendance(id, {
      onSuccess: () => toast.success("Attendance deleted"),
      onError: () => toast.error("Delete failed"),
    });
  };

  if (isLoading)
    return (
      <p className="text-center mt-10 text-amber-400">Loading attendance...</p>
    );

  if (isError)
    return (
      <p className="text-center mt-10 text-red-500">
        {error?.message || "Something went wrong"}
      </p>
    );

  return (
    <div className="min-h-screen bg-[#181C14] text-amber-400 p-6">
      <Toaster position="top-right" />

      {/* Back */}
      <Link
        to="/admin"
        className="flex items-center gap-2 w-fit border border-amber-400 mb-6
                   rounded-md px-3 py-2 text-amber-400 shadow-md
                   hover:-translate-y-0.5
                   hover:shadow-[0_0_20px_4px_rgba(251,191,36,0.8)]"
      >
        <FaLongArrowAltLeft />
        <span>Go Back</span>
      </Link>

      <h1 className="text-2xl font-bold mb-6">Attendance Dashboard</h1>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg shadow-lg">
        <table className="min-w-full bg-[#20251C] border border-gray-700">
          <thead className="bg-[#2B3224]">
            <tr>
              <th className="py-3 px-4">#</th>
              <th className="py-3 px-4">User</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {attendanceList.length > 0 ? (
              attendanceList.map((att, index) => {
                // Enable Approve/Reject only if approvalStatus === "pending"
                const isPending = att.approvalStatus === "pending";

                return (
                  <motion.tr
                    key={att._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="hover:bg-[#2B3224]"
                  >
                    <td className="py-3 px-4 text-center">{index + 1}</td>
                    <td className="py-3 px-4 text-center">
                      {att.userId?.name || "N/A"}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {new Date(att.date).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          att.status === "approved"
                            ? "bg-green-900 text-green-400"
                            : att.status === "pending"
                            ? "bg-yellow-900 text-yellow-400"
                            : "bg-red-900 text-red-400"
                        }`}
                      >
                        {att.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 flex justify-center gap-2">
                      <button
                        onClick={() => handleApprove(att._id)}
                        disabled={!isPending} // disabled if not pending
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm disabled:opacity-50"
                      >
                        Approve
                      </button>

                      <button
                        onClick={() => handleReject(att._id)}
                        disabled={!isPending} // disabled if not pending
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm disabled:opacity-50"
                      >
                        Reject
                      </button>

                      <button
                        onClick={() => handleDelete(att._id)}
                        className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </motion.tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-400">
                  No attendance found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceDash;
