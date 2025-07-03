class CustomError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = statusCode >= 400 && statusCode < 500 ? "fail" : "error";
    // So the error is neat when stringified. NotFoundError: message instead of Error: message
    this.name = "NotFoundError";
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = CustomError;

//const CustomError = require("../errors/customError");
