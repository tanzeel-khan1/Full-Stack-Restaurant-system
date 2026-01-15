import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast, Toaster } from "sonner";
import { useCreateOrder } from "../hooks/useOrders";
import API from "../utils/api";

const Orders = () => {
  const { tableId } = useParams(); // Get tableId from URL
  const navigate = useNavigate();
  const createOrder = useCreateOrder();

  const [dishes, setDishes] = useState([]);
  const [selectedDishes, setSelectedDishes] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  /* ===============================
     🔐 ACCESS CONTROL
  =============================== */
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      toast.error("Please login first");
      navigate("/login", { replace: true });
      return;
    }

    if (!tableId) {
      toast.error("No table selected!");
      navigate("/", { replace: true });
      return;
    }
  }, [navigate, tableId]);

  const user = JSON.parse(localStorage.getItem("user"));

  /* ===============================
     🍽️ FETCH DISHES
  =============================== */
  useEffect(() => {
    API.get("/dishes")
      .then((res) => setDishes(res.data || []))
      .catch(() => setDishes([]));
  }, []);

  /* ===============================
     ➕ ADD / MANAGE DISHES
  =============================== */
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

  const increaseQty = (id) => {
    setSelectedDishes(
      selectedDishes.map((d) =>
        d.dish._id === id ? { ...d, quantity: d.quantity + 1 } : d
      )
    );
  };

  const decreaseQty = (id) => {
    setSelectedDishes(
      selectedDishes
        .map((d) =>
          d.dish._id === id ? { ...d, quantity: d.quantity - 1 } : d
        )
        .filter((d) => d.quantity > 0)
    );
  };

  const removeItem = (id) => {
    setSelectedDishes(selectedDishes.filter((d) => d.dish._id !== id));
  };

  /* ===============================
     💰 TOTAL PRICE
  =============================== */
  const totalPrice = selectedDishes.reduce(
    (sum, d) => sum + d.dish.price * d.quantity,
    0
  );

  /* ===============================
     🧾 CREATE ORDER
  =============================== */
  const handleCreateOrder = () => {
    if (!selectedDishes.length) {
      toast.error("Please select at least one dish");
      return;
    }

    // createOrder.mutate(
    //   {
    //     userId: user._id,
    //     tableId, // Attach tableId
    //     dishes: selectedDishes.map((d) => ({
    //       dish: d.dish._id,
    //       quantity: d.quantity,
    //     })),
    //     totalPrice,
    //   },
    //   {
    //     onSuccess: (res) => {
    //       toast.success("Order placed successfully ✅");
    //       setSelectedDishes([]);
    //       localStorage.removeItem("paymentDone");

    //       // Optional: Navigate to order confirmation page
    //       navigate(`/order/${tableId}/confirmation`);
    //     },
    //     onError: (error) => {
    //       const message =
    //         error?.response?.data?.message || "Failed to create order ❌";
    //       toast.error(message);
    //     },
    //   }
    // );
  createOrder.mutate(
  {
    tableId,
    dishes: selectedDishes.map((d) => ({
      dish: d.dish._id,
      quantity: d.quantity,
    })),
    totalPrice,
  },
  {
    onSuccess: () => {
      toast.success("Order placed successfully ");
      setSelectedDishes([]);
      navigate(`/orders/${tableId}/confirmation`);
    },
    onError: (error) => {
      const message =
        error?.response?.data?.message || "Failed to create order ❌";
      toast.error(message);
    },
  }
);

  };

  /* ===============================
     🖥️ UI
  =============================== */
  return (
    <div className="p-6 min-h-screen bg-[#181C14] text-[#D4AF37]">
      <Toaster position="top-right" richColors />
      <h1 className="text-3xl font-bold text-center mb-6">
        Create Your Order 🍽️
      </h1>

      <div className="bg-[#1E1E1E] p-6 rounded-xl border border-[#D4AF37]/30">
        <h2 className="text-xl font-bold mb-4">Select Dishes</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {dishes.map((d) => (
            <button
              key={d._id}
              onClick={() => addDish(d)}
              className="border border-[#D4AF37]/40 p-3 rounded-lg hover:bg-[#D4AF37]/10 cursor-pointer"
            >
              <p>{d.name}</p>
              <p className="text-sm text-gray-400">${d.price}</p>
            </button>
          ))}
        </div>

        {/* SELECTED ITEMS */}
        <AnimatePresence>
          {selectedDishes.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-6 border-t border-[#D4AF37]/30 pt-4"
            >
              <h3 className="font-semibold mb-3">🧾 Selected Items</h3>

              {selectedDishes.map((item) => (
                <motion.div
                  key={item.dish._id}
                  layout
                  className="flex justify-between items-center bg-[#181C14] p-3 mb-2 rounded-lg"
                >
                  <div>
                    <p>{item.dish.name}</p>
                    <p className="text-sm text-gray-400">${item.dish.price}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => decreaseQty(item.dish._id)}
                      className="px-2 bg-red-500/20 rounded cursor-pointer"
                    >
                      −
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => increaseQty(item.dish._id)}
                      className="px-2 bg-green-500/20 rounded cursor-pointer"
                    >
                      +
                    </button>
                    <button
                      onClick={() => removeItem(item.dish._id)}
                      className="ml-2 text-red-400 cursor-pointer"
                    >
                      ❌
                    </button>
                  </div>
                </motion.div>
              ))}

              <div className="flex justify-between mt-4 font-bold text-lg">
                <span>Total</span>
                <span>${totalPrice}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={handleCreateOrder}
          disabled={createOrder.isLoading}
          className={`w-full mt-6 py-2 rounded-lg text-black cursor-pointer font-bold transition ${
            createOrder.isLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#D4AF37] hover:bg-amber-400"
          }`}
        >
          {createOrder.isLoading ? "Placing..." : "Place Order"}
        </button>
      </div>
    </div>
  );
};

export default Orders;
