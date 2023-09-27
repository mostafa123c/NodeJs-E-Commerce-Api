/* eslint-disable import/no-extraneous-dependencies */
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const asyncHandler = require("express-async-handler");

const factory = require("./HandlersFactory");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");
const User = require("../models/userModel");

// Upload Single Image
exports.uploadUserImage = uploadSingleImage("profileImg");

// Image Processing
exports.resizeImage = asyncHandler(async (req, res, next) => {
  if (!req.file) return next();

  const filename = `user-${uuidv4()}-${Date.now()}.jpeg`;

  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/users/${filename}`);

    // Save Image Into DB
    req.body.profileImg = filename;
  }
  next();
});

// @desc   Get All Users
// @route  GET /api/v1/users
// @access Private
exports.getUsers = factory.getAll(User);

// @desc   Get Specific user By id
// @route  GET /api/v1/users/:id
// @access Private
exports.getUser = factory.getOne(User);

// @desc   Create user
// @route  POST /api/v1/users
// @access Private
exports.createUser = factory.createOne(User);

// @desc   Update user
// @route  PUT /api/v1/users/:id
// @access Private
exports.updateUser = factory.updateOne(User);

// @desc   Delete user
// @route  DELETE /api/v1/users/:id
// @access Private
exports.deleteUser = factory.deleteOne(User);
