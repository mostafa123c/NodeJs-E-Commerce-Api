const path = require("path");

const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
const compression = require("compression");

dotenv.config({ path: "./config.env" });
const ApiError = require("./utils/apiError");
const globalError = require("./middlewares/errorMiddleware");
const dbConnection = require("./config/database");
// Routes
const mountRoutes = require("./routes");

// Connect to DB
dbConnection();

//express ap
const app = express();

// Enable other domains to access your application
app.use(cors());
app.options("*", cors());

// Compress All Responses
app.use(compression());

// Middlewares
app.use(express.json());
app.use(express.static(path.join(__dirname, "uploads")));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode: ${process.env.NODE_ENV}`);
}

// Mount Routes
mountRoutes(app);

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
