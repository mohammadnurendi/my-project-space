# LPM Itenas — Frontend

Frontend React + Vite untuk situs LPM Itenas. Disiapkan agar tersambung ke
backend Laravel (REST API + Sanctum).

## Setup lokal

```bash
git clone <repo>
cd <folder>
npm install
cp .env.example .env.local   # edit jika base URL berbeda
npm run dev
```

Frontend jalan di `http://localhost:5173` (atau `:8080` sesuai vite config).

## Variabel env

| Variabel | Default | Keterangan |
|---|---|---|
| `VITE_API_BASE_URL` | `http://127.0.0.1:8000/api` | Base URL backend Laravel |
| `VITE_USE_API` | `true` | `true` = panggil backend, `false` = mode mock localStorage |

## Status integrasi backend

| Modul | Status | Catatan |
|---|---|---|
| **Auth (login/logout/me)** | ✅ Tersambung | `src/context/AuthContext.tsx` → `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me`. Token disimpan di `localStorage["lpm:token"]`. |
| **Dokumen + Revisi (API layer)** | ✅ Siap | `src/services/dokumenApi.ts` + adapter `useDokumenStoreApi`. Halaman UI tinggal ganti hook dari `useDokumenStore` → `useDokumenStoreApi`. |
| **Berita (API layer)** | ✅ Siap | `src/services/beritaApi.ts`. Halaman masih pakai `useBeritaStore` (mock). |
| **Profil (Sejarah/VisiMisi/RoadMap/Tim)** | ✅ Siap | `src/services/profilApi.ts`. Halaman masih pakai `useXxxStore`. |
| **Halaman publik & admin** | ⚙️ Mock | Sekarang membaca dari `localStorage` dengan **data dummy sudah dikosongkan**. Migrasi tinggal swap hook ke versi API. |

Endpoint yang diharapkan dari backend Laravel:
- `POST /api/auth/login` → `{ user: { id, name, email, role }, token }`
- `POST /api/auth/logout`
- `GET  /api/auth/me`
- `GET/POST/PUT/DELETE /api/kategori` , `/api/dokumen` , `/api/dokumen/{id}/revisi`
- `GET/POST/PUT/DELETE /api/berita`
- `GET/PUT /api/profil/{sejarah|visi-misi|roadmap|tim}`

Detail lengkap ada di `BACKEND_PROMPT.md`.

## CORS

Pastikan Laravel mengizinkan origin frontend. Di `config/cors.php`:

```php
'paths' => ['api/*'],
'allowed_methods' => ['*'],
'allowed_origins' => ['http://localhost:5173', 'http://localhost:8080'],
'allowed_headers' => ['*'],
```
