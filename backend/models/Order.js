// const mongoose = require("mongoose");

// const orderSchema = new mongoose.Schema({
//   dishes: [
//     {
//       dish: { type: mongoose.Schema.Types.ObjectId, ref: "Dish", required: true },
//       quantity: { type: Number, required: true },
//     },
//   ],
//   totalPrice: { type: Number, required: true },
//   createdAt: { type: Date, default: Date.now },
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
// });

// module.exports = mongoose.model("Order", orderSchema);
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  dishes: [
    {
      dish: { type: mongoose.Schema.Types.ObjectId, ref: "Dish", required: true },
      quantity: { type: Number, required: true },
    },
  ],
  totalPrice: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  status: { type: String, enum: ["pending", "completed"], default: "pending" }, // ✅ status added
  completedAt: { type: Date }, // ✅ optional, jab order complete ho
});

module.exports = mongoose.model("Order", orderSchema);
