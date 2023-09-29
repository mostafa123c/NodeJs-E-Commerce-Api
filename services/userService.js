/* eslint-disable import/no-extraneous-dependencies */
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");

const factory = require("./HandlersFactory");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");
const User = require("../models/userModel");
const ApiError = require("../utils/apiError");

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
// @access Private/Admin
exports.getUsers = factory.getAll(User);

// @desc   Get Specific user By id
// @route  GET /api/v1/users/:id
// @access Private/Admin
exports.getUser = factory.getOne(User);

// @desc   Create user
// @route  POST /api/v1/users
// @access Private/Admin
exports.createUser = factory.createOne(User);

// @desc   Update user
// @route  PUT /api/v1/users/:id
// @access Private/Admin
exports.updateUser = asyncHandler(async (req, res, next) => {
  const document = await User.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      slug: req.body.slug,
      phone: req.body.phone,
      email: req.body.email,
      profileImg: req.body.profileImg,
      role: req.body.role,
    },
    {
      new: true,
    }
  );

  if (!document) {
    return next(new ApiError(`No document for this id ${req.params.id}`, 404));
  }

  res.status(200).json({ data: document });
});

exports.changeUserPassword = asyncHandler(async (req, res, next) => {
  const document = await User.findByIdAndUpdate(
    req.params.id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    { new: true }
  );

  if (!document) {
    return next(new ApiError(`No document for this id ${req.params.id}`, 404));
  }

  res.status(200).json({ data: document });
});

// @desc   Delete user
// @route  DELETE /api/v1/users/:id
// @access Private/Admin
exports.deleteUser = factory.deleteOne(User);

// @desc   Get Logged User Data
// @route  GET /api/v1/users/getMe
// @access Private/Protect
exports.getLoggedUserData = asyncHandler(async (req, res, next) => {
  req.params.id = req.user._id;
  next();
});
