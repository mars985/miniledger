import type { RequestHandler } from "express";
import type { ZodType } from "zod";
import { ApiError } from "../utils/ApiError.js";

type RequestSource = "body" | "query" | "params";

export const validate = (
  schema: ZodType,
  source: RequestSource = "body",
): RequestHandler => {
  return (req, _res, next) => {
    const inputData = {
      ...req[source],
      loggedInUserId: req.user?._id,
    };

    const result = validateData(schema, inputData);

    if (!result.success) {
      return next(new ApiError(400, "Validation failed", result.error.issues));
    }

    Object.defineProperty(req, source, {
      value: result.data,
      writable: true,
      configurable: true,
      enumerable: true,
    });
    next();
  };
};

export const validateData = (schema: ZodType, data: unknown) =>
  schema.safeParse(data);
