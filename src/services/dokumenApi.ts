/**
 * Service CRUD Dokumen Pedoman terhadap backend Laravel.
 *
 * Endpoint yang diasumsikan (silakan sesuaikan dgn route `api.php` Anda):
 *
 *   GET    /api/kategori                         → list kategori (cover)
 *   POST   /api/kategori                         → tambah kategori (multipart: title, description, image)
 *   PUT    /api/kategori/{id}                    → update kategori
 *   DELETE /api/kategori/{id}                    → hapus kategori
 *
 *   GET    /api/dokumen?kategori_id=...          → list dokumen
 *   POST   /api/dokumen                          → tambah dokumen + revisi pertama
 *   PUT    /api/dokumen/{id}                     → edit metadata dokumen
 *   DELETE /api/dokumen/{id}                     → hapus dokumen
 *
 *   GET    /api/dokumen/{id}/revisi              → riwayat revisi
 *   POST   /api/dokumen/{id}/revisi              → tambah revisi (multipart: version, alasan, file PDF)
 *   DELETE /api/dokumen/{id}/revisi/{revId}      → hapus revisi
 */
import { api, postWithMethod, toFormData, unwrap } from "./api";

/* ─── Tipe domain (mirror dari backend) ──────────────────── */
export type ApiKategori = {
  id: number;
  title: string;
  description?: string;
  image_url?: string;
  created_at: string;
};

export type ApiRevisi = {
  id: number;
  dokumen_id: number;
  version: string;
  alasan_revisi: string;
  file_url: string;
  file_download_url?: string;
  file_name: string;
  status?: "Aktif" | "Tidak Aktif";
  uploaded_at: string;
};

export type ApiDokumen = {
  id: number;
  kategori_id: number;
  nama_dokumen: string;
  jenis_dokumen?: string;
  kegiatan: string;
  unit: string;
  status: "Aktif" | "Tidak Aktif";
  created_at: string;
  /** Revisi terbaru (selalu ditampilkan pertama). */
  latest_revision?: ApiRevisi;
  revisions?: ApiRevisi[];
};

/* ─── Kategori (Cover) ───────────────────────────────────── */
export const kategoriApi = {
  list: async () => unwrap<ApiKategori[]>((await api.get("/kategori")).data),

  create: async (input: { title: string; description?: string; image?: File }) =>
    unwrap<ApiKategori>(
      (await api.post("/kategori", toFormData(input))).data
    ),

  update: async (
    id: number,
    input: { title?: string; description?: string; image?: File }
  ) => unwrap<ApiKategori>(await postWithMethod(`/kategori/${id}`, toFormData(input), "PUT")),

  remove: async (id: number) => {
    await api.delete(`/kategori/${id}`);
  },
};

/* ─── Dokumen ────────────────────────────────────────────── */
export const dokumenApi = {
  list: async (params?: { kategori_id?: number; q?: string }) =>
    unwrap<ApiDokumen[]>((await api.get("/dokumen", { params })).data),

  show: async (id: number) =>
    unwrap<ApiDokumen>((await api.get(`/dokumen/${id}`)).data),

  /** Tambah dokumen baru (sekaligus revisi pertama dengan file PDF). */
  create: async (input: {
    kategori_id: number;
    nama_dokumen: string;
    jenis_dokumen?: string;
    kegiatan: string;
    unit: string;
    status?: "Aktif" | "Tidak Aktif";
    version: string;
    file: File; // PDF, max 2MB (validasi server-side)
  }) => unwrap<ApiDokumen>((await api.post("/dokumen", toFormData(input))).data),

  /** Edit metadata dokumen (TANPA file — file lewat endpoint revisi). */
  update: async (
    id: number,
    input: Partial<{
      kategori_id: number;
      nama_dokumen: string;
      jenis_dokumen: string;
      kegiatan: string;
      unit: string;
      status: "Aktif" | "Tidak Aktif";
    }>
  ) => unwrap<ApiDokumen>((await api.put(`/dokumen/${id}`, input)).data),

  remove: async (id: number) => {
    await api.delete(`/dokumen/${id}`);
  },
};

/* ─── Revisi ─────────────────────────────────────────────── */
export const revisiApi = {
  list: async (dokumenId: number) =>
    unwrap<ApiRevisi[]>((await api.get(`/dokumen/${dokumenId}/revisi`)).data),

  /** Tambah revisi baru (PDF, max 2MB — divalidasi server). */
  create: async (
    dokumenId: number,
    input: { version: string; alasan_revisi: string; status?: "Aktif" | "Tidak Aktif"; file: File }
  ) =>
    unwrap<ApiRevisi>(
      (await api.post(`/dokumen/${dokumenId}/revisi`, toFormData(input))).data
    ),

  update: async (
    dokumenId: number,
    revId: number,
    input: { status: "Aktif" | "Tidak Aktif" }
  ) => unwrap<ApiRevisi>((await api.put(`/dokumen/${dokumenId}/revisi/${revId}`, input)).data),

  remove: async (dokumenId: number, revId: number) => {
    await api.delete(`/dokumen/${dokumenId}/revisi/${revId}`);
  },
};
