const { HttpStatus, HttpResponseMessage } = require("../enums/http.js");
const { isCelebrateError } = require("celebrate");

const errorHandler = (err, req, res, next) => {
  console.error(err.stack); // Loga o erro no console

  const errorResponse = {
    success: false,
    message: err.message || HttpResponseMessage.INTERNAL_SERVER_ERROR,
    code: err.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
    details: err.details || null,
  };

  if (isCelebrateError(err)) {
    const errorBody = err.details.get("body");
    const errorQuery = err.details.get("query");
    const errorParams = err.details.get("params");

    errorResponse.code = HttpStatus.BAD_REQUEST;
    errorResponse.message =
      (errorBody && errorBody.message) ||
      (errorQuery && errorQuery.message) ||
      (errorParams && errorParams.message) ||
      "Erro de validação";
  }

  if (err.status === HttpStatus.FORBIDDEN) {
    errorResponse.code = HttpStatus.FORBIDDEN;
    errorResponse.message = HttpResponseMessage.FORBIDDEN;
    errorResponse.type = ErrorTypes.AUTH;
  }

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
