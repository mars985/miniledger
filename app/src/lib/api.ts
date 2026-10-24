import { create, isAxiosError } from "axios";

export const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:4000";

export const api = create({
  baseURL: API_URL,
  timeout: 15_000,
});

let authToken: string | null = null;
let unauthorizedHandler: (() => void) | null = null;

export function setAuthToken(token: string | null) {
  authToken = token;
}

export function setUnauthorizedHandler(handler: (() => void) | null) {
  unauthorizedHandler = handler;
}

api.interceptors.request.use((config) => {
  if (authToken) config.headers.Authorization = `Bearer ${authToken}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (isAxiosError(error) && error.response?.status === 401 && authToken) {
      unauthorizedHandler?.();
    }
    return Promise.reject(error);
  },
);

export function getErrorMessage(error: unknown) {
  if (isAxiosError(error)) {
    if (!error.response) return "Can't reach the server. Check that the backend is running.";

    const data = error.response.data;
    if (typeof data === "string" && data) return data;

    const issueMessage = data?.errors?.[0]?.message;
    if (typeof issueMessage === "string") return issueMessage;

    if (typeof data?.message === "string") return data.message;
  }

  return "Something went wrong. Please try again.";
}
