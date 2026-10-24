import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import { setAuthToken, setUnauthorizedHandler } from "@/lib/api";
import { clearStoredSession, getStoredSession, setStoredSession } from "@/lib/session-storage";
import type { AuthSession, User } from "@/types/api";

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  signIn: (session: AuthSession) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const signIn = useCallback(async (next: AuthSession) => {
    await setStoredSession(next);
    setAuthToken(next.token);
    setSession(next);
  }, []);

  const signOut = useCallback(async () => {
    setAuthToken(null);
    setSession(null);
    await clearStoredSession();
  }, []);

  useEffect(() => {
    getStoredSession()
      .then((stored) => {
        if (!stored) return;
        setAuthToken(stored.token);
        setSession(stored);
      })
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(() => void signOut());
    return () => setUnauthorizedHandler(null);
  }, [signOut]);

  const value = useMemo(
    () => ({ user: session?.user ?? null, isLoading, signIn, signOut }),
    [session, isLoading, signIn, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
