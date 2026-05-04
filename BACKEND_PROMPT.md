# Backend Prompt — LPM Itenas (Laravel 11 + Sanctum + MySQL)

> Salin seluruh file ini ke AI lain (Claude / GPT / dll) yang akan membuat **backend Laravel**. Tujuannya: backend wajib **100% sinkron** dengan frontend React yang sudah jadi (lihat folder `src/services/*` & `src/data/*`). Jangan mengarang field; ikuti kontrak di bawah ini persis.

---

## 0. Konteks Proyek

Aplikasi: **Website Lembaga Penjaminan Mutu (LPM) Institut Teknologi Nasional Bandung**.

Frontend sudah selesai (React 18 + Vite + TypeScript + shadcn/ui + Tailwind), memakai axios terpusat di `src/services/api.ts`. Frontend mengasumsikan backend Laravel dengan:

- Base URL: `http://127.0.0.1:8000/api`
- Selalu balas **JSON** (header `Accept: application/json` dipaksa dari client).
- Auth memakai **Laravel Sanctum (token-based)**, header `Authorization: Bearer <token>`.
- Validasi gagal → HTTP **422** dengan format Laravel default `{ message, errors: { field: [..] } }`.
- Resource sukses → bungkus `{ "data": ... }` (Laravel API Resource).

Tugas Anda: implementasikan **semua endpoint, model, migration, seeder, controller, FormRequest, policy, dan resource** yang diperlukan agar frontend langsung jalan tanpa perubahan kode di sisi React.

---

## 1. Stack & Setup yang Diharapkan

- PHP 8.2+, Laravel 11, MySQL 8 (atau MariaDB/PostgreSQL).
- `composer require laravel/sanctum`
- `php artisan storage:link` (file gambar/PDF disajikan via `storage/app/public`).
- Konfigurasi `config/cors.php`:
  ```php
  'paths' => ['api/*', 'sanctum/csrf-cookie'],
  'allowed_methods' => ['*'],
  'allowed_origins' => ['*'],            // dev; di prod kunci ke domain
  'allowed_headers' => ['*'],
  'supports_credentials' => false,        // kita pakai bearer token, bukan cookie
  ```
- File upload divalidasi:
  - Gambar berita / cover / foto tim: `image|mimes:jpg,jpeg,png,webp|max:2048` (2 MB)
  - Dokumen PDF: `mimes:pdf|max:2048`
- Semua route di-prefix `/api`. Public read endpoints boleh tanpa auth, semua mutasi (POST/PUT/DELETE) **wajib** auth + role `admin`.
- Role disimpan di kolom `users.role` enum `('admin','user')`. (Cukup, tidak perlu spatie/permission untuk scope ini.)

---

## 2. Konvensi Response

| Kasus | HTTP | Body |
|---|---|---|
| List | 200 | `{ "data": [ ... ] }` |
| Detail | 200 | `{ "data": { ... } }` |
| Create | 201 | `{ "data": { ... } }` |
| Update | 200 | `{ "data": { ... } }` |
| Delete | 204 | _(empty)_ |
| Validasi gagal | 422 | `{ "message": "...", "errors": { "field": ["..."] } }` |
| Unauth | 401 | `{ "message": "Unauthenticated." }` |
| Forbidden | 403 | `{ "message": "Forbidden." }` |
| Not found | 404 | `{ "message": "Not found." }` |

Tanggal selalu **ISO 8601 UTC** (`2026-04-12T08:30:00Z`). URL file selalu **absolut** (`Storage::disk('public')->url($path)` / `asset(...)`).

---

## 3. Auth (Sanctum)

### Endpoint
```
POST   /api/auth/login    body: { email, password }
POST   /api/auth/logout   (auth)
GET    /api/auth/me       (auth)
```

### Response `login` (200)
```json
{
  "data": {
    "user": { "id": 1, "name": "Admin LPM", "email": "admin@lpm.com", "role": "admin" },
    "token": "1|xxxxxxxxxxxx"
  }
}
```

### Seeder akun default (WAJIB ada agar match dengan frontend)
- `admin@lpm.com` / `123456` → role `admin`
- `user@lpm.com`  / `123456` → role `user`

Frontend menyimpan token di `localStorage["lpm:token"]` dan akan kirim `Authorization: Bearer <token>` di setiap request.

---

## 4. Modul: BERITA

Mirror tipe `ApiBerita` di `src/services/beritaApi.ts`.

### Tabel `berita`
| Kolom | Tipe | Catatan |
|---|---|---|
| id | bigint PK | |
| judul | string(255) | required |
| slug | string(255) unique | auto dari judul |
| kategori | string(100) | required |
| ringkasan | text | required |
| isi | longText | required (markdown) |
| penulis | string(150) | required |
| tanggal | date | required |
| gambar | string nullable | path di disk `public` |
| featured | boolean default false | |
| tags | json | array of string |
| timestamps | | |

