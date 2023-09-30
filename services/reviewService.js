const factory = require("./HandlersFactory");
const Review = require("../models/reviewModel");

// Nested Route
//@desc    Get all the reviews of a particular product
//@route   GET /api/v1/products/:productId/reviews
exports.createFilterObject = (req, res, next) => {
  let filterObject = {};
  if (req.params.productId) filterObject = { product: req.params.productId };
  req.filterObj = filterObject;
  next();
};

// @desc   Get All Reviews
// @route  GET /api/v1/reviews
// @access Public
exports.getReviews = factory.getAll(Review);

// @desc   Get Specific review By id
// @route  GET /api/v1/reviews/:id
// @access Public
exports.getReview = factory.getOne(Review);

// Nested Route (Create)
exports.setProductIdAndUserIdToBody = (req, res, next) => {
  if (!req.body.product) req.body.product = req.params.productId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

// @desc   Create review
// @route  POST /api/v1/reviews
// @access Protect/User
exports.createReview = factory.createOne(Review);

// @desc   Update review
// @route  PUT /api/v1/reviews/:id
// @access Protect/User
exports.updateReview = factory.updateOne(Review);

// @desc   Delete review
// @route  DELETE /api/v1/reviews/:id
// @access Protect/User-Admin-Manager
exports.deleteReview = factory.deleteOne(Review);
