const { check } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');


exports.getCategoryValidator = [
    check('id').isMongoId().withMessage("Invalid category Id Format"),
    validatorMiddleware
];

exports.createCategoryValidator = [
    check('name').notEmpty().withMessage("Category name is required")
    .isLength({min: 3}).withMessage("Category name must be at least 3 characters long")
    .isLength({max: 32}).withMessage("Category name must be at most 32 characters long"),
    validatorMiddleware
];

exports.updateCategoryValidator = [
    check('id').isMongoId().withMessage("Invalid category Id Format"),
    check('name').notEmpty().withMessage("Category name is required")
    .isLength({min: 3}).withMessage("Category name must be at least 3 characters long")
    .isLength({max: 32}).withMessage("Category name must be at most 32 characters long"),
    validatorMiddleware
];

exports.deleteCategoryValidator = [
    check('id').isMongoId().withMessage("Invalid category Id Format"),
    validatorMiddleware
];

