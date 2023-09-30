const express = require("express");

const {
  addProductToWishlist,
  removeProductFromWishlist,
} = require("../services/wishlistService");

const authService = require("../services/authService");

const router = express.Router();

router.post(
  "/",
  authService.protect,
  authService.allowedTo("user"),
  addProductToWishlist
);

router.delete(
  "/:productId",
  authService.protect,
  authService.allowedTo("user"),
  removeProductFromWishlist
);

module.exports = router;
