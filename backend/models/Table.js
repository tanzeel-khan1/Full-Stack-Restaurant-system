const mongoose = require("mongoose");

const tableSchema = new mongoose.Schema({
  number: { 
    type: Number, 
    required: true 
  },

  capacity: { 
    type: Number, 
    required: true 
  },
  price: {
    type: Number,
    required: false, // per reservation / per table
  },

  status: { 
    type: String, 
    enum: ["available", "reserved", "occupied", "pending"], 
    default: "pending" // user create kare to pending
  },

  reservationDateTime: { 
    type: Date, 
    required: true
  },

  // 🔹 Only date part for "1 table per user per day" logic
  reservationDate: { 
    type: Date, 
    required: true 
  },

  reservationDuration: { 
    type: Number // in minutes
  },

  reservationEndTime: { 
    type: Date 
  },

  category: { 
    type: String, 
    enum: ["premium", "normal"], 
    default: "normal" 
  },

  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User",
    required: true
  }

}, {
  timestamps: true
});

// 🔹 Auto calculate reservationEndTime
// tableSchema.pre("save", function (next) {
//   if (this.reservationDateTime && this.reservationDuration) {
//     this.reservationEndTime = new Date(
//       this.reservationDateTime.getTime() + this.reservationDuration * 60000
//     );
//   }

//   // 🔹 Set reservationDate (00:00:00) for same-day checks
//   if (this.reservationDateTime) {
//     const dateOnly = new Date(this.reservationDateTime);
//     dateOnly.setHours(0, 0, 0, 0);
//     this.reservationDate = dateOnly;
//   }

//   next();
// });
// 🔹 Pre-validate hook
tableSchema.pre("validate", function (next) {
  if (this.reservationDateTime) {
    const dateOnly = new Date(this.reservationDateTime);
    dateOnly.setHours(0, 0, 0, 0);
    this.reservationDate = dateOnly;
  }
  next();
});

// 🔹 Pre-save hook (reservationEndTime)
tableSchema.pre("save", function (next) {
  if (this.reservationDateTime && this.reservationDuration) {
    this.reservationEndTime = new Date(
      this.reservationDateTime.getTime() + this.reservationDuration * 60000
    );
  }
  next();
});

// 🔹 Indexes
tableSchema.index({ number: 1, status: 1 }); // fast table status query
tableSchema.index({ userId: 1 });           // fast user query
tableSchema.index({ reservationEndTime: 1 }); // fast expiry query

// 🔹 Optional: prevent same table number on same day
tableSchema.index(
  { number: 1, reservationDate: 1 },
  { unique: true }
);

module.exports = mongoose.model("Table", tableSchema);
