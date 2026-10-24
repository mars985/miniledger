import { SESSION_STORAGE_KEY } from "@/constants/storage";
import type { AuthSession } from "@/types/api";

export async function getStoredSession(): Promise<AuthSession | null> {
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AuthSession) : null;
  } catch {
    return null;
  }
}

export async function setStoredSession(session: AuthSession) {
  try {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  } catch {}
}

export async function clearStoredSession() {
  try {
    localStorage.removeItem(SESSION_STORAGE_KEY);
  } catch {}
}
