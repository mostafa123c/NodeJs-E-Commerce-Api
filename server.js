const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");

dotenv.config({ path: "./config.env" });
const ApiError = require("./utils/apiError");
const globalError = require("./middlewares/errorMiddleware");
const dbConnection = require("./config/database");
const categoryRoute = require("./routes/categoryRoute");
const subCategoryRoute = require("./routes/subCategoryRoute");

// Connect to DB
dbConnection();

//express app
const app = express();

// Middlewares
app.use(express.json());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode: ${process.env.NODE_ENV}`);
}

// Mount Routes
app.use("/api/v1/categories", categoryRoute);
app.use("/api/v1/subcategories", subCategoryRoute);

app.all("*", (req, res, next) => {
  // create error and send it to error handling middleware
  // const err = new Error(`Can't find ${req.originalUrl} on this server`);
  // next(err.message)
  next(new ApiError(`Can't find ${req.originalUrl} on this server`, 400));
});

// Global Error Handler Middleware for express
app.use(globalError);

const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
  console.log(`APP is running on port ${PORT}`);
});

// Handle Rejections outside express
process.on("unhandledRejection", (err) => {
  console.log(`Unhandled Rejection Errors :${err.name} |${err.message}`);
  console.log(
    `Shutting down the server due to Unhandled Promise Rejection.........`
  );
  server.close(() => {
    process.exit(1);
  });
});
