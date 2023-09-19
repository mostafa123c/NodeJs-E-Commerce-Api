const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const ApiError = require("../utils/apiError");

const SubCategory = require("../models/subCategoryModel");

exports.setCategoryIdToBody = (req, res, next) => {
  //Nested Route
  if (!req.body.category) req.body.category = req.params.categoryId;
  next();
};
// @desc   Create SubCategory
// @route  POST /api/v1/subcategories
// @access Private
exports.createSubCategory = asyncHandler(async (req, res) => {
  const { name, category } = req.body;
  //async await
  const subCategory = await SubCategory.create({
    name,
    slug: slugify(name),
    category,
  });
  res.status(201).json({ data: subCategory });
});

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
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 5;
  const skip = (page - 1) * limit;

  const subCategories = await SubCategory.find(req.filterObj)
    .skip(skip)
    .limit(limit);
  // .populate({ path: "category", select: "name -_id" });
  res
    .status(200)
    .json({ results: subCategories.length, page, data: subCategories });
});

// @desc   Get Specific subcategory By id
// @route  GET /api/v1/subcategories/:id
// @access Public
exports.getsubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const subCategory = await SubCategory.findById(id);
  if (!subCategory) {
    // res.status(404).json({ msg: `subCategory Not Found For id ${id}`});
    return next(new ApiError(`subCategory Not Found For id ${id}`, 404));
  }
  res.status(200).json({ data: subCategory });
});

// @desc   Update subCategory
// @route  PUT /api/v1/subcategories/:id
// @access Private
exports.updatesubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name, category } = req.body;
  const subCategory = await SubCategory.findOneAndUpdate(
    { _id: id },
    { name, slug: slugify(name), category },
    { new: true }
  );

  if (!subCategory) {
    return next(new ApiError(`subCategory Not Found For id ${id}`, 404));
  }
  res.status(200).json({ data: subCategory });
});

// @desc   Delete subCategory
// @route  DELETE /api/v1/subcategories/:id
// @access Private
exports.deleteSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const subCategory = await SubCategory.findByIdAndDelete(id);
  if (!subCategory) {
    return next(new ApiError(`subCategory Not Found For id ${id}`, 404));
  }
  res.status(204).send();
});
