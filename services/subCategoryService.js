const SubCategory = require("../models/subCategoryModel");
const factory = require("./HandlersFactory");

exports.setCategoryIdToBody = (req, res, next) => {
  //Nested Route (Create)
  if (!req.body.category) req.body.category = req.params.categoryId;
  next();
};

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
exports.getsubCategories = factory.getAll(SubCategory);

// @desc   Get Specific subcategory By id
// @route  GET /api/v1/subcategories/:id
// @access Public
exports.getsubCategory = factory.getOne(SubCategory);

// @desc   Create SubCategory
// @route  POST /api/v1/subcategories
// @access Private
exports.createSubCategory = factory.createOne(SubCategory);

// @desc   Update subCategory
// @route  PUT /api/v1/subcategories/:id
// @access Private
exports.updatesubCategory = factory.updateOne(SubCategory);

// @desc   Delete subCategory
// @route  DELETE /api/v1/subcategories/:id
// @access Private
exports.deleteSubCategory = factory.deleteOne(SubCategory);
