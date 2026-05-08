/**
 * Service CRUD Berita.
 *
 * Endpoint Laravel:
 *   GET    /api/berita?q=&kategori=&featured=
 *   GET    /api/berita/{id}
 *   POST   /api/berita                  (multipart: judul, kategori, ringkasan, isi, penulis, tanggal, featured, tags[], gambar, gambar_lain[])
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
  gambar_urls?: string[];
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
  gambar_lain?: File[];         // foto tambahan, total foto maks 3
};

export const beritaApi = {
  list: async (params?: { q?: string; kategori?: string; featured?: boolean }) =>
    unwrap<ApiBerita[]>((await api.get("/berita", { params })).data),

  show: async (id: number) =>
    unwrap<ApiBerita>((await api.get(`/berita/${id}`)).data),

  // Selalu kirim multipart/form-data agar gambar dan boolean featured terkirim dengan benar
  create: async (input: BeritaInput) =>
    unwrap<ApiBerita>((await api.post("/berita", toFormData(input as unknown as Record<string, unknown>))).data),

  // Selalu gunakan _method=PUT via FormData agar boolean dan file konsisten
  update: async (id: number, input: Partial<BeritaInput>) =>
    unwrap<ApiBerita>(
      await postWithMethod(`/berita/${id}`, toFormData(input as unknown as Record<string, unknown>), "PUT")
    ),

  remove: async (id: number) => {
    await api.delete(`/berita/${id}`);
  },
};
