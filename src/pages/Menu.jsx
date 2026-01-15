import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import API from "../utils/api";
import { RotatingLines } from "react-loader-spinner";

const Menu = () => {
  const [showAll, setShowAll] = useState(false);

  const {
    data: dishes = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["dishes"],
    queryFn: async () => {
      const { data } = await API.get("/dishes");
      return data;
    },
  });

  const visibleDishes = showAll ? dishes : dishes.slice(0, 4);

  return (
    <div className="min-h-screen bg-[#181C14] py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ===== HEADER ===== */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-14"
        >
          <div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-[#D4AF37] tracking-tight">
              Our Menu
            </h1>
            <p className="text-gray-400 mt-3 max-w-lg">
              Carefully crafted dishes made with premium ingredients & passion
            </p>
          </div>

          {dishes.length > 4 && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="cursor-pointer px-7 py-3 rounded-xl  bg-[#D4AF37] hover:bg-[#B8941F]
                         text-white font-semibold shadow-lg transition"
            >
              {showAll ? "Show Less" : "View Full Menu"}
            </button>
          )}
        </motion.div>

        {/* ===== LOADER ===== */}
        {isLoading && (
          <div className="flex justify-center items-center h-[50vh]">
            <RotatingLines strokeColor="#D4AF37" width="52" />
          </div>
        )}

        {/* ===== ERROR ===== */}
        {isError && (
          <p className="text-center text-red-400">
            Failed to load dishes: {error.message}
          </p>
        )}

        {/* ===== DISHES GRID ===== */}
        {!isLoading && !isError && dishes.length > 0 && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.12 } },
            }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          >
            {visibleDishes.map((dish) => (
              <motion.div
                key={dish._id}
                variants={{
                  hidden: { opacity: 0, y: 40 },
                  visible: { opacity: 1, y: 0 },
                }}
                whileHover={{ y: -8 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="group bg-white/5 backdrop-blur-xl
                           border border-white/10
                           rounded-3xl overflow-hidden
                           shadow-lg hover:shadow-2xl"
              >
                {/* IMAGE */}
                <div className="relative aspect-[4/3] overflow-hidden bg-gray-800">
                  {dish.image ? (
                    <img
                      src={dish.image}
                      alt={dish.name}
                      className="w-full h-full object-cover
                                 transition duration-700
                                 group-hover:scale-110"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400 text-lg">
                      🍽️ No Image
                    </div>
                  )}

                  {/* PRICE FLOAT */}
                  <div
                    className="absolute top-4 right-4 bg-black/60 backdrop-blur-md
                                  text-green-400 font-bold px-4 py-1.5 rounded-full"
                  >
                    ${dish.price}
                  </div>
                </div>

                {/* CONTENT */}
                <div className="p-6 space-y-4">
                  <h3 className="text-xl font-bold text-white truncate">
                    {dish.name}
                  </h3>

                  <div className="flex justify-between items-center">
                    <span
                      className="text-xs bg-[#D4AF37]/20 text-[#D4AF37]
                                     px-4 py-1.5 rounded-full font-medium"
                    >
                      {dish.category}
                    </span>
                  </div>

                  <div className="flex justify-center pt-2">
                    {dish.available ? (
                      <span
                        className="text-xs bg-green-500/20 text-green-300
                                       px-4 py-2 rounded-full flex items-center gap-2"
                      >
                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                        Available
                      </span>
                    ) : (
                      <span
                        className="text-xs bg-red-500/20 text-red-300
                                       px-4 py-2 rounded-full flex items-center gap-2"
                      >
                        <span className="w-2 h-2 bg-red-400 rounded-full" />
                        Out of Stock
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* ===== EMPTY STATE ===== */}
        {!isLoading && !isError && dishes.length === 0 && (
          <div className="text-center py-28">
            <div className="text-8xl mb-6">🍽️</div>
            <h2 className="text-3xl font-bold text-[#D4AF37] mb-4">
              No Dishes Available
            </h2>
            <Link
              to="/dishes"
              className="inline-block mt-6 px-10 py-4
                         bg-[#D4AF37] text-white
                         rounded-2xl font-semibold
                         shadow-xl hover:scale-105 transition"
            >
              + Add Your First Dish
            </Link>
          </div>
        )}

        {/* ===== BOOK TABLE CTA ===== */}
        <div className="flex justify-center mt-20">
          <Link
            to="/tables"
            className="w-full sm:w-[420px] md:w-[520px]
                       px-10 py-4
                       bg-gradient-to-r from-[#D4AF37] to-[#B8941F]
                       text-white rounded-xl font-semibold
                       shadow-2xl hover:scale-105 transition
                       text-center"
          >
            Book Your Table
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Menu;
