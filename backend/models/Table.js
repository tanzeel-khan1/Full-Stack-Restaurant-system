const mongoose = require("mongoose");

const tableSchema = new mongoose.Schema({
  number: { type: Number, required: true },
  capacity: { type: Number, required: true },
  status: { type: String, enum: ["available", "reserved", "occupied"], default: "available" },
  reservationDateTime: { type: Date },
  reservationDuration: { type: Number }, 
  reservationEndTime: { type: Date },
  paymentStatus: { type: String, enum: ["paid"], default: "paid" },
  totalAmount: { type: Number, default: 0 },
  category: { type: String, enum: ["premium", "normal"], default: "normal" },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
});

tableSchema.pre("save", function (next) {
  if (this.reservationDateTime && this.reservationDuration) {
    this.reservationEndTime = new Date(
      this.reservationDateTime.getTime() + this.reservationDuration * 60000 
    );
  }
  next();
});

module.exports = mongoose.model("Table", tableSchema);
