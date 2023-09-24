const { check, body } = require("express-validator");
const slugify = require("slugify");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

exports.getsubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid subCategory Id Format"),
  validatorMiddleware,
];

exports.createsubCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("subCategory name is required")
    .isLength({ min: 2 })
    .withMessage("subCategory name must be at least 3 characters long")
    .isLength({ max: 32 })
    .withMessage("subCategory name must be at most 32 characters long"),
  check("category")
    .notEmpty()
    .withMessage("subCategory Must be belong to category")
    .isMongoId()
    .withMessage("Invalid Category id format"),

  validatorMiddleware,
];

exports.updatesubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid subCategory Id Format"),
  body("name").custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),
  validatorMiddleware,
];

exports.deletesubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid subCategory Id Format"),
  validatorMiddleware,
];
