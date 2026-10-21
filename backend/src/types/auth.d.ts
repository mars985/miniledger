import type { User } from "../services/user.service.js";

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
