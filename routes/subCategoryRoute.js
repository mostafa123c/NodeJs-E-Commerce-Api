const express = require("express");

const {
  createSubCategory,
  getsubCategories,
  getsubCategory,
  updatesubCategory,
  deleteSubCategory,
  setCategoryIdToBody,
  createFilterObject,
} = require("../services/subCategoryService");

const {
  createsubCategoryValidator,
  getsubCategoryValidator,
  updatesubCategoryValidator,
  deletesubCategoryValidator,
} = require("../utils/validators/subCategoryValidator");

const authService = require("../services/authService");

// merge params : allow us to access parameters on other routers
// like in categoryRoute.js we have /:categoryId/subcategories
// so we can access categoryId in subCategoryRoute.js
const router = express.Router({ mergeParams: true });

router
  .route("/")
  .post(
    authService.protect,
    authService.allowedTo("admin", "manager"),
    setCategoryIdToBody,
    createsubCategoryValidator,
    createSubCategory
  )
  .get(createFilterObject, getsubCategories);
router
  .route("/:id")
  .get(getsubCategoryValidator, getsubCategory)
  .put(
    authService.protect,
    authService.allowedTo("admin", "manager"),
    updatesubCategoryValidator,
    updatesubCategory
  )
  .delete(
    authService.protect,
    authService.allowedTo("admin"),
    deletesubCategoryValidator,
    deleteSubCategory
  );

module.exports = router;
