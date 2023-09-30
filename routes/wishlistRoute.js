const express = require("express");

const { addProductToWishlist } = require("../services/wishlistService");

const authService = require("../services/authService");

const router = express.Router();

router
  .route("/")
  .post(
    authService.protect,
    authService.allowedTo("user"),
    addProductToWishlist
  );

module.exports = router;
