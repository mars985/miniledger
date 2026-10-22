import { Router } from "express";
import { login, register, sendOtp } from "../controllers/user.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  loginSchema,
  registerSchema,
  sendOtpSchema,
} from "../validators/user.validator.js";

const router = Router();

router.post("/sendOtp", validate(sendOtpSchema), sendOtp);
router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);

export default router;
