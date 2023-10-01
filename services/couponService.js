const factory = require("./HandlersFactory");
const Coupon = require("../models/couponModel");

// @desc   Get All Coupons
// @route  GET /api/v1/coupons
// @access Private/Admin-Manager
exports.getCoupons = factory.getAll(Coupon);

// @desc   Get Specific Coupon By id
// @route  GET /api/v1/coupons/:id
// @access Private/Admin-Manager
exports.getCoupon = factory.getOne(Coupon);

// @desc   Create Coupon
// @route  POST /api/v1/coupons
// @access Private/Admin-Manager
exports.createCoupon = factory.createOne(Coupon);

// @desc   Update Coupon
// @route  PUT /api/v1/coupons/:id
// @access Private/Admin-Manager
exports.updateCoupon = factory.updateOne(Coupon);

// @desc   Delete Coupon
// @route  DELETE /api/v1/coupons/:id
// @access Private/Admin
exports.deleteCoupon = factory.deleteOne(Coupon);
