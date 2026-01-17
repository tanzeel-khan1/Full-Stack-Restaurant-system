const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    // 👤 User who placed the order
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    // 🍽️ Linked table (VERY IMPORTANT)
    tableId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Table",
      default: null
    },

    // 🥗 Ordered dishes
    dishes: [
      {
        dish: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Dish",
          required: true
        },
        quantity: {
          type: Number,
          required: true,
          min: 1
        }
      }
    ],

    // 💰 Total bill
    totalPrice: {
      type: Number,
      required: true,
      min: 0
    },

    // 📦 Order status
    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
      index: true
    },

    // ✅ Completion time
    completedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true // createdAt & updatedAt
  }
);

/* 🔁 AUTO SET completedAt WHEN ORDER COMPLETES */
orderSchema.pre("save", function (next) {
  if (this.isModified("status") && this.status === "completed") {
    this.completedAt = new Date();
  }
  next();
});

module.exports = mongoose.model("Order", orderSchema);
