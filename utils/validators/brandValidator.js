const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

exports.getBrandValidator = [
  check("id").isMongoId().withMessage("Invalid brand Id Format"),
  validatorMiddleware,
];

exports.createBrandValidator = [
  check("name")
    .notEmpty()
    .withMessage("brand name is required")
    .isLength({ min: 3 })
    .withMessage("brand name must be at least 3 characters long")
    .isLength({ max: 32 })
    .withMessage("brand name must be at most 32 characters long"),
  validatorMiddleware,
];

exports.updateBrandValidator = [
  check("id").isMongoId().withMessage("Invalid brand Id Format"),
  check("name")
    .notEmpty()
    .withMessage("brand name is required")
    .isLength({ min: 3 })
    .withMessage("brand name must be at least 3 characters long")
    .isLength({ max: 32 })
    .withMessage("brand name must be at most 32 characters long"),
  validatorMiddleware,
];

exports.deleteBrandValidator = [
  check("id").isMongoId().withMessage("Invalid brand Id Format"),
  validatorMiddleware,
];