### Endpoint
```
GET    /api/berita?q=&kategori=&featured=    (public)
GET    /api/berita/{id}                       (public)
POST   /api/berita                            (admin, multipart)
PUT    /api/berita/{id}                       (admin; multipart pakai _method=PUT bila ganti gambar)
DELETE /api/berita/{id}                       (admin)
```

### Validasi (`StoreBeritaRequest`)
```php
'judul'     => 'required|string|max:255',
'kategori'  => 'required|string|max:100',
'ringkasan' => 'required|string',
'isi'       => 'required|string',
'penulis'   => 'required|string|max:150',
'tanggal'   => 'required|date',
'featured'  => 'sometimes|boolean',
'tags'      => 'nullable|array',
'tags.*'    => 'string|max:50',
'gambar'    => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
```

### Resource (sesuai tipe `ApiBerita`)
```json
{
  "id": 1,
  "judul": "...",
  "slug": "...",
  "kategori": "Audit",
  "ringkasan": "...",
  "isi": "...",
  "penulis": "Tim LPM Itenas",
  "tanggal": "2025-10-24",
  "gambar_url": "http://127.0.0.1:8000/storage/berita/abc.jpg",
  "featured": true,
  "tags": ["AMI","SPMI"],
  "created_at": "2025-10-24T08:00:00Z",
  "updated_at": "2025-10-24T08:00:00Z"
}
```

### Seeder
Pakai 4 berita awal yang sama persis dengan `seed` di `src/data/beritaStore.ts` (judul, ringkasan, isi, kategori, tanggal, tags, featured).

---

## 5. Modul: DOKUMEN PEDOMAN (Kategori → Dokumen → Revisi)

Mirror tipe di `src/services/dokumenApi.ts` (`ApiKategori`, `ApiDokumen`, `ApiRevisi`).

### Tabel
**`kategori_dokumen`**: `id`, `title (unique)`, `description?`, `image (path)?`, `timestamps`.

**`dokumen`**:
- `id`, `kategori_id (FK kategori_dokumen, onDelete cascade)`,
- `nama_dokumen`, `jenis_dokumen?`, `kegiatan`, `unit`,
- `status enum('Aktif','Revisi','Arsip') default 'Aktif'`,
- `timestamps`.

**`dokumen_revisi`**:
- `id`, `dokumen_id (FK dokumen, onDelete cascade)`,
- `version` (string, mis. `v2.0`), `alasan_revisi` (text),
- `file_path` (string), `file_name` (string), `file_size` (int nullable),
- `uploaded_at` (timestamp), `uploaded_by (FK users nullable)`,
- `timestamps`.

### Endpoint
```
GET    /api/kategori                              (public)
POST   /api/kategori                              (admin, multipart)
PUT    /api/kategori/{id}                         (admin; client kirim POST + _method=PUT)
DELETE /api/kategori/{id}                         (admin)

GET    /api/dokumen?kategori_id=&q=               (public)
GET    /api/dokumen/{id}                          (public)
POST   /api/dokumen                               (admin, multipart) — sekaligus revisi pertama
PUT    /api/dokumen/{id}                          (admin, JSON; tanpa file)
DELETE /api/dokumen/{id}                          (admin)

GET    /api/dokumen/{id}/revisi                   (public)
POST   /api/dokumen/{id}/revisi                   (admin, multipart)
DELETE /api/dokumen/{id}/revisi/{revId}           (admin)
```

### Validasi
**Kategori (store):**
```php
'title' => 'required|string|max:150|unique:kategori_dokumen,title',
'description' => 'nullable|string|max:1000',
'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
```

**Dokumen (store):**
```php
'kategori_id'   => 'required|exists:kategori_dokumen,id',
'nama_dokumen'  => 'required|string|max:200',
'jenis_dokumen' => 'nullable|string|max:100',
'kegiatan'      => 'required|string|max:200',
'unit'          => 'required|string|max:150',
'status'        => 'sometimes|in:Aktif,Revisi,Arsip',
'version'       => 'required|string|max:20',
'file'          => 'required|file|mimes:pdf|max:2048',
```

**Revisi (store):**
```php
'version'       => 'required|string|max:20',
'alasan_revisi' => 'required|string|max:500',
'file'          => 'required|file|mimes:pdf|max:2048',
```

