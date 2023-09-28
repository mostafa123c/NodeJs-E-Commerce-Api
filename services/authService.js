/* eslint-disable import/no-extraneous-dependencies */
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const User = require("../models/userModel");
const sendEmail = require("../utils/sendEmail");

const createToken = (payload) =>
  jwt.sign({ userId: payload }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

// @desc    Signup
// @route   GET /api/v1/auth/signup
// @access  Public
exports.signup = asyncHandler(async (req, res, next) => {
  // 1- Create user
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  // 2- Generate token
  const token = createToken(user._id);

  res.status(201).json({ data: user, token });
});

// @desc    Login
// @route   GET /api/v1/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
  // 1) check if password and email in the body (validation)
  // 2) check user exist & check password correct
  const user = await User.findOne({ email: req.body.email });

  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return next(new ApiError("Incorrect Email or Password", 401));
  }
  // 3) Generate token
  const token = createToken(user._id);
  // 4) send response
  res.status(200).json({ data: user, token });
});

// @desc    Protect routes (make sure user is auth)
exports.protect = asyncHandler(async (req, res, next) => {
  // 1) check if token exist , if exist get it
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(new ApiError("Please login to access this route", 401));
  }
  // 2) verify token  (no change happen , expired token)
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  // 3) check if user exists
  const currentUser = await User.findById(decoded.userId);
  if (!currentUser) {
    return next(new ApiError("User not found", 401));
  }
  // 4) check if user change his password after token created
  if (currentUser.passwordChangedAt) {
    const passChangedTimestamp = parseInt(
      currentUser.passwordChangedAt.getTime() / 1000,
      10
    );
    // Password changed after token created
    if (passChangedTimestamp > decoded.iat) {
      return next(
        new ApiError(
          "User Recently changed his password, please login again...",
          401
        )
      );
    }
  }

  req.user = currentUser;
  next();
});

// @desc   Authorization (User Permissions)
// ["admin" , "manager"]
exports.allowedTo = (...roles) =>
  asyncHandler(async (req, res, next) => {
    // 1) access roles
    // 2) access registered user (req.user.role)
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError("You are not allowed to access this route", 403)
      );
    }
    next();
  });

// @desc    forgetPassword
// @route   POST /api/v1/auth/forgetPassword
// @access  Public
exports.forgetPassword = asyncHandler(async (req, res, next) => {
  // 1) Get Uoser By email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new ApiError(`There is no user with email ${req.body.email}`, 404)
    );
  }
  // 2) If user exist , generate hash reset random 6 digits and save it in db
  const resetCode = Math.floor(Math.random() * 900000 + 100000).toString();
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");

  //Save hashed passwordReset Cose into DB
  user.passwordResetCode = hashedResetCode;
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  user.passwordResetVerified = false;

  await user.save();

  // 3) Send the reset code via email
  const message = `Hi ${user.name},\n We recieved a request to teset the password on your E-shop Account. \n This is your password reset code: ${resetCode}\n\n Enter this code to complete the reset.\n Thanks for helping us keeping your account secure.\n Regards,\n E-shop Team`;
  try {
    sendEmail({
      email: user.email,
      subject: "Password Reset Code (Valid for 10 Minutes)",
      message,
    });
  } catch (err) {
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerified = undefined;

    await user.save();
    return next(
      new ApiError(
        "Something went wrong while sending the reset code, please try again later",
        500
      )
    );
  }

  res.status(200).json({
    status: "success",
    message: "Reset code sent to your email",
  });
});
