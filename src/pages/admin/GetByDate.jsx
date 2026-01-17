import React, { useState } from "react";
import { useOrdersByUserNameAndDate } from "../../hooks/useOrders";
import { Link } from "react-router-dom";
import { FaLongArrowAltLeft } from "react-icons/fa";

const GetByDate = () => {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Only call the query after form submission
  const { data: orders, isLoading, isError, error } = useOrdersByUserNameAndDate({
    name,
    date,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !date) return alert("Please enter both name and date");
    setSubmitted(true); // trigger query
  };

  return (
    <div className="p-6 bg-[#181C14] min-h-screen text-amber-400">
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

      <h2 className="text-2xl font-bold mb-6">Get Orders by Username & Date</h2>

      <form onSubmit={handleSubmit} className="mb-6 flex flex-wrap gap-4 items-center">
        <input
          type="text"
          placeholder="Username"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="px-4 py-2 rounded-md bg-[#262A1F] placeholder:text-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="px-4 py-2 rounded-md bg-[#262A1F] placeholder:text-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
        />
        <button
          type="submit"
          className="px-5 py-2 rounded-md bg-amber-400 text-[#181C14] font-semibold hover:bg-amber-300 transition"
        >
          Fetch Orders
        </button>
      </form>

      {submitted && isLoading && <p>Loading orders...</p>}
      {submitted && isError && <p className="text-red-500">Error: {error.message}</p>}
      {submitted && orders && orders.length === 0 && <p>No orders found.</p>}

      {submitted && orders && orders.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-4">
            Orders for {name} on {date}
          </h3>
          {orders.map((order) => (
            <div
              key={order._id}
              className="border border-amber-400 rounded-md p-4 mb-4 bg-[#262A1F]"
            >
              <p><strong>Order ID:</strong> {order._id}</p>
              <p><strong>Time:</strong> {order.orderTime}</p>
              <p><strong>Status:</strong> {order.completedAt ? "Completed" : "Incomplete"}</p>

              <h4 className="mt-2 font-semibold">Dishes:</h4>
              <ul className="list-disc list-inside ml-2">
                {order.dishes.map((dishItem, idx) => (
                  <li key={idx}>
                    {dishItem.dish?.name || "Unknown"} x {dishItem.quantity || 1} = ${dishItem.dish?.price * (dishItem.quantity || 1)}
                  </li>
                ))}
              </ul>

              {/* Table info */}
              {order.table && (
                <div className="mt-2">
                  <h4 className="font-semibold">Table:</h4>
                  <p>Price per hour: ${order.table.pricePerHour}</p>
                  <p>Duration: {order.table.duration} hour(s)</p>
                  <p>Total: ${order.table.total}</p>
                </div>
              )}

              {/* Grand total */}
              <p className="mt-2 font-bold">
                Grand Total: ${order.bill.grandTotal}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GetByDate;
