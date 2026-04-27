import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type UserRole = "user" | "admin";

interface AuthState {
  isAuthenticated: boolean;
  userRole: UserRole | null;
  email: string | null;
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => { success: boolean; role?: UserRole; error?: string };
  logout: () => void;
}

const STORAGE_KEY = "lpm-auth";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const loadInitial = (): AuthState => {
  if (typeof window === "undefined") {
    return { isAuthenticated: false, userRole: null, email: null };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { isAuthenticated: false, userRole: null, email: null };
    const parsed = JSON.parse(raw) as AuthState;
    if (parsed && typeof parsed === "object" && parsed.isAuthenticated) return parsed;
  } catch {
    // ignore
  }
  return { isAuthenticated: false, userRole: null, email: null };
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AuthState>(loadInitial);

  useEffect(() => {
    if (state.isAuthenticated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [state]);

  const login: AuthContextValue["login"] = (email, password) => {
    const normalized = email.trim().toLowerCase();
    if (normalized === "admin@lpm.com" && password === "123456") {
      setState({ isAuthenticated: true, userRole: "admin", email: normalized });
      return { success: true, role: "admin" };
    }
    if (normalized === "user@lpm.com" && password === "123456") {
      setState({ isAuthenticated: true, userRole: "user", email: normalized });
      return { success: true, role: "user" };
    }
    return { success: false, error: "Email atau kata sandi salah." };
  };

  const logout = () => {
    setState({ isAuthenticated: false, userRole: null, email: null });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>{children}</AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
