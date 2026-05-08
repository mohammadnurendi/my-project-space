/**
 * Axios instance terpusat untuk komunikasi dengan backend Laravel.
 *
 * Konfigurasi:
 *  - baseURL diambil dari env `VITE_API_BASE_URL`, fallback ke
 *    `http://127.0.0.1:8000/api` (default `php artisan serve`).
 *  - Header `Accept: application/json` agar Laravel selalu balas JSON
 *    (kalau tidak, Laravel bisa redirect 302 untuk error / validation).
 *  - Interceptor request: lampirkan Bearer token bila ada di localStorage.
 *  - Interceptor response: normalisasi error supaya mudah ditangani UI
 *    (status, message, errors validasi 422).
 *
 * Konvensi:
 *  - Untuk JSON biasa, gunakan `api.get/post/put/delete`.
 *  - Untuk upload file (multipart), pakai helper `toFormData()` lalu
 *    POST/`api.post(url, fd)` — axios otomatis set Content-Type.
 *  - Laravel sering butuh `_method=PUT` untuk update + file.
 *    Pakai helper `postWithMethod(url, fd, "PUT")`.
 */
import axios, { AxiosError, AxiosRequestConfig } from "axios";

const BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ??
  "http://127.0.0.1:8000/api";

export const TOKEN_KEY = "lpm:token";

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 20000,
  headers: {
    Accept: "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
  // withCredentials: true, // aktifkan jika pakai Sanctum cookie based
});

api.interceptors.request.use((config) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null;
  if (token && config.headers) {
    (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
  }
  return config;
});

export type ApiError = {
  status: number;
  message: string;
  /** Error validasi Laravel (response 422) */
  errors?: Record<string, string[]>;
  raw?: unknown;
};

api.interceptors.response.use(
  (res) => res,
  (error: AxiosError<any>) => {
    const status = error.response?.status ?? 0;
    const data = error.response?.data;
    const apiError: ApiError = {
      status,
      message:
        (data && (data.message || data.error)) ||
        error.message ||
        "Terjadi kesalahan koneksi ke server.",
      errors: data?.errors,
      raw: data,
    };
    return Promise.reject(apiError);
  }
);

/* ─── Helpers ───────────────────────────────────────────── */

/** Konversi object → FormData (untuk upload file). */
export function toFormData(payload: Record<string, unknown>): FormData {
  const fd = new FormData();
  Object.entries(payload).forEach(([k, v]) => {
    if (v === undefined || v === null) return;
    if (v instanceof File || v instanceof Blob) {
      fd.append(k, v);
    } else if (Array.isArray(v)) {
      // Kirim array sebagai indexed keys agar Laravel bisa parse.
      // Array kosong dikirim sebagai null supaya lolos rule nullable|array.
      if (v.length === 0) {
        fd.append(k, "");
      } else {
        v.forEach((item, i) => {
          if (item instanceof File || item instanceof Blob) {
            fd.append(`${k}[${i}]`, item);
          } else {
            fd.append(`${k}[${i}]`, String(item));
          }
        });
      }
    } else if (typeof v === "boolean") {
      // Boolean harus "1"/"0" agar Laravel boolean validation benar via FormData
      fd.append(k, v ? "1" : "0");
    } else if (typeof v === "object") {
      fd.append(k, JSON.stringify(v));
    } else {
      fd.append(k, String(v));
    }
  });
  return fd;
}

/**
 * Helper untuk PUT/PATCH/DELETE dengan multipart (Laravel quirk):
 * kirim sebagai POST + `_method=PUT`.
 */
export async function postWithMethod<T = unknown>(
  url: string,
  fd: FormData,
  method: "PUT" | "PATCH" | "DELETE" = "PUT",
  config?: AxiosRequestConfig
) {
  fd.append("_method", method);
  const res = await api.post<T>(url, fd, config);
  return res.data;
}

/** Ambil isi `data` standar Laravel (`{ data: ... }`) bila ada. */
export function unwrap<T>(payload: any): T {
  if (payload && typeof payload === "object" && "data" in payload) {
    return payload.data as T;
  }
  return payload as T;
}
