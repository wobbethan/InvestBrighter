const ErrorHandler = require("../utils/ErrorHandler");

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal server Error";

  if (err.name === "CastError") {
    const message = `Resources not found with ID, Invalid ${err.path}`;
    err = new ErrorHandler(message, 400);
  }

  //Duplicate key
  if (err.code === 11000) {
    const message = `Duplicate key ${Object.keys(err.keyValue)} Entered`;
    err = new ErrorHandler(message, 400);
  }

  //wrong jwt
  if (err.name === "JsonWebTokenError") {
    const message = `Invalid URL, Please try again later`;
    err = new ErrorHandler(message, 400);
  }
  //expired jwt
  if (err.name === "TokenExpiredError") {
    const message = `Your Url is expired, Please try again later`;
    err = new ErrorHandler(message, 400);
  }
  res.status(err, statusCode).json({
    Success: false,
    message: err.message,
  });
};
