import { api } from "@/lib/api";
import type { ApiResponse, AuthSession } from "@/types/api";

export async function sendOtp(phone: string) {
  await api.post<ApiResponse<null>>("/users/sendOtp", { phone });
}

export async function login(phone: string, otp: string) {
  const { data } = await api.post<ApiResponse<AuthSession>>("/users/login", { phone, otp });
  return data.data;
}

export async function register(phone: string, name: string, otp: string) {
  const { data } = await api.post<ApiResponse<AuthSession>>("/users/register", {
    phone,
    name,
    otp,
  });
  return data.data;
}
