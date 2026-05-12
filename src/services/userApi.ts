import { api, unwrap } from "./api";

export type ApiAccount = {
  id: number;
  name: string;
  email: string;
  role: "admin" | "user";
  category_ids: number[];
  created_at?: string;
  updated_at?: string;
};

export type AccountInput = {
  name: string;
  email: string;
  role: "admin" | "user";
  password?: string;
  category_ids?: number[];
};

export const userApi = {
  list: async () => unwrap<ApiAccount[]>((await api.get("/users")).data),

  create: async (input: AccountInput & { password: string }) =>
    unwrap<ApiAccount>((await api.post("/users", input)).data),

  update: async (id: number, input: AccountInput) =>
    unwrap<ApiAccount>((await api.put(`/users/${id}`, input)).data),

  remove: async (id: number) => {
    await api.delete(`/users/${id}`);
  },
};
