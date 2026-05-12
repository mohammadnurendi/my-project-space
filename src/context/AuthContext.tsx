import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { authApi, type ApiUser } from "@/services/authApi";
import type { ApiError } from "@/services/api";
import { TOKEN_KEY } from "@/services/api";

export type UserRole = "user" | "admin";

interface AuthState {
  isAuthenticated: boolean;
  userRole: UserRole | null;
  email: string | null;
  name: string | null;
}

interface AuthContextValue extends AuthState {
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; role?: UserRole; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const fromUser = (u: ApiUser): AuthState => ({
  isAuthenticated: true,
  userRole: u.role,
  email: u.email,
  name: u.name,
});

const EMPTY: AuthState = { isAuthenticated: false, userRole: null, email: null, name: null };

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AuthState>(EMPTY);
  const [loading, setLoading] = useState(true);

  // Hydrate sesi dari token tersimpan
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setLoading(false);
      return;
    }
    authApi
      .me()
      .then((u) => setState(fromUser(u)))
      .catch((error: ApiError) => {
        if (error.status === 401 || error.status === 403) {
          localStorage.removeItem(TOKEN_KEY);
          setState(EMPTY);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const login: AuthContextValue["login"] = async (email, password) => {
    try {
      const { user } = await authApi.login(email.trim().toLowerCase(), password);
      setState(fromUser(user));
      return { success: true, role: user.role };
    } catch (e: unknown) {
      const apiError = e as ApiError;
      const message = apiError?.message === "Kredensial tidak valid."
        ? "email atau password salah"
        : apiError?.message ?? "email atau password salah";
      return { success: false, error: message };
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } finally {
      setState(EMPTY);
    }
  };

  return (
    <AuthContext.Provider value={{ ...state, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
