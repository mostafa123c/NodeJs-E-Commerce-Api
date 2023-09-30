const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: [3, "Too short product title"],
      maxlength: [100, "Too long product title"],
    },

    slug: {
      type: String,
      required: true,
      lowercase: true,
    },

    description: {
      type: String,
      required: [true, "product description is required"],
      trim: true,
      minlength: [20, "Too short product description"],
    },

    quantity: {
      type: Number,
      required: [true, "product quantity is required"],
    },

    sold: {
      type: Number,
      default: 0,
    },

    price: {
      type: Number,
      required: [true, "product price is required"],
      trim: true,
      max: [200000, "Too long product price"],
    },

    priceAfterDiscount: {
      type: Number,
    },

    colors: [String],

    imageCover: {
      type: String,
      required: [true, "product image cover is required"],
    },

    images: [String],

    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "product must be belong to category"],
    },

    subcategories: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "SubCategory",
      },
    ],

    brand: {
      type: mongoose.Schema.ObjectId,
      ref: "Brand",
    },

    ratingsAverage: {
      type: Number,
      min: [1, "Rating must be above or equal 1"],
      max: [5, "Rating must be below or equal 5"],
    },

    ratingsQuantity: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    //to enable virtual populate
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Mongoose query middleware
productSchema.pre(/^find/, function (next) {
  this.populate({
    path: "category",
    select: "name -_id",
  });
  next();
});

// virtual populate
productSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "product",
  localField: "_id",
});

const setImageURL = (doc) => {
  // return Image base url + image name
  if (doc.imageCover) {
    const imageUrl = `${process.env.BASE_URL}/products/${doc.imageCover}`;
    doc.imageCover = imageUrl;
  }
  if (doc.images) {
    const imageList = [];
    doc.images.forEach((image) => {
      const imageUrl = `${process.env.BASE_URL}/products/${image}`;
      imageList.push(imageUrl);
    });
    doc.images = imageList;
  }
};
// post middleware for  getOne ,getAll and Update
productSchema.post("init", (doc) => {
  setImageURL(doc);
});

// post middleware for create
productSchema.post("save", (doc) => {
  setImageURL(doc);
});

module.exports = mongoose.model("Product", productSchema);
