const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const ApiError = require("../utils/apiError");
const Category = require("../models/categoryModel");
const ApiFeatures = require("../utils/apiFeatures");
const factory = require("./HandlersFactory");

// @desc   Get All Categories
// @route  GET /api/v1/categories
// @access Public
exports.getCategories = asyncHandler(async (req, res) => {
  // Build query
  const documentsCounts = await Category.countDocuments();
  const apiFeatures = new ApiFeatures(Category.find(), req.query)
    .paginate(documentsCounts)
    .filter()
    .search()
    .limitFields()
    .sort();

  // Excute query
  const { mongooseQuery, paginationResult } = apiFeatures;
  const categories = await mongooseQuery;
  res
    .status(200)
    .json({ results: categories.length, paginationResult, data: categories });
});

// @desc   Get Specific Category By id
// @route  GET /api/v1/categories/:id
// @access Public
exports.getCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const category = await Category.findById(id);
  if (!category) {
    // res.status(404).json({ msg: `Category Not Found For id ${id}`});
    return next(new ApiError(`Category Not Found For id ${id}`, 404));
  }
  res.status(200).json({ data: category });
});

// @desc   Create Category
// @route  POST /api/v1/categories
// @access Private
exports.createCategory = factory.createOne(Category)

// @desc   Update Category
// @route  PUT /api/v1/categories/:id
// @access Private
exports.updateCategory = factory.updateOne(Category);

// @desc   Delete Category
// @route  DELETE /api/v1/categories/:id
// @access Private
exports.deleteCategory = factory.deleteOne(Category);
