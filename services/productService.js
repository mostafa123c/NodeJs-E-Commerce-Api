/* eslint-disable import/no-extraneous-dependencies */
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const asyncHandler = require("express-async-handler");

const { uploadMixOfImages } = require("../middlewares/uploadImageMiddleware");
const Product = require("../models/productModel");
const factory = require("./HandlersFactory");

exports.uploadProductImages = uploadMixOfImages([
  { name: "imageCover", maxCount: 1 },
  { name: "images", maxCount: 5 },
]);

exports.resizeProductImages = asyncHandler(async (req, res, next) => {
  // image processing for image cover
  if (req.files.imageCover) {
    const imageCoverFilename = `product-${uuidv4()}-${Date.now()}-cover.jpeg`;

    await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1333)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/products/${imageCoverFilename}`);

    // Save Image Into DB
    req.body.imageCover = imageCoverFilename;
  }

  // image processing for images
  if (req.files.images) {
    req.body.images = [];

    await Promise.all(
      req.files.images.map(async (img, index) => {
        const imageFilename = `product-${uuidv4()}-${Date.now()}-${
          index + 1
        }.jpeg`;
        await sharp(img.buffer)
          .resize(2000, 1333)
          .toFormat("jpeg")
          .jpeg({ quality: 95 })
          .toFile(`uploads/products/${imageFilename}`);

        // Save Image Into DB
        req.body.images.push(imageFilename);
      })
    );

    next();
  }
});

// @desc   Get All Products
// @route  GET /api/v1/products
// @access Public
exports.getProducts = factory.getAll(Product, "Products");

// @desc   Get Specific product By id
// @route  GET /api/v1/products/:id
// @access Public
exports.getProduct = factory.getOne(Product);

// @desc   Create product
// @route  POST /api/v1/products
// @access Private/Admin-Manager
exports.createProduct = factory.createOne(Product);

// @desc   Update product
// @route  PUT /api/v1/products/:id
// @access Private/Admin-Manager
exports.updateProduct = factory.updateOne(Product);

// @desc   Delete product
// @route  DELETE /api/v1/products/:id
// @access Private/Admin
exports.deleteProduct = factory.deleteOne(Product);
