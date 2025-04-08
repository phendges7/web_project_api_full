const { HttpStatus, HttpResponseMessage } = require("../enums/http.js");

const errorHandler = (err, req, res, next) => {
  console.error(err.stack); // Loga o erro no console

  const errorResponse = {
    success: false,
    message: err.message || HttpResponseMessage.INTERNAL_SERVER_ERROR,
    code: err.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
    details: err.details || null,
  };

  if (err.name === "ValidationError") {
    errorResponse.code = HttpStatus.BAD_REQUEST;
    errorResponse.message = HttpResponseMessage.BAD_REQUEST;
    errorResponse.details = err.errors;
  }

  if (err.name === "UnauthorizedError") {
    errorResponse.code = HttpStatus.UNAUTHORIZED;
    errorResponse.message = HttpResponseMessage.UNAUTHORIZED;
  }

  res.status(errorResponse.code).json(errorResponse);
};

module.exports = errorHandler;
