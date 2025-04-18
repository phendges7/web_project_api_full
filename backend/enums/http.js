export const HttpStatus = Object.freeze({
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
});

export const HttpResponseMessage = Object.freeze({
  SUCCESS: "Success",
  CREATED: "Resource created successfully",
  BAD_REQUEST: "Bad request",
  UNAUTHORIZED: "Unauthorized access",
  FORBIDDEN: "Access forbidden",
  NOT_FOUND: "Resource not found",
  SERVER_ERROR: "Internal server error",
});

export const ErrorTypes = Object.freeze({
  VALIDATION: "ValidationError",
  AUTH: "AuthError",
  NOT_FOUND: "NotFoundError",
  DATABASE: "DatabaseError",
});
