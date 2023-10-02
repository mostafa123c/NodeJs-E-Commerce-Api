const express = require("express");
const {
  createCashOrder,
  getAllOrders,
  filterOrderForLoggedUser,
  getSpecificOrder,
} = require("../services/orderService");

const authService = require("../services/authService");

const router = express.Router();

router.use(authService.protect);

router.route("/:cartId").post(authService.allowedTo("user"), createCashOrder);
router.get(
  "/",
  authService.allowedTo("user", "admin", "manager"),
  filterOrderForLoggedUser,
  getAllOrders
);

router.get("/:id", getSpecificOrder);

module.exports = router;
