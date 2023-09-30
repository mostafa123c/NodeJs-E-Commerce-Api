const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Coupon Name is required"],
      unique: [true, "Coupon Name must be unique"],
      trim: true,
      minlength: [3, "too short coupon"],
      maxlength: [32, "too long coupon"],
    },
    expire: {
      type: Date,
      required: [true, "Coupon Expire Time required"],
    },
    discount: {
      type: Number,
      required: [true, "discount required"],
      min: [1, "too small discount"],
      max: [99, "too large discount"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Coupon", couponSchema);
