import { z } from "zod";
import {
  MAX_USERNAME_LENGTH,
  MIN_USERNAME_LENGTH,
  OTP_LENGTH,
  PHONE_REGEX,
} from "../constants/user.constants.js";

const phone = z
  .string()
  .trim()
  .regex(PHONE_REGEX, "Phone must be a 10-digit Indian mobile number");

const otp = z
  .string()
  .trim()
  .regex(new RegExp(`^\\d{${OTP_LENGTH}}$`), `OTP must be ${OTP_LENGTH} digits`);

export const sendOtpSchema = z.object({ phone });

export const registerSchema = z.object({
  phone,
  name: z.string().trim().min(MIN_USERNAME_LENGTH).max(MAX_USERNAME_LENGTH),
  otp,
});

export const loginSchema = z.object({ phone, otp });

export type SendOtpInput = z.infer<typeof sendOtpSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
