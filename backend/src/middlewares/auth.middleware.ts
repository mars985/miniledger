import type { RequestHandler } from "express";
import { findUserById } from "../services/user.service.js";
import { ApiError } from "../utils/ApiError.js";
import { verifyToken } from "../utils/jwt.js";

async function verifyUserFromToken(token: string | undefined) {
  if (!token) throw new ApiError(400, "No token provided");

  const { id } = verifyToken(token);

  const loggedInUser = await findUserById(id);
  if (!loggedInUser) throw new ApiError(400, "User not found");

  return loggedInUser;
}

export const authenticate: RequestHandler = async (req, res, next) => {
  try {
    const [scheme, token] = req.headers.authorization?.split(" ") ?? [];
    req.user = await verifyUserFromToken(scheme === "Bearer" ? token : undefined);
    next();
  } catch (err) {
    res.status(401).send(err instanceof Error ? err.message : "Unauthorized");
  }
};
