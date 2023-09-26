const mongoose = require("mongoose");

//1-create schema
const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "brand name is required"],
      unique: [true, "brand must be unique"],
      minlength: [3, "Too short brand name"],
      maxlength: [32, "Too long brand name"],
    },
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
    const imageUrl = `${process.env.BASE_URL}/brands/${doc.image}`;
    doc.image = imageUrl;
  }
};
// post middleware for  getOne ,getAll and Update
brandSchema.post("init", (doc) => {
  setImageURL(doc);
});

// post middleware for create
brandSchema.post("save", (doc) => {
  setImageURL(doc);
});

//2-create model
module.exports = mongoose.model("Brand", brandSchema);