### Aturan bisnis revisi
- Saat **POST `/dokumen`**, langsung buat 1 baris di `dokumen_revisi` dengan `version` & `file` dari request → ini revisi awal.
- Saat **POST `/dokumen/{id}/revisi`**, ubah `dokumen.status = 'Revisi'` dan tambah baris baru.
- `dokumen.latest_revision` di response = revisi dengan `uploaded_at` terbaru (urut `desc`).
- `dokumen.revisions` (di `GET /dokumen/{id}` saja) = full array desc by `uploaded_at`.

### Resource — `ApiDokumen`
```json
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
    "file_url": "http://127.0.0.1:8000/storage/dokumen/abc.pdf",
    "file_name": "pedoman-spmi-2025-rev2.pdf",
    "uploaded_at": "2026-04-20T10:00:00Z"
  },
  "revisions": [ ... ]   // hanya pada endpoint show()
}
```

### Seeder
3 kategori (`Pedoman SPMI`, `Standar & Manual Mutu`, `Formulir & SOP`) dan 4 dokumen awal — sama dengan `DEFAULT` di `src/data/dokumenStore.ts`. Untuk file PDF dummy: copy 1 pdf placeholder di `database/seeders/files/dummy.pdf` dan re-use.

---

## 6. Modul: PROFIL (Sejarah / Visi-Misi / Road Map / Tim)

Frontend menyimpan tiap halaman profil sebagai **dokumen JSON tunggal**. Karena strukturnya nested & sering berubah, paling sederhana: buat **satu tabel `profil_pages`** dengan kolom `key (unique)` & `value (json)`.

### Tabel `profil_pages`
| key | value |
|---|---|
| `sejarah`    | JSON sesuai `SejarahData`    |
| `visi_misi`  | JSON sesuai `VisiMisiData`   |
| `roadmap`    | JSON sesuai `RoadMapData`    |
| `tim`        | JSON sesuai `TimData`        |

### Endpoint
```
GET  /api/profil/sejarah          (public)
PUT  /api/profil/sejarah          (admin) body = SejarahData
GET  /api/profil/visi-misi        (public)
PUT  /api/profil/visi-misi        (admin)
GET  /api/profil/roadmap          (public)
PUT  /api/profil/roadmap          (admin)
GET  /api/profil/tim              (public)
PUT  /api/profil/tim              (admin)

POST /api/profil/tim/upload       (admin, multipart: file=image)
                                   → 200 { "data": { "url": "https://.../storage/tim/uuid.jpg" } }
```

### Bentuk JSON wajib (sumber kebenaran ada di `src/data/profilStore.ts`)

**SejarahData**
```ts
{
  intro: string;
  events: { id: string; year: string; title: string; content: string }[];
  legalTitle: string;
  legalIntro: string;
  legalTasks: string[];
  legalFooter: string;
}
```

**VisiMisiData**
```ts
{ visi: string; misi: string[]; sasaran: string[] }
```

**RoadMapData**
```ts
{
  items: { id: string; period: string; title: string; description: string; active: boolean }[];
  ppepp: string[];
}
```

**TimData**
```ts
{
  levels: {
    id: string;            // mis. "lv-1"
    label: string;         // mis. "Kepala LPM"
    members: { id: string; name: string; role: string; photo?: string /* URL absolut */ }[];
  }[];
  pengelola: { id: string; name: string; role: string; photo?: string }[];
  auditor: string[];
}
```

### Validasi PUT
Validasi minimal: pastikan body adalah objek dan field utama bertipe array/string sesuai schema. Contoh untuk `tim`:
```php
'levels' => 'required|array',
'levels.*.id' => 'required|string',
'levels.*.label' => 'required|string|max:100',
'levels.*.members' => 'required|array',
'levels.*.members.*.id' => 'required|string',
'levels.*.members.*.name' => 'required|string|max:200',
'levels.*.members.*.role' => 'required|string|max:200',
'levels.*.members.*.photo' => 'nullable|string|url',
'pengelola' => 'array',
'auditor' => 'array',
'auditor.*' => 'string',
```

### Upload foto tim
```php
// POST /api/profil/tim/upload
'file' => 'required|image|mimes:jpg,jpeg,png,webp|max:2048',

$path = $request->file('file')->store('tim', 'public');
return response()->json(['data' => ['url' => Storage::disk('public')->url($path)]]);
```
Frontend lalu menyimpan `url` itu ke field `photo` saat memanggil `PUT /profil/tim`.

### Seeder
Isi tabel `profil_pages` dengan 4 row default — value-nya copy dari `SEJARAH_DEFAULT`, `VISIMISI_DEFAULT`, `ROADMAP_DEFAULT`, `TIM_DEFAULT` di `src/data/profilStore.ts`.

---

## 7. Otorisasi

