const mongoose = require("mongoose");

//1-create schema
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: [true, "Category must be unique"],
      minlength: [3, "Too short category name"],
      maxlength: [32, "Too long category name"],
    },
    //A and B => shopping.com/a-and-b
    slug: {
      type: String,
      lowercase: true,
    },

    image: String,
  },
  { timestamps: true }
);

const setImageURL = (doc) => {
  // return Image base url + image name
  if (doc.image) {
    const imageUrl = `${process.env.BASE_URL}/categories/${doc.image}`;
    doc.image = imageUrl;
  }
};
// post middleware for  getOne ,getAll and Update
categorySchema.post("init", (doc) => {
  setImageURL(doc);
});

// post middleware for create
categorySchema.post("save", (doc) => {
  setImageURL(doc);
});

//2-create model
const CategoryModel = mongoose.model("Category", categorySchema);

module.exports = CategoryModel;
