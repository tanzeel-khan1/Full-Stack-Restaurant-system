import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTableMutations } from "../hooks/useTables";
import { useQueryClient } from "@tanstack/react-query";
import Navbar from "../components/Navbar";
import { toast, Toaster } from "sonner"; // ✅ import Sonner

/* ================= VARIANTS ================= */

const pageFade = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } },
};

const cardVariant = {
  hidden: { opacity: 0, scale: 0.85, y: 40 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

const inputVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

/* ================= COMPONENT ================= */

const Tables = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { createTable } = useTableMutations();

  const [number, setNumber] = useState("");
  const [capacity, setCapacity] = useState("");
  const [reservationDateTime, setReservationDateTime] = useState("");
  const [reservationDuration, setReservationDuration] = useState("");
  const [category, setCategory] = useState("normal");

  // const PRICE_PER_SEAT_PER_HOUR = 100;
  // const PREMIUM_MULTIPLIER = 1.7;

  // const totalAmount =
  //   capacity && reservationDuration
  //     ? Number(capacity) *
  //       PRICE_PER_SEAT_PER_HOUR *
  //       (Number(reservationDuration) / 60) *
  //       (category === "premium" ? PREMIUM_MULTIPLIER : 1)
  //     : 0;
  const PRICE_PER_SEAT_PER_HOUR = 100;
  const PREMIUM_MULTIPLIER = 1.7;

  const price =
    capacity && reservationDuration
      ? Number(capacity) *
        PRICE_PER_SEAT_PER_HOUR *
        (Number(reservationDuration) / 60) *
        (category === "premium" ? PREMIUM_MULTIPLIER : 1)
      : 0;

  // const handlePayAndBook = () => {
  //   if (!number || !capacity || !reservationDateTime || !reservationDuration) {
  //     return toast.error("Fill all fields"); // ✅ Sonner error toast
  //   }

  //   createTable.mutate(
  //     {
  //       number,
  //       capacity,
  //       reservationDateTime,
  //       reservationDuration,
  //       paymentStatus: "paid",
  //       totalAmount,
  //       category,
  //       status: "available",
  //     },
  //     {
  //       onSuccess: (response) => {
  //         const tableId = response?.data?.table?._id || response?.table?._id;
  //         if (!tableId) {
  //           return toast.error("Table ID not received from server");
  //         }

  //         queryClient.invalidateQueries(["tables"]);

  //         setNumber("");
  //         setCapacity("");
  //         setReservationDateTime("");
  //         setReservationDuration("");
  //         setCategory("normal");

  //         toast.success("Table successfully booked!"); // ✅ Sonner success toast
  //         navigate(`/orders/${tableId}`);
  //       },
  //       onError: (err) => {
  //         const serverMessage =
  //           err?.response?.data?.message || err.message || "Failed to create table";
  //         toast.error(serverMessage); // ✅ Sonner error toast
  //       },
  //     }
  //   );
  // };
  const handlePayAndBook = () => {
    if (!number || !capacity || !reservationDateTime || !reservationDuration) {
      return toast.error("Fill all fields");
    }

    createTable.mutate(
      {
        number: Number(number),
        capacity: Number(capacity),
        reservationDateTime,
        reservationDuration: Number(reservationDuration),
        category,
        price: Number(price.toFixed(2)), // ✅ correct
        status: "reserved", // ✅ correct status
      },
      {
        onSuccess: (response) => {
          const tableId = response?.data?.table?._id || response?.table?._id;
          if (!tableId) {
            return toast.error("Table ID not received from server");
          }

          queryClient.invalidateQueries(["tables"]);

          setNumber("");
          setCapacity("");
          setReservationDateTime("");
          setReservationDuration("");
          setCategory("normal");

          toast.success("Table successfully booked!");
          navigate(`/orders/${tableId}`);
        },
        onError: (err) => {
          const serverMessage =
            err?.response?.data?.message ||
            err.message ||
            "Failed to create table";

          toast.error(serverMessage);
        },
      },
    );
  };

  return (
    <>
      <Navbar />

      <motion.div
        variants={pageFade}
        initial="hidden"
        animate="visible"
        className="min-h-screen bg-[#181C14] p-8 flex justify-center items-center"
      >
        <motion.div
          variants={cardVariant}
          initial="hidden"
          animate="visible"
          className="bg-black/30 shadow-amber-400 backdrop-blur-md rounded-xl p-6 flex flex-col gap-4 w-full max-w-md"
        >
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-bold text-[#D4AF37] text-center mb-2"
          >
            🍽️ Create Table
          </motion.h1>

          <motion.input
            variants={inputVariant}
            initial="hidden"
            animate="visible"
            type="number"
            placeholder="Table No"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            className="border border-[#D4AF37] bg-transparent text-[#D4AF37] p-2 rounded focus:outline-none"
          />

          <motion.input
            variants={inputVariant}
            initial="hidden"
            animate="visible"
            type="number"
            placeholder="Capacity"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            className="border border-[#D4AF37] bg-transparent text-[#D4AF37] p-2 rounded focus:outline-none"
          />

          <motion.input
            variants={inputVariant}
            initial="hidden"
            animate="visible"
            type="datetime-local"
            value={reservationDateTime}
            onChange={(e) => setReservationDateTime(e.target.value)}
            className="border border-[#D4AF37] bg-transparent text-[#D4AF37] p-2 rounded focus:outline-none"
          />

          <motion.input
            variants={inputVariant}
            initial="hidden"
            animate="visible"
            type="number"
            placeholder="Duration (minutes)"
            value={reservationDuration}
            onChange={(e) => setReservationDuration(e.target.value)}
            className="border border-[#D4AF37] bg-transparent text-[#D4AF37] p-2 rounded focus:outline-none"
          />

          <motion.select
            variants={inputVariant}
            initial="hidden"
            animate="visible"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border border-[#D4AF37] bg-transparent text-[#D4AF37] p-2 rounded"
          >
            <option value="normal">Normal</option>
            <option value="premium">Premium</option>
          </motion.select>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="p-2 font-semibold text-[#D4AF37]"
          >
            Total: {price.toFixed(2)} USD
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={createTable.isLoading}
            onClick={handlePayAndBook}
            className="bg-[#D4AF37] cursor-pointer text-black px-5 py-2 rounded-lg shadow-md hover:bg-yellow-500 transition"
          >
            {createTable.isLoading ? "Processing..." : "Pay & Book"}
          </motion.button>
        </motion.div>
      </motion.div>
    </>
  );
};

export default Tables;
