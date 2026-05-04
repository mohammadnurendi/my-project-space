/**
 * Service CRUD Berita.
 *
 * Endpoint Laravel:
 *   GET    /api/berita?q=&kategori=&featured=
 *   GET    /api/berita/{id}
 *   POST   /api/berita                  (multipart: judul, kategori, ringkasan, isi, penulis, tanggal, featured, tags[], gambar)
 *   PUT    /api/berita/{id}             (multipart via _method=PUT bila ada file)
 *   DELETE /api/berita/{id}
 */
import { api, postWithMethod, toFormData, unwrap } from "./api";

export type ApiBerita = {
  id: number;
  judul: string;
  slug: string;
  kategori: string;
  ringkasan: string;
  isi: string;
  penulis: string;
  tanggal: string;             // ISO
  gambar_url?: string;
  featured: boolean;
  tags: string[];
  created_at: string;
  updated_at: string;
};

export type BeritaInput = {
  judul: string;
  kategori: string;
  ringkasan: string;
  isi: string;
  penulis: string;
  tanggal: string;
  featured?: boolean;
  tags?: string[];
  gambar?: File;               // file gambar (opsional)
};

export const beritaApi = {
  list: async (params?: { q?: string; kategori?: string; featured?: boolean }) =>
    unwrap<ApiBerita[]>((await api.get("/berita", { params })).data),

  show: async (id: number) =>
    unwrap<ApiBerita>((await api.get(`/berita/${id}`)).data),

  create: async (input: BeritaInput) =>
    unwrap<ApiBerita>((await api.post("/berita", toFormData(input))).data),

  update: async (id: number, input: Partial<BeritaInput>) => {
    if (input.gambar instanceof File) {
      return unwrap<ApiBerita>(
        await postWithMethod(`/berita/${id}`, toFormData(input), "PUT")
      );
    }
    return unwrap<ApiBerita>((await api.put(`/berita/${id}`, input)).data);
  },

  remove: async (id: number) => {
    await api.delete(`/berita/${id}`);
  },
};
