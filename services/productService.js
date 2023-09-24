const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const ApiError = require("../utils/apiError");
const Product = require("../models/productModel");
const ApiFeatures = require("../utils/apiFeatures");
const factory = require("./HandlersFactory");

// @desc   Get All Products
// @route  GET /api/v1/products
// @access Public
exports.getProducts = asyncHandler(async (req, res, next) => {
  // Build query
  const documentsCounts = await Product.countDocuments();
  const apiFeatures = new ApiFeatures(Product.find(), req.query)
    .paginate(documentsCounts)
    .filter()
    .search("Products")
    .limitFields()
    .sort();

  // Excute query
  const { mongooseQuery, paginationResult } = apiFeatures;
  const products = await mongooseQuery;

  res
    .status(200)
    .json({ results: products.length, paginationResult, data: products });
});

// @desc   Get Specific product By id
// @route  GET /api/v1/products/:id
// @access Public
exports.getProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findById(id).populate({
    path: "category",
    select: "name -_id",
  });
  if (!product) {
    return next(new ApiError(`product Not Found For id ${id}`, 404));
  }
  res.status(200).json({ data: product });
});

// @desc   Create product
// @route  POST /api/v1/products
// @access Private
exports.createProduct = factory.createOne(Product);

// @desc   Update product
// @route  PUT /api/v1/products/:id
// @access Private
exports.updateProduct = factory.updateOne(Product);

// @desc   Delete product
// @route  DELETE /api/v1/products/:id
// @access Private
exports.deleteProduct = factory.deleteOne(Product);