- `POST/PUT/DELETE` di semua modul → middleware `auth:sanctum` + gate `is_admin` (`fn($u) => $u->role === 'admin'`).
- `GET` semua public.
- Login & logout: `auth:sanctum` hanya untuk logout & me.

Contoh route group:
```php
Route::middleware(['auth:sanctum','can:admin'])->group(function () {
    Route::apiResource('berita', BeritaController::class)->except(['index','show']);
    Route::apiResource('kategori', KategoriController::class)->except(['index','show']);
    Route::apiResource('dokumen', DokumenController::class)->except(['index','show']);
    Route::post('dokumen/{dokumen}/revisi', [RevisiController::class, 'store']);
    Route::delete('dokumen/{dokumen}/revisi/{revisi}', [RevisiController::class, 'destroy']);
    Route::put('profil/{key}', [ProfilController::class, 'update'])->whereIn('key',['sejarah','visi-misi','roadmap','tim']);
    Route::post('profil/tim/upload', [ProfilController::class, 'uploadFoto']);
});
```

---

## 8. Detail Implementasi yang Sering Bikin Bug

1. **Multipart + PUT**: Laravel tidak parse body PUT multipart. Frontend MEMANG selalu kirim sebagai `POST` + field `_method=PUT` (lihat `src/services/api.ts → postWithMethod`). Pastikan route PUT-nya jalan via `Route::post(...)` *atau* `apiResource` (Laravel auto-handle `_method`).
2. **CORS**: harus ekspos header `Authorization` (default sudah).
3. **Validation 422**: jangan ubah format Laravel; frontend baca `error.errors`.
4. **File URL absolut**: jangan kirim path relatif; gunakan `Storage::disk('public')->url($path)` atau `asset('storage/'.$path)`.
5. **Tanggal**: pakai `$casts = ['tanggal' => 'date:Y-m-d', 'tags' => 'array']` di Model Berita.
6. **Soft delete tidak perlu** kecuali diminta — cukup hard delete.
7. **Cascade delete**: hapus kategori → hapus semua dokumen + file PDF + revisi (pakai event `deleting` model untuk bersihkan file di disk).
8. **Slug Berita**: gunakan `Str::slug($judul).'-'.Str::random(4)` agar unik.
9. **Pagination**: untuk awal, kembalikan **flat array** (tanpa pagination) — frontend belum pakai. Boleh di-add kemudian dengan format `{ data, meta, links }`.

---

## 9. Deliverables yang Saya Harapkan

1. Project Laravel 11 lengkap (`composer install` siap jalan).
2. `.env.example` lengkap (`DB_*`, `APP_URL`, `FILESYSTEM_DISK=public`, `SANCTUM_STATEFUL_DOMAINS=`).
3. Migrations + Seeders + Factories.
4. FormRequest untuk tiap aksi store/update.
5. API Resource untuk tiap model.
6. Controller tipis (logika di service / model bila perlu).
7. Routes di `routes/api.php` sesuai daftar di atas — **persis**.
8. Sanctum aktif, gate `admin` terdaftar di `AuthServiceProvider`.
9. README backend berisi: cara `php artisan migrate --seed`, cara test login admin, dan curl contoh untuk tiap endpoint utama.

---

## 10. Test Acceptance (harus lulus semua)

```bash
# 1. Login admin
curl -X POST http://127.0.0.1:8000/api/auth/login \
  -H "Accept: application/json" \
  -d "email=admin@lpm.com&password=123456"

# 2. List berita publik
curl http://127.0.0.1:8000/api/berita -H "Accept: application/json"

# 3. Tambah kategori (admin)
curl -X POST http://127.0.0.1:8000/api/kategori \
  -H "Accept: application/json" -H "Authorization: Bearer <TOKEN>" \
  -F "title=Pedoman Baru" -F "description=desc"

# 4. Tambah dokumen + revisi pertama
curl -X POST http://127.0.0.1:8000/api/dokumen \
  -H "Accept: application/json" -H "Authorization: Bearer <TOKEN>" \
  -F "kategori_id=1" -F "nama_dokumen=Pedoman X" \
  -F "kegiatan=Audit" -F "unit=LPM" -F "version=v1.0" \
  -F "file=@/path/to/file.pdf"

# 5. Update profil sejarah (JSON penuh)
curl -X PUT http://127.0.0.1:8000/api/profil/sejarah \
  -H "Accept: application/json" -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{"intro":"...","events":[],"legalTitle":"...","legalIntro":"...","legalTasks":[],"legalFooter":"..."}'
```

Setelah semua hijau, frontend tinggal di-set:
```
VITE_API_BASE_URL=http://127.0.0.1:8000/api
VITE_USE_API=true
```
dan langsung jalan tanpa modifikasi.
