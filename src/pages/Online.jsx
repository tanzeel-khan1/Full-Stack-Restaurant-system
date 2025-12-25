import React from "react";
import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

function Online() {
  const navigate = useNavigate();

  const handleBooking = () => {
    navigate("/tables");
  };
  return (
    <section className="bg-[#181C14] py-16 px-6 flex items-center justify-center">
      <motion.div
        className="max-w-3xl w-full text-center"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: false }}
      >
        <h1 className="text-4xl font-extrabold text-[#D4AF37] mb-4 tracking-wide">
          Book Your Table
        </h1>

        <p className="text-gray-200 text-lg mb-8">
          Select the date and time for your reservation
        </p>

        <div className="flex justify-center">
          <motion.button
            className="flex items-center justify-center cursor-pointer gap-2 w-full bg-[#D4AF37] text-[#36454f] font-semibold text-lg px-8 py-3 rounded-md shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:bg-[#c19b2e]"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleBooking}
          >
            Book Now <FaArrowRight />
          </motion.button>
        </div>
      </motion.div>
    </section>
  );
}

export default Online;
