import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import API from "../utils/api";
import Online from "./Online";
import { RotatingLines } from "react-loader-spinner";

const DishList = () => {
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#181C14] py-8">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header Section */}
          <motion.div
            className="flex justify-between items-center mb-8"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div>
              <h1 className="text-4xl font-bold text-[#D4AF37] mb-2">
                🍽️ Our Menu
              </h1>
              <p className="text-gray-300">Manage your delicious dishes</p>
            </div>
            {/* <Link
              to="/dishes"
              className="bg-[#D4AF37] hover:bg-[#B8941F] text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              <span>+</span> Add New Dish
            </Link> */}
          </motion.div>

          {isLoading && (
            <div className="flex justify-center items-center h-screen">
            <RotatingLines strokeColor="gold" width="50" />
          </div>
          )}

          {isError && (
            <p className="text-center text-red-400">
              Failed to load dishes: {error.message}
            </p>
          )}

          {!isLoading && !isError && dishes.length > 0 && (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {dishes.map((dish) => (
                <motion.div
                  key={dish._id}
                  variants={cardVariants}
                  whileHover={{
                    scale: 1.05,
                  }}
                  className="relative bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl overflow-hidden group"
                >
                  <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[120%] group-hover:translate-x-[120%] transition-transform duration-700 ease-in-out"></div>
                  </div>

                  <div className="w-full h-48 mb-4 rounded-xl overflow-hidden bg-gray-700/50">
                    {dish.image ? (
                      <motion.img
                        src={dish.image}
                        alt={dish.name}
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.08 }}
                        transition={{ duration: 0.3 }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-4xl mb-2">🍽️</div>
                          <span className="text-gray-400 text-sm">
                            No Image
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3 relative z-10">
                    <h3 className="text-xl font-bold text-white truncate">
                      {dish.name}
                    </h3>

                    <div className="flex items-center justify-between">
                      <span className="bg-[#D4AF37]/20 text-[#D4AF37] px-3 py-1 rounded-full text-sm font-medium">
                        {dish.category}
                      </span>
                      <span className="text-2xl font-bold text-green-400">
                        ${dish.price}
                      </span>
                    </div>

                    <div className="flex justify-center">
                      {dish.available ? (
                        <span className="bg-green-500/20 text-green-300 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                          Available
                        </span>
                      ) : (
                        <span className="bg-red-500/20 text-red-300 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                          <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                          Out of Stock
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {!isLoading && !isError && dishes.length === 0 && (
            <motion.div
              className="text-center py-20"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <div className="text-8xl mb-6">🍽️</div>
              <h2 className="text-3xl font-bold text-[#D4AF37] mb-4">
                No Dishes Yet
              </h2>
              <p className="text-gray-300 text-lg mb-8">
                Start building your menu by adding your first dish
              </p>
              <Link
                to="/dishes"
                className="bg-[#D4AF37] hover:bg-[#B8941F] text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl inline-flex items-center gap-2"
              >
                <span>+</span> Add Your First Dish
              </Link>
            </motion.div>
          )}
        </div>
      </div>
      <Online />
    </>
  );
};

export default DishList;
