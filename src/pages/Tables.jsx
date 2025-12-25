import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { useTables, useTableMutations } from "../hooks/useTables";
import { useQueryClient } from "@tanstack/react-query";
import { FaShoppingCart } from "react-icons/fa";
import { FaLongArrowAltLeft } from "react-icons/fa";

const Tables = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const tablesQuery = useTables();
  const { createTable } = useTableMutations();

  const [number, setNumber] = useState("");
  const [capacity, setCapacity] = useState("");
  const [reservationDateTime, setReservationDateTime] = useState("");
  const [reservationDuration, setReservationDuration] = useState("");
  const [category, setCategory] = useState("normal");
  const [selectedTable, setSelectedTable] = useState(null);
  const [error, setError] = useState("");

  const PRICE_PER_SEAT_PER_HOUR = 100;
  const PREMIUM_MULTIPLIER = 1.7;

  const totalAmount =
    capacity && reservationDuration
      ? Number(capacity) *
        PRICE_PER_SEAT_PER_HOUR *
        (Number(reservationDuration) / 60) *
        (category === "premium" ? PREMIUM_MULTIPLIER : 1)
      : 0;

  const handlePayAndBook = () => {
    setError("");
    if (!number || !capacity || !reservationDateTime || !reservationDuration) {
      return setError("Fill all fields");
    }

    const exists = tablesQuery.data?.some((t) => t.number === Number(number));
    if (exists) {
      return setError(`Table ${number} already exists!`);
    }

    createTable.mutate(
      {
        number,
        capacity,
        reservationDateTime,
        reservationDuration,
        paymentStatus: "paid",
        totalAmount,
        category,
        status: "available",
      },
      {
        onSuccess: (newTable) => {
          queryClient.setQueryData(["tables"], (old) => [
            ...(old || []),
            newTable,
          ]);

          queryClient.invalidateQueries(["tables"]);

          setSelectedTable(newTable._id);
        },
      }
    );

    setNumber("");
    setCapacity("");
    setReservationDateTime("");
    setReservationDuration("");
    setCategory("normal");
  };

  const handleOrders = (tableId = selectedTable) => {
    if (!tableId) {
      setError("Please select a table before ordering!");
      return;
    }
    navigate("/orders", { state: { tableId } });
  };

  if (tablesQuery.isLoading)
    return <div className="text-center text-white">Loading Tables...</div>;
  if (tablesQuery.isError)
    return (
      <div className="text-center text-red-400">Failed to load tables</div>
    );

  return (
    <div className="min-h-screen bg-[#181C14] p-8">
      <Link
        to="/"
        className="flex items-center gap-2 w-fit bg-transparent border border-amber-400 
             rounded-md px-3 py-2 cursor-pointer text-amber-400 text-sm md:text-base 
             shadow-md transition-all duration-300 ease-in-out
             hover:-translate-y-0.5 hover:shadow-[0_0_20px_4px_rgba(251,191,36,0.8)]"
      >
        <FaLongArrowAltLeft />
        <span>Go Back</span>
      </Link>
      <h1 className="text-3xl font-extrabold text-center mt-6 md:mt-0 mb-4 md:mb-10 text-[#D4AF37] drop-shadow-lg">
        🍽️ Manage Tables
      </h1>
      {error && <p className="text-red-400 mb-4 text-center">{error}</p>}

      <div className="bg-black/30 shadow-amber-400 backdrop-blur-md rounded-xl p-6 shadow-lg flex flex-wrap gap-3 justify-center mb-10">
        <input
          type="number"
          placeholder="Table No"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          className="border border-[#D4AF37] bg-transparent text-[#D4AF37] p-2 rounded focus:outline-none"
        />
        <input
          type="number"
          placeholder="Capacity"
          value={capacity}
          onChange={(e) => setCapacity(e.target.value)}
          className="border border-[#D4AF37] bg-transparent text-[#D4AF37] p-2 rounded focus:outline-none"
        />
        <input
          type="datetime-local"
          value={reservationDateTime}
          onChange={(e) => setReservationDateTime(e.target.value)}
          className="border border-[#D4AF37] bg-transparent text-[#D4AF37] p-2 rounded focus:outline-none"
        />
        <input
          type="number"
          placeholder="Duration (minutes)"
          value={reservationDuration}
          onChange={(e) => setReservationDuration(e.target.value)}
          className="border border-[#D4AF37] bg-transparent text-[#D4AF37] p-2 rounded focus:outline-none"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border border-[#D4AF37] bg-transparent text-[#D4AF37] p-2 rounded"
        >
          <option value="normal">Normal</option>
          <option value="premium">Premium</option>
        </select>
        <div className="p-2 font-semibold text-[#D4AF37]">
          Total: {totalAmount.toFixed(2)} USD
        </div>
        <button
          onClick={handlePayAndBook}
          disabled={createTable.isLoading}
          className="bg-[#D4AF37] text-black px-5 py-2 rounded-lg shadow-md hover:bg-yellow-500 transition cursor-pointer"
        >
          {createTable.isLoading ? "Processing..." : "Pay & Book"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {tablesQuery.data?.map((t, index) => (
          <motion.div
            key={t._id}
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            onClick={() => t.status === "available" && setSelectedTable(t._id)}
            className={`cursor-pointer bg-black/40 p-6 rounded-xl shadow-lg border ${
              selectedTable === t._id ? "border-green-400" : "border-[#D4AF37]"
            } text-[#D4AF37] ${
              t.status !== "available" ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <h2 className="font-bold text-xl mb-2">Table {t.number}</h2>
            <p>👥 Capacity: {t.capacity}</p>
            <p>📌 Status: {t.status}</p>
            <p className="text-green-400 font-semibold">
              💳 Payment: {t.paymentStatus} ({t.totalAmount} USD)
            </p>
            <p>⭐ Category: {t.category}</p>
          </motion.div>
        ))}
      </div>

      {selectedTable && (
        <div className="flex justify-center ">
          <button
            onClick={() => handleOrders(selectedTable)}
            className="flex items-center gap-2  bg-[#D4AF37] cursor-pointer text-white px-6 py-3 rounded-lg font-bold shadow-lg hover:bg-transparent transition"
          >
            <FaShoppingCart className="text-lg" />
            <span>Order Now</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default Tables;
