const factory = require("./HandlersFactory");
const Review = require("../models/reviewModel");

// @desc   Get All Reviews
// @route  GET /api/v1/reviews
// @access Public
exports.getReviews = factory.getAll(Review);

// @desc   Get Specific review By id
// @route  GET /api/v1/reviews/:id
// @access Public
exports.getReview = factory.getOne(Review);

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
