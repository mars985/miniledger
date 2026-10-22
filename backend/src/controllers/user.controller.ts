import type { RequestHandler } from "express";
import * as userService from "../services/user.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import type {
  LoginInput,
  RegisterInput,
  SendOtpInput,
} from "../validators/user.validator.js";

export const sendOtp: RequestHandler = async (req, res) => {
  const { phone } = req.body as SendOtpInput;

  await userService.sendOtp(phone);

  res.status(200).json(new ApiResponse(200, null, "OTP sent"));
};

export const register: RequestHandler = async (req, res) => {
  const { phone, name, otp } = req.body as RegisterInput;

  const result = await userService.register(phone, name, otp);

  res.status(201).json(new ApiResponse(201, result, "User registered"));
};

export const login: RequestHandler = async (req, res) => {
  const { phone, otp } = req.body as LoginInput;

  const result = await userService.login(phone, otp);

  res.status(200).json(new ApiResponse(200, result, "Logged in"));
};
