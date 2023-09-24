const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const ApiError = require("../utils/apiError");
const Brand = require("../models/brandModel");
const ApiFeatures = require("../utils/apiFeatures");
const factory = require("./HandlersFactory");

// @desc   Get All Brands
// @route  GET /api/v1/brands
// @access Public
exports.getBrands = asyncHandler(async (req, res) => {
  const documentsCounts = await Brand.countDocuments();
  const apiFeatures = new ApiFeatures(Brand.find(), req.query)
    .paginate(documentsCounts)
    .filter()
    .search()
    .limitFields()
    .sort();

  // Excute query
  const { mongooseQuery, paginationResult } = apiFeatures;
  const brands = await mongooseQuery;
  res
    .status(200)
    .json({ results: brands.length, paginationResult, data: brands });
});

// @desc   Get Specific brand By id
// @route  GET /api/v1/brands/:id
// @access Public
exports.getBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const brand = await Brand.findById(id);
  if (!brand) {
    return next(new ApiError(`brand Not Found For id ${id}`, 404));
  }
  res.status(200).json({ data: brand });
});

// @desc   Create brand
// @route  POST /api/v1/brands
// @access Private
exports.createBrand = factory.createOne(Brand)

// @desc   Update brand
// @route  PUT /api/v1/brands/:id
// @access Private
exports.updateBrand = factory.updateOne(Brand);

// @desc   Delete brand
// @route  DELETE /api/v1/brands/:id
// @access Private
exports.deleteBrand = factory.deleteOne(Brand);
