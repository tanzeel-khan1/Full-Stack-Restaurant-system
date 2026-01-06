// import React from "react";
// import { useIncompleteOrders, useUpdateOrder } from "../hooks/useOrders";
// import { motion } from "framer-motion";
// import toast, { Toaster } from "react-hot-toast";
// import { useNavigate, Link } from "react-router-dom";
// import { FaLongArrowAltLeft } from "react-icons/fa";

// const PendingOrder = () => {
//   const { data: orders, isLoading, isError, error } = useIncompleteOrders();
//   const updateOrder = useUpdateOrder();

//   const handleComplete = (id) => {
//     updateOrder.mutate(
//       { id, updatedOrder: { status: "completed" } },
//       {
//         onSuccess: () => toast.success("Order marked as completed"),
//         onError: () => toast.error("Failed to update order"),
//       }
//     );
//   };

//   if (isLoading)
//     return <p className="text-center mt-10 text-amber-400">Loading pending orders...</p>;

//   if (isError)
//     return (
//       <p className="text-center mt-10 text-red-500">
//         Failed to load pending orders. {error?.message}
//       </p>
//     );

//   return (
//     <div className="min-h-screen bg-[#181C14] p-6">
//       <Toaster />
//       <Link
//             to="/admin"
//             className="flex items-center gap-2 w-fit bg-transparent border border-amber-400 mb-5
//              rounded-md px-3 py-2 cursor-pointer text-amber-400 text-sm md:text-base 
//              shadow-md transition-all duration-300 ease-in-out
//              hover:-translate-y-0.5 hover:shadow-[0_0_20px_4px_rgba(251,191,36,0.8)]"
//           >
//             <FaLongArrowAltLeft />
//             <span>Go Back</span>
//           </Link>
//       <h1 className="text-3xl font-bold mb-6 text-amber-400">Pending Orders</h1>

//       <div className="overflow-x-auto rounded-lg shadow-lg">
//         <table className="min-w-full border border-gray-700 bg-[#1F2421]">
//           <thead className="bg-[#242A25] text-amber-400">
//             <tr>
//               <th className="py-3 px-4 border-b border-gray-700 text-left">#</th>
//               <th className="py-3 px-4 border-b border-gray-700 text-left">User Info</th>
//               <th className="py-3 px-4 border-b border-gray-700 text-left">Dishes</th>
//               <th className="py-3 px-4 border-b border-gray-700 text-left">Status</th>
//               <th className="py-3 px-4 border-b border-gray-700 text-center">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {orders?.length > 0 ? (
//               orders.map((order, index) => (
//                 <motion.tr
//                   key={order._id}
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.3 }}
//                   className="hover:bg-[#2C332D] text-gray-200"
//                 >
//                   <td className="py-3 px-4 border-b border-gray-700 text-center">{index + 1}</td>

//                   <td className="py-3 px-4 border-b border-gray-700">
//                     <span className="font-semibold text-amber-400">
//                       {order.userId?.name || "Unknown User"}
//                     </span>
//                     <br />
//                     <span className="text-xs text-gray-400">{order.userId?.email}</span>
//                   </td>

//                   <td className="py-3 px-4 border-b border-gray-700">
//                     {order.dishes?.map((item, i) => (
//                       <span key={i} className="block text-sm">
//                         {item.dish?.name || item.dish} × {item.quantity}
//                       </span>
//                     ))}
//                   </td>

//                   <td className="py-3 px-4 border-b border-gray-700 font-semibold text-amber-400">
//                     {order.status}
//                   </td>

//                   <td className="py-3 px-4 border-b border-gray-700 text-center">
//                     <button
//                       onClick={() => handleComplete(order._id)}
//                       className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg text-sm transition cursor-pointer"
//                       disabled={updateOrder.isLoading}
//                     >
//                       {updateOrder.isLoading ? "Updating..." : "Mark as Completed"}
//                     </button>
//                   </td>
//                 </motion.tr>
//               ))
//             ) : (
//               <tr>
//                 <td
//                   colSpan="5"
//                   className="text-center py-6 text-gray-400 border-gray-700"
//                 >
//                   No pending orders
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default PendingOrder;
import React from "react";
import { useIncompleteOrders, useMarkOrderAsCompleted } from "../hooks/useOrders";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import { FaLongArrowAltLeft } from "react-icons/fa";

const PendingOrder = () => {
  const { data: orders, isLoading, isError, error } = useIncompleteOrders();
  const markOrderCompleted = useMarkOrderAsCompleted();

  const handleComplete = (id) => {
    markOrderCompleted.mutate(id, {
      onSuccess: () => toast.success("Order marked as completed"),
      onError: () => toast.error("Failed to update order"),
    });
  };

  if (isLoading)
    return <p className="text-center mt-10 text-amber-400">Loading pending orders...</p>;

  if (isError)
    return (
      <p className="text-center mt-10 text-red-500">
        Failed to load pending orders. {error?.message}
      </p>
    );

  return (
    <div className="min-h-screen bg-[#181C14] p-6">
      <Toaster />
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

      <h1 className="text-3xl font-bold mb-6 text-amber-400">Pending Orders</h1>

      <div className="overflow-x-auto rounded-lg shadow-lg">
        <table className="min-w-full border border-gray-700 bg-[#1F2421]">
          <thead className="bg-[#242A25] text-amber-400">
            <tr>
              <th className="py-3 px-4 border-b border-gray-700 text-left">#</th>
              <th className="py-3 px-4 border-b border-gray-700 text-left">User Info</th>
              <th className="py-3 px-4 border-b border-gray-700 text-left">Dishes</th>
              <th className="py-3 px-4 border-b border-gray-700 text-left">Status</th>
              <th className="py-3 px-4 border-b border-gray-700 text-center">Actions</th>
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
                  <td className="py-3 px-4 border-b border-gray-700 text-center">{index + 1}</td>

                  <td className="py-3 px-4 border-b border-gray-700">
                    <span className="font-semibold text-amber-400">
                      {order.userId?.name || "Unknown User"}
                    </span>
                    <br />
                    <span className="text-xs text-gray-400">{order.userId?.email}</span>
                  </td>

                  <td className="py-3 px-4 border-b border-gray-700">
                    {order.dishes?.map((item, i) => (
                      <span key={i} className="block text-sm">
                        {item.dish?.name || item.dish} × {item.quantity}
                      </span>
                    ))}
                  </td>

                  <td className="py-3 px-4 border-b border-gray-700 font-semibold text-amber-400">
                    {order.status}
                  </td>

                  <td className="py-3 px-4 border-b border-gray-700 text-center">
                    <button
                      onClick={() => handleComplete(order._id)}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg text-sm transition cursor-pointer"
                      disabled={markOrderCompleted.isLoading}
                    >
                      {markOrderCompleted.isLoading ? "Updating..." : "Mark as Completed"}
                    </button>
                  </td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-400 border-gray-700">
                  No pending orders
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PendingOrder;
