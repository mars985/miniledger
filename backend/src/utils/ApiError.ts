export class ApiError extends Error {
  statusCode: number;
  success: false;
  errors: unknown[];

  constructor(
    statusCode: number,
    message = "Something went wrong",
    errors: unknown[] = [],
    stack = "",
  ) {
    super(message);
    this.statusCode = statusCode;
    this.success = false;
    this.errors = errors;
    this.name = "ApiError";

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
