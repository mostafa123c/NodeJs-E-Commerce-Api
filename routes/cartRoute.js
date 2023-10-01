const express = require("express");

const { addProductToCart } = require("../services/cartService");
const authService = require("../services/authService");

const router = express.Router();

router.use(authService.protect, authService.allowedTo("user"));
router.route("/").post(addProductToCart);

module.exports = router;
