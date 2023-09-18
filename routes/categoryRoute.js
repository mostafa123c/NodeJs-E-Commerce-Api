const express = require('express');

const { getCategories,
        getCategory,
        createCategory,
        updateCategory,
        deleteCategory
     } = require('../services/categoryService');
const { getcategoryValidator, createCategoryValidator, updateCategoryValidator, deleteCategoryValidator } = require('../utils/validators/categoryValidator');

const router = express.Router();

router.route("/").get(getCategories).post( createCategoryValidator, createCategory);
router.route("/:id")
    .get(getcategoryValidator,getCategory)
    .put(updateCategoryValidator,updateCategory)
    .delete(deleteCategoryValidator,deleteCategory);





module.exports = router;
