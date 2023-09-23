const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const ApiError = require("../utils/apiError");

const Product = require("../models/productModel");

// @desc   Get All Products
// @route  GET /api/v1/products
// @access Public
exports.getProducts = asyncHandler(async (req, res) => {
  // Filtering
  const queryStringObj = { ...req.query };
  const excludedFields = ["fields", "sort", "page", "limit"];
  excludedFields.forEach((field) => delete queryStringObj[field]);

  // Apply Filtering  using (gte , gt , lte , lt)
  // {price: {$gte: 50}, ratingsAverage: {$gte: 4}}
  let queryString = JSON.stringify(queryStringObj);
  queryString = queryString.replace(
    /\b(gte|gt|lte|lt)\b/g,
    (match) => `$${match}`
  );

  // Pagination
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 50;
  const skip = (page - 1) * limit;

  // Build query
  const mongooseQuery = Product.find(JSON.parse(queryString))
    .skip(skip)
    .limit(limit)
    .populate({ path: "category", select: "name -_id" });

  // Excute query
  const products = await mongooseQuery;

  res.status(200).json({ results: products.length, page, data: products });
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
exports.createProduct = asyncHandler(async (req, res) => {
  req.body.slug = slugify(req.body.title);

  const product = await Product.create(req.body);
  res.status(201).json({ data: product });
});

// @desc   Update product
// @route  PUT /api/v1/products/:id
// @access Private
exports.updateProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  if (req.body.title) {
    req.body.slug = slugify(req.body.title);
  }

  const product = await Product.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
  });

  if (!product) {
    return next(new ApiError(`product Not Found For id ${id}`, 404));
  }
  res.status(200).json({ data: product });
});

// @desc   Delete product
// @route  DELETE /api/v1/products/:id
// @access Private
exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findByIdAndDelete(id);

  if (!product) {
    return next(new ApiError(`product Not Found For id ${id}`, 404));
  }
  res.status(204).send();
});
