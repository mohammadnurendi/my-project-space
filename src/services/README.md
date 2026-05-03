# Integrasi Frontend ↔ Backend Laravel

Dokumen ini menjelaskan layer integrasi yang sudah dibuat. Mode demo
(`localStorage` via `useDokumenStore`) tetap berjalan apa adanya.

## Setup

1. Pasang env di `.env.local` (root project):

   ```
   VITE_API_BASE_URL=http://127.0.0.1:8000/api
   VITE_USE_API=true
   ```

2. Pastikan Laravel mengizinkan CORS dari origin Lovable preview / `localhost:5173`.
   Di `config/cors.php`:

   ```php
   'paths' => ['api/*'],
   'allowed_methods' => ['*'],
   'allowed_origins' => ['*'],
   'allowed_headers' => ['*'],
   ```

3. Untuk auth Sanctum berbasis token, simpan token setelah login ke
   `localStorage["lpm:token"]` — interceptor akan otomatis melampirkan
   `Authorization: Bearer …`.

## File

| File | Fungsi |
|---|---|
| `src/services/api.ts` | Instance axios + interceptor + helper FormData |
| `src/services/dokumenApi.ts` | CRUD `kategori`, `dokumen`, `revisi` ke Laravel |
| `src/hooks/useDokumenApi.ts` | Hooks `{ data, loading, error, reload }` |
| `src/data/dokumenStoreApi.ts` | Adapter dgn signature mirip `useDokumenStore` |

## Endpoint yang diharapkan di Laravel

```
GET    /api/kategori
POST   /api/kategori                       (multipart: title, description, image)
PUT    /api/kategori/{id}                  (kirim sebagai POST + _method=PUT)
DELETE /api/kategori/{id}

GET    /api/dokumen?kategori_id=...
POST   /api/dokumen                        (multipart: kategori_id, nama_dokumen, jenis_dokumen, kegiatan, unit, status, version, file)
PUT    /api/dokumen/{id}                   (JSON, tanpa file)
DELETE /api/dokumen/{id}

GET    /api/dokumen/{id}/revisi
POST   /api/dokumen/{id}/revisi            (multipart: version, alasan_revisi, file)
DELETE /api/dokumen/{id}/revisi/{revId}
```

Validasi server-side disarankan:

```php
'file' => 'required|mimes:pdf|max:2048', // 2MB
```

## Migrasi UI dari localStorage → API

Halaman `AdminDokumen.tsx` & `Dokumen.tsx` sekarang masih pakai
`useDokumenStore`. Untuk pindah ke API:

```diff
- import { useDokumenStore } from "@/data/dokumenStore";
+ import { useDokumenStoreApi } from "@/data/dokumenStoreApi";
- const store = useDokumenStore();
+ const store = useDokumenStoreApi();
```

Pada dialog **Tambah Dokumen / Revisi**, JANGAN lagi konversi `File` ke
dataURL. Kirim `File` mentahnya:

```diff
- let fileDataUrl: string | undefined;
- if (file) fileDataUrl = await fileToDataUrl(file);
- store.addDocument({
-   ...payload,
-   initialRevision: { ...payload.initialRevision, fileName: file?.name, fileDataUrl },
- });
+ await store.addDocument({
+   ...payload,
+   initialRevision: { ...payload.initialRevision, file },
+ });
```

Karena fungsi adapter `async`, bungkus dengan `try/catch`:

```ts
try {
  await store.addDocument(payload);
  toast.success("Dokumen ditambahkan");
} catch (e: any) {
  toast.error(e.message ?? "Gagal menyimpan", {
    description: e.errors ? Object.values(e.errors).flat().join("\n") : undefined,
  });
}
```

## Contoh response API yang diharapkan

```json
// GET /api/dokumen
{
  "data": [
    {
      "id": 1,
      "kategori_id": 2,
      "nama_dokumen": "Pedoman SPMI 2025",
      "jenis_dokumen": "Pedoman",
      "kegiatan": "Audit Mutu Internal",
      "unit": "LPM",
      "status": "Aktif",
      "created_at": "2026-04-12T08:30:00Z",
      "latest_revision": {
        "id": 12, "dokumen_id": 1, "version": "v2.0",
        "alasan_revisi": "Penyesuaian regulasi",
        "file_url": "https://api.example.com/storage/dokumen/abc.pdf",
        "file_name": "pedoman-spmi-2025-rev2.pdf",
        "uploaded_at": "2026-04-20T10:00:00Z"
      }
    }
  ]
}
```

## Kesalahan umum yang sudah dicegah

| Sebelumnya | Sekarang |
|---|---|
| Laravel balas HTML 302 ketika error | Header `Accept: application/json` dipaksa |
| `axios.put` + multipart selalu gagal | Pakai `postWithMethod(..., "PUT")` |
| Error 422 hanya tampil sebagai "Bad Request" | Interceptor expose `error.errors` per-field |
| Token disimpan tidak konsisten antar request | Interceptor baca `localStorage["lpm:token"]` |
| Refresh manual setelah POST/PUT/DELETE | `reload()` otomatis di tiap mutasi adapter |
