// const mongoose = require("mongoose");

// const tableSchema = new mongoose.Schema({
//   number: { type: Number, required: true },
//   capacity: { type: Number, required: true },
//   status: { type: String, enum: ["available", "reserved", "occupied"], default: "available" },
//   reservationDateTime: { type: Date },
//   reservationDuration: { type: Number }, 
//   reservationEndTime: { type: Date },
//   paymentStatus: { type: String, enum: ["paid"], default: "paid" },
//   totalAmount: { type: Number, default: 0 },
//   category: { type: String, enum: ["premium", "normal"], default: "normal" },
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
// });

// tableSchema.pre("save", function (next) {
//   if (this.reservationDateTime && this.reservationDuration) {
//     this.reservationEndTime = new Date(
//       this.reservationDateTime.getTime() + this.reservationDuration * 60000 
//     );
//   }
//   next();
// });

// module.exports = mongoose.model("Table", tableSchema);
const mongoose = require("mongoose");

const tableSchema = new mongoose.Schema({
  number: { type: Number, required: true },
  capacity: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ["available", "reserved", "occupied", "pending"], 
    default: "available" 
  },
  reservationDateTime: { type: Date },
  reservationDuration: { type: Number }, 
  reservationEndTime: { type: Date },
  paymentStatus: { 
    type: String, 
    enum: ["pending", "paid", "failed", "refunded"], 
    default: "pending" 
  },
  totalAmount: { type: Number, default: 0 },
  category: { 
    type: String, 
    enum: ["premium", "normal"], 
    default: "normal" 
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User" 
  },
  // Payment details
  paymentMethod: { 
    type: String, 
    enum: ["card", "jazzcash", "easypaisa", "bank_transfer", "cash"],
    default: null
  },
  transactionId: { 
    type: String,
    default: null
  },
  paidAt: { 
    type: Date,
    default: null
  }
}, {
  timestamps: true // createdAt aur updatedAt automatic add ho jayenge
});

// Pre-save hook: reservationEndTime calculate karna
tableSchema.pre("save", function (next) {
  if (this.reservationDateTime && this.reservationDuration) {
    this.reservationEndTime = new Date(
      this.reservationDateTime.getTime() + this.reservationDuration * 60000 
    );
  }
  next();
});

// Index for better query performance
tableSchema.index({ number: 1, status: 1 });
tableSchema.index({ userId: 1 });
tableSchema.index({ reservationEndTime: 1 });

module.exports = mongoose.model("Table", tableSchema);