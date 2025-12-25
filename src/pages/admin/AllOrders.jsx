import React from "react";
import { useOrders, useDeleteOrder } from "../../hooks/useOrders";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import { FaLongArrowAltLeft } from "react-icons/fa";

const AdminOrders = () => {
  const { data: orders, isLoading, isError } = useOrders();
  const deleteOrder = useDeleteOrder();

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      deleteOrder.mutate(id, {
        onSuccess: () => toast.success("Order deleted successfully"),
        onError: () => toast.error("Failed to delete"),
      });
    }
  };

  if (isLoading)
    return <p className="text-center mt-10 text-amber-400">Loading orders...</p>;
  if (isError)
    return (
      <p className="text-center mt-10 text-red-500">Failed to load orders.</p>
    );

  return (
    <div className="min-h-screen bg-[#181C14] p-6">
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
      <h1 className="text-3xl font-bold mb-6 text-amber-400">
        All Orders (Admin)
      </h1>

      <div className="overflow-x-auto rounded-lg shadow-lg">
        <table className="min-w-full border border-gray-700 bg-[#1F2421]">
          <thead className="bg-[#242A25] text-amber-400">
            <tr>
              <th className="py-3 px-4 border-b border-gray-700 text-left">#</th>
              <th className="py-3 px-4 border-b border-gray-700 text-left">
                User Info
              </th>
              <th className="py-3 px-4 border-b border-gray-700 text-left">
                Dishes
              </th>
              <th className="py-3 px-4 border-b border-gray-700 text-left">
                Total Price
              </th>
              <th className="py-3 px-4 border-b border-gray-700 text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {orders?.length > 0 ? (
              orders.map((order, index) => (
                <motion.tr
                  key={order._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="hover:bg-[#2C332D] text-gray-200"
                >
                  <td className="py-3 px-4 border-b border-gray-700 text-center">
                    {index + 1}
                  </td>

                  <td className="py-3 px-4 border-b border-gray-700">
                    <span className="font-semibold text-amber-400">
                      {order.userId?.name || "Unknown User"}
                    </span>
                    <br />
                    <span className="text-xs text-gray-400">
                      {order.userId?.email}
                    </span>
                  </td>

                  <td className="py-3 px-4 border-b border-gray-700">
                    {order.dishes?.map((item, i) => (
                      <span key={i} className="block text-sm">
                        {item.dish?.name || item.dish} × {item.quantity}
                      </span>
                    ))}
                  </td>

                  <td className="py-3 px-4 border-b border-gray-700 font-semibold text-amber-400">
                    ${order.totalPrice}
                  </td>

                  <td className="py-3 px-4 border-b border-gray-700 text-center">
                    <button
                      onClick={() => handleDelete(order._id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-sm transition cursor-pointer"
                      disabled={deleteOrder.isLoading}
                    >
                      {deleteOrder.isLoading ? "Deleting..." : "Delete"}
                    </button>
                  </td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="text-center py-6 text-gray-400 border-gray-700"
                >
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrders;
