const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },

    ratings: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "min rating value is 1.0"],
      max: [5, "max rating value is 5.0"],
    },

    product: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: [true, "Review must belong to a product"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Review must belong to a user"],
    },
  },
  { timestamps: true }
);

// Populate user
reviewSchema.pre(/^find/, function (next) {
  this.populate({ path: "user", select: "name" });
  next();
});

module.exports = mongoose.model("Review", reviewSchema);
