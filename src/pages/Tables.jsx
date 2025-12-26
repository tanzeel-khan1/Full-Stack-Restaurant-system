import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTableMutations } from "../hooks/useTables";
import { useQueryClient } from "@tanstack/react-query";
import Navbar from "../components/Navbar";

const Tables = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { createTable } = useTableMutations();

  const [number, setNumber] = useState("");
  const [capacity, setCapacity] = useState("");
  const [reservationDateTime, setReservationDateTime] = useState("");
  const [reservationDuration, setReservationDuration] = useState("");
  const [category, setCategory] = useState("normal");
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
  // Backend response check
  console.log("NEW TABLE:", newTable);

  // Update cache
  queryClient.setQueryData(["tables"], (old) => [...(old || []), newTable]);
  queryClient.invalidateQueries(["tables"]);

  // Reset form
  setNumber("");
  setCapacity("");
  setReservationDateTime("");
  setReservationDuration("");
  setCategory("normal");

  // Navigate to payment page using correct id
  navigate(`/payment/${newTable.table._id}`); // <--- yahan fix
},

        onError: (err) => {
          setError(err.message || "Failed to create table");
        },
      }
    );
  };

  return (
    <>
    <Navbar/>
    <div className="min-h-screen bg-[#181C14] p-8 flex justify-center items-center">
      <div className="bg-black/30 shadow-amber-400 backdrop-blur-md rounded-xl p-6 flex flex-col gap-4 w-full max-w-md">
        <h1 className="text-2xl font-bold text-[#D4AF37] text-shadow-amber-600 text-center mb-4">
          🍽️ Create Table
        </h1>

        {error && <p className="text-red-400 text-center">{error}</p>}

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
    </div>
    </>
  );
};

export default Tables;
