import RestaurantReview from "../models/Review.js";
import Order from "../models/Order.js";

export const addRestaurantReview = async (req, res) => {
  try {
    const { orderId, rating, comment } = req.body;

    // 1️⃣ fetch order
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    // 2️⃣ check user
    if (!order.userId) {
      return res
        .status(400)
        .json({ message: "Order has no user assigned" });
    }

    if (order.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    // 3️⃣ check status
    if (order.status !== "completed") {
      return res.status(400).json({ message: "Order not completed yet" });
    }

    // 4️⃣ create review
    const review = await RestaurantReview.create({
      user: req.user._id,
      restaurant: order.tableId, // ya restaurantId agar available ho
      order: orderId,
      rating,
      comment,
    });

    res.status(201).json(review);
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({ message: error.message });
  }
};
