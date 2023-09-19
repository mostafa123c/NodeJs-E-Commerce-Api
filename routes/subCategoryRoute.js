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

// merge params : allow us to access parameters on other routers
// like in categoryRoute.js we have /:categoryId/subcategories
// so we can access categoryId in subCategoryRoute.js
const router = express.Router({ mergeParams: true });

router
  .route("/")
  .post(setCategoryIdToBody, createsubCategoryValidator, createSubCategory)
  .get(createFilterObject, getsubCategories);
router
  .route("/:id")
  .get(getsubCategoryValidator, getsubCategory)
  .put(updatesubCategoryValidator, updatesubCategory)
  .delete(deletesubCategoryValidator, deleteSubCategory);

module.exports = router;
