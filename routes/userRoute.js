const express = require("express");
// const {
//   getBrandValidator,
//   createBrandValidator,
//   upValidator,
//   deleteBrandValidator,
// } = require("../utils/validators/brandValidator");

const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  uploadUserImage,
  resizeImage,
} = require("../services/userService");

const router = express.Router();

router.route("/").get(getUsers).post(uploadUserImage, resizeImage, createUser);
router
  .route("/:id")
  .get(getUser)
  .put(uploadUserImage, resizeImage, updateUser)
  .delete(deleteUser);
module.exports = router;
