const mongoose = require("mongoose");

const orderSchrma = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Order Must Be belong To User"],
    },

    cartItems: [
      {
        product: {
          type: mongoose.Schema.ObjectId,
          ref: "Product",
        },
        quantity: Number,
        price: Number,
        color: String,
      },
    ],

    taxPrice: {
      type: Number,
      default: 0,
    },

    shippingAddress: {
      details: String,
      phone: String,
      city: String,
      postalCode: Number,
    },

    shippingPrice: {
      type: Number,
      default: 0,
    },

    totalOrderPrice: Number,

    paymentMethodType: {
      type: String,
      enum: ["card", "cash"],
      default: "cash",
    },

    isPaid: {
      type: Boolean,
      default: false,
    },

    paidAt: Date,

    isDelivered: {
      type: Boolean,
      default: false,
    },

    deliveredAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchrma);
