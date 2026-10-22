import jwt from "jsonwebtoken";
import { TOKEN_EXPIRY_TIME } from "../constants/cookie.constants.js";
import { ApiError } from "./ApiError.js";

export interface TokenPayload {
  id: number;
}

function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new ApiError(500, "JWT_SECRET is not set");
  return secret;
}

export function signToken(payload: TokenPayload) {
  return jwt.sign(payload, getSecret(), { expiresIn: TOKEN_EXPIRY_TIME });
}

export function verifyToken(token: string): TokenPayload {
  const secret = getSecret();

  let decoded;
  try {
    decoded = jwt.verify(token, secret);
  } catch {
    throw new ApiError(401, "Invalid or expired token");
  }

  if (typeof decoded === "string" || typeof decoded.id !== "number") {
    throw new ApiError(401, "Invalid token payload");
  }

  return { id: decoded.id };
}
