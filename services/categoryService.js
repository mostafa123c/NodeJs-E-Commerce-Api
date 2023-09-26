const multer = require("multer");
// eslint-disable-next-line import/no-extraneous-dependencies
const { v4: uuidv4 } = require("uuid");
const Category = require("../models/categoryModel");
const factory = require("./HandlersFactory");

// DiskStorage engine
const multerStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/categories");
  },
  filename: function (req, file, cb) {
    // category-$(id)-Date.now().jpeg
    const ext = file.mimetype.split("/")[1];
    const filename = `category-${uuidv4()}-${Date.now()}.${ext}`;
    cb(null, filename);
  },
});

const upload = multer({ storage: multerStorage });

exports.uploadCategoryImage = upload.single("image");

// @desc   Get All Categories
// @route  GET /api/v1/categories
// @access Public
exports.getCategories = factory.getAll(Category);

// @desc   Get Specific Category By id
// @route  GET /api/v1/categories/:id
// @access Public
exports.getCategory = factory.getOne(Category);

// @desc   Create Category
// @route  POST /api/v1/categories
// @access Private
exports.createCategory = factory.createOne(Category);

// @desc   Update Category
// @route  PUT /api/v1/categories/:id
// @access Private
exports.updateCategory = factory.updateOne(Category);

// @desc   Delete Category
// @route  DELETE /api/v1/categories/:id
// @access Private
exports.deleteCategory = factory.deleteOne(Category);
