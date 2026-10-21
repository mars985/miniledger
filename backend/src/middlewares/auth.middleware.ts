import jwt from "jsonwebtoken";
import type { RequestHandler } from "express";
import { findUserById } from "../services/user.service.js";
import { ApiError } from "../utils/ApiError.js";
import {
  AUTH_COOKIE_NAME,
  authCookieOptions,
} from "../constants/cookie.constants.js";

interface TokenPayload {
  _id: string;
}

async function verifyUserFromToken(token: string | undefined) {
  if (!token) throw new ApiError(400, "No token provided");

  const secret = process.env.JWT_SECRET;
  if (!secret) throw new ApiError(500, "JWT_SECRET is not set");

  let decoded: TokenPayload;
  try {
    decoded = jwt.verify(token, secret) as TokenPayload;
  } catch {
    throw new ApiError(400, "Invalid or expired token");
  }

  const loggedInUser = await findUserById(decoded._id);
  if (!loggedInUser) throw new ApiError(400, "User not found");

  return loggedInUser;
}

export const authenticate: RequestHandler = async (req, res, next) => {
  try {
    const token: string | undefined = req.cookies?.[AUTH_COOKIE_NAME];
    req.user = await verifyUserFromToken(token);
    next();
  } catch (err) {
    res.clearCookie(AUTH_COOKIE_NAME, authCookieOptions);
    res.status(401).send(err instanceof Error ? err.message : "Unauthorized");
  }
};
