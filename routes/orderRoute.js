const express = require("express");
const { createCashOrder } = require("../services/orderService");

const authService = require("../services/authService");

const router = express.Router();

router.use(authService.protect);

router.route("/:cartId").post(authService.allowedTo("user"), createCashOrder);

module.exports = router;
