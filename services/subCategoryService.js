const asyncHandler = require("express-async-handler");
const SubCategory = require("../models/subCategoryModel");
const ApiFeatures = require("../utils/apiFeatures");
const factory = require("./HandlersFactory");

exports.setCategoryIdToBody = (req, res, next) => {
  //Nested Route
  if (!req.body.category) req.body.category = req.params.categoryId;
  next();
};
// @desc   Create SubCategory
// @route  POST /api/v1/subcategories
// @access Private
exports.createSubCategory = factory.createOne(SubCategory);

// Nested Route
//@desc    Get all the subcategories of a particular Category
//@route   GET /api/v1/categories/:categoryId/subcategories
exports.createFilterObject = (req, res, next) => {
  let filterObject = {};
  if (req.params.categoryId) filterObject = { category: req.params.categoryId };
  req.filterObj = filterObject;
  next();
};

// @desc   Get All subcategories
// @route  GET /api/v1/subcategories
// @access Public
exports.getsubCategories = asyncHandler(async (req, res) => {
  // Build query
  const documentsCounts = await SubCategory.countDocuments();
  const apiFeatures = new ApiFeatures(SubCategory.find(), req.query)
    .paginate(documentsCounts)
    .filter()
    .search()
    .limitFields()
    .sort();

  // Excute query
  const { mongooseQuery, paginationResult } = apiFeatures;
  const subCategories = await mongooseQuery;
  res.status(200).json({
    results: subCategories.length,
    paginationResult,
    data: subCategories,
  });
});

// @desc   Get Specific subcategory By id
// @route  GET /api/v1/subcategories/:id
// @access Public
exports.getsubCategory = factory.getOne(SubCategory);

// @desc   Update subCategory
// @route  PUT /api/v1/subcategories/:id
// @access Private
exports.updatesubCategory = factory.updateOne(SubCategory);

// @desc   Delete subCategory
// @route  DELETE /api/v1/subcategories/:id
// @access Private
exports.deleteSubCategory = factory.deleteOne(SubCategory);
