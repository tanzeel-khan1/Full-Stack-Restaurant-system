import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { useOrdersByUser, useCreateOrder } from "../hooks/useOrders";
import API from "../utils/api";

const Orders = () => {
  const [dishes, setDishes] = useState([]);
  const [selectedDishes, setSelectedDishes] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const { data: orders = [], isLoading: ordersLoading } = useOrdersByUser(
    user?._id
  );

  const createOrder = useCreateOrder();

  useEffect(() => {
    const fetchDishes = async () => {
      try {
        const res = await API.get("/dishes");
        setDishes(res.data || []);
      } catch (err) {
        console.error("Dishes fetch error:", err.response?.data || err.message);
        setDishes([]);
      }
    };
    fetchDishes();
  }, []);

  const addDish = (dish) => {
    const exists = selectedDishes.find((d) => d.dish._id === dish._id);
    if (exists) {
      setSelectedDishes(
        selectedDishes.map((d) =>
          d.dish._id === dish._id ? { ...d, quantity: d.quantity + 1 } : d
        )
      );
    } else {
      setSelectedDishes([...selectedDishes, { dish, quantity: 1 }]);
    }
  };

  const handleCreateOrder = async () => {
    if (selectedDishes.length === 0) {
      return setErrorMessage("Please select at least one dish");
    }
    if (!user?._id) return setErrorMessage("User not logged in");

    const totalPrice = selectedDishes.reduce(
      (sum, d) => sum + d.dish.price * d.quantity,
      0
    );

    const payload = {
      userId: user._id,
      dishes: selectedDishes.map((d) => ({
        dish: d.dish._id,
        quantity: d.quantity,
      })),
      totalPrice,
    };

    createOrder.mutate(payload, {
      onSuccess: () => {
        setSelectedDishes([]);
        setErrorMessage("");
        toast.success("Order placed successfully");
        setTimeout(() => navigate("/"), 1500);
      },
      onError: (err) => {
        console.error("Order create error:", err.response?.data || err.message);
        setErrorMessage(
          err.response?.data?.message || "Failed to create order"
        );
      },
    });
  };

  return (
    <div className="p-6 min-h-screen bg-[#181C14] text-[#D4AF37]">
      <Toaster position="top-right" />

      <motion.h1
        className="text-3xl font-bold mb-6 text-center"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        🍽️ Orders
      </motion.h1>

      {errorMessage && (
        <motion.div
          className="mb-4 p-3 bg-red-500/20 text-red-400 rounded"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {errorMessage}
        </motion.div>
      )}

      <h4 className="text-center mb-5">
        If you can wait for 2 days, then add a new dish
      </h4>

      <Link
        to="/dishes"
        className="bg-[#D4AF37] mb-5 hover:bg-[#B8941F] text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
      >
        <span>+</span> Add New Dish
      </Link>

      <motion.div
        className="mb-8 border border-[#D4AF37]/30 p-6 rounded-xl shadow bg-[#1E1E1E]"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-xl font-bold mb-4">Create New Order</h2>

        {dishes.length === 0 ? (
          <p className="text-gray-400">No dishes available right now.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-4">
            {dishes.map((d) => (
              <motion.button
                key={d._id}
                onClick={() => addDish(d)}
                whileTap={{ scale: 0.9 }}
                className="border border-[#D4AF37]/40 rounded-lg p-3 hover:bg-[#D4AF37]/10 transition cursor-pointer"
              >
                <p className="font-medium">{d.name}</p>
                <p className="text-sm text-gray-400">${d.price}</p>
              </motion.button>
            ))}
          </div>
        )}

        {selectedDishes.length > 0 && (
          <div className="mb-4">
            <h3 className="font-semibold mb-2">🛒 Selected Dishes</h3>
            <ul className="list-disc pl-5 space-y-1">
              {selectedDishes.map((d) => (
                <li key={`${d.dish._id}-${d.quantity}`}>
                  {d.dish.name} × {d.quantity}
                </li>
              ))}
            </ul>
            <p className="font-bold mt-2">
              Total: $
              {selectedDishes.reduce(
                (sum, d) => sum + d.dish.price * d.quantity,
                0
              )}
            </p>
          </div>
        )}

        <motion.button
          onClick={handleCreateOrder}
          whileTap={{ scale: 0.9 }}
          className="bg-[#D4AF37] cursor-pointer text-black py-2 px-4 rounded-lg w-full hover:bg-[#b9962d] transition disabled:opacity-50"
          disabled={selectedDishes.length === 0 || createOrder.isLoading}
        >
          {createOrder.isLoading ? "Placing..." : "Place Order"}
        </motion.button>
      </motion.div>

      <motion.h2
        className="text-2xl font-bold mb-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        My Orders
      </motion.h2>

      {ordersLoading ? (
        <p className="text-gray-400 mb-6">Loading orders...</p>
      ) : orders.length === 0 ? (
        <p className="text-gray-400 mb-6">
          You haven’t placed any orders yet. Select dishes above to create your
          first order 🍽️
        </p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((o, idx) => (
            <motion.div
              key={o._id}
              className="border border-[#D4AF37]/30 p-5 rounded-xl shadow  bg-white/15 hover:shadow-lg transition"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <ul className="mb-3 list-disc pl-5 text-gray-300">
                {o.dishes.map((d, idx2) => (
                  <li key={`${d.dish?._id || idx2}`}>
                    {d.dish?.name} × {d.quantity}
                  </li>
                ))}
              </ul>
              <p className="font-bold text-[#D4AF37]">Total: ${o.totalPrice}</p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
