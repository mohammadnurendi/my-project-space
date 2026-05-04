/**
 * Service Auth (login/logout/me) ke backend Laravel + Sanctum.
 * Token di-simpan di localStorage["lpm:token"] (lihat src/services/api.ts).
 */
import { api, TOKEN_KEY, unwrap } from "./api";

export type ApiUser = {
  id: number;
  name: string;
  email: string;
  role: "admin" | "user";
};

export type LoginResponse = {
  user: ApiUser;
  token: string;
};

export const authApi = {
  login: async (email: string, password: string) => {
    const res = await api.post("/auth/login", { email, password });
    const data = unwrap<LoginResponse>(res.data);
    if (typeof window !== "undefined") {
      localStorage.setItem(TOKEN_KEY, data.token);
    }
    return data;
  },

  logout: async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      if (typeof window !== "undefined") localStorage.removeItem(TOKEN_KEY);
    }
  },

  me: async () => unwrap<ApiUser>((await api.get("/auth/me")).data),
};
