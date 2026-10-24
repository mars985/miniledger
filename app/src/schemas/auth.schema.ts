import { z } from "zod";
import {
  MAX_NAME_LENGTH,
  MIN_NAME_LENGTH,
  OTP_LENGTH,
  PHONE_REGEX,
} from "@/constants/validation";

const phone = z
  .string()
  .trim()
  .regex(PHONE_REGEX, "Enter a valid 10-digit mobile number");

const name = z
  .string()
  .trim()
  .min(MIN_NAME_LENGTH, `Name must be at least ${MIN_NAME_LENGTH} characters`)
  .max(MAX_NAME_LENGTH, `Name can be at most ${MAX_NAME_LENGTH} characters`);

export const loginDetailsSchema = z.object({ phone });

export const signupDetailsSchema = z.object({ name, phone });

export const otpSchema = z.object({
  otp: z
    .string()
    .trim()
    .regex(new RegExp(`^\\d{${OTP_LENGTH}}$`), `OTP must be ${OTP_LENGTH} digits`),
});

export type LoginDetails = z.output<typeof loginDetailsSchema>;
export type SignupDetails = z.output<typeof signupDetailsSchema>;
