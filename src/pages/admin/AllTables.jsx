import React from "react";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { useTables, useTableMutations } from "../../hooks/useTables";
import { useNavigate, Link } from "react-router-dom";
import { FaLongArrowAltLeft } from "react-icons/fa";
const AllTables = () => {
  const { data: tables, isLoading, isError } = useTables();
  const { deleteTable } = useTableMutations();

  const handleTableDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this table?")) {
      deleteTable.mutate(id, {
        onSuccess: () => toast.success("Table deleted successfully"),
        onError: () => toast.error("Failed to delete"),
      });
    }
  };

  if (isLoading)
    return <p className="text-center mt-10 text-amber-400">Loading tables...</p>;
  if (isError)
    return (
      <p className="text-center mt-10 text-red-500">Failed to load tables.</p>
    );

  return (
    <div className="min-h-screen bg-[#181C14] text-amber-400 p-6">
        <Link
            to="/admin"
            className="flex items-center gap-2 w-fit bg-transparent border border-amber-400 mb-5
             rounded-md px-3 py-2 cursor-pointer text-amber-400 text-sm md:text-base 
             shadow-md transition-all duration-300 ease-in-out
             hover:-translate-y-0.5 hover:shadow-[0_0_20px_4px_rgba(251,191,36,0.8)]"
          >
            <FaLongArrowAltLeft />
            <span>Go Back</span>
          </Link>
      <Toaster />
      <h1 className="text-2xl font-bold mb-6"> All Tables (Admin)</h1>

      <div className="overflow-x-auto rounded-lg shadow-lg">
        <table className="min-w-full bg-[#20251C] border border-gray-700 rounded-lg overflow-hidden">
          <thead className="bg-[#2B3224] text-amber-400">
            <tr>
              <th className="py-3 px-4 border-b border-gray-700">#</th>
              <th className="py-3 px-4 border-b border-gray-700">Table No.</th>
              <th className="py-3 px-4 border-b border-gray-700">Capacity</th>
              <th className="py-3 px-4 border-b border-gray-700">Status</th>
              <th className="py-3 px-4 border-b border-gray-700">Reservation</th>
              <th className="py-3 px-4 border-b border-gray-700">Duration</th>
              <th className="py-3 px-4 border-b border-gray-700">Category</th>
              <th className="py-3 px-4 border-b border-gray-700">Payment</th>
              <th className="py-3 px-4 border-b border-gray-700">Amount</th>
              <th className="py-3 px-4 border-b border-gray-700">User</th>
              <th className="py-3 px-4 border-b border-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tables?.length > 0 ? (
              tables.map((table, index) => (
                <motion.tr
                  key={table._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="hover:bg-[#2B3224] transition"
                >
                  <td className="py-3 px-4 border-b border-gray-700 text-center">
                    {index + 1}
                  </td>
                  <td className="py-3 px-4 border-b border-gray-700 text-center">
                    {table.number}
                  </td>
                  <td className="py-3 px-4 border-b border-gray-700 text-center">
                    {table.capacity}
                  </td>
                  <td className="py-3 px-4 border-b border-gray-700 text-center">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        table.status === "available"
                          ? "bg-green-900 text-green-400"
                          : table.status === "reserved"
                          ? "bg-yellow-900 text-yellow-400"
                          : "bg-red-900 text-red-400"
                      }`}
                    >
                      {table.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 border-b border-gray-700 text-center">
                    {table.reservationDateTime
                      ? new Date(table.reservationDateTime).toLocaleString()
                      : "-"}
                  </td>
                  <td className="py-3 px-4 border-b border-gray-700 text-center">
                    {table.reservationDuration || "-"}
                  </td>
                  <td className="py-3 px-4 border-b border-gray-700 text-center">
                    {table.category}
                  </td>
                  <td className="py-3 px-4 border-b border-gray-700 text-center">
                    {table.paymentStatus}
                  </td>
                  <td className="py-3 px-4 border-b border-gray-700 font-semibold text-center">
                    $. {table.totalAmount}
                  </td>
                  <td className="py-3 px-4 border-b border-gray-700 text-center">
                    {table.userId?.name || table.userId || "Unknown"}
                  </td>
                  <td className="py-3 px-4 border-b border-gray-700 text-center">
                    <button
                      onClick={() => handleTableDelete(table._id)}
                      className="bg-red-600 cursor-pointer hover:bg-red-700 text-white px-3 py-1 rounded-lg text-sm transition"
                      disabled={deleteTable.isLoading}
                    >
                      {deleteTable.isLoading ? "Deleting..." : "Delete"}
                    </button>
                  </td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="11"
                  className="text-center py-6 text-gray-400 font-medium"
                >
                  No tables found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllTables;
