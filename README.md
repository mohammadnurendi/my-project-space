# Frontend LPM Itenas

Frontend React + Vite untuk portal Lembaga Penjaminan Mutu Itenas.

## Prasyarat

- Node.js 20+
- npm
- Backend Laravel LPM berjalan dan dapat diakses dari browser

## Setup Lokal

```bash
npm install
cp .env.example .env.local
npm run dev
```

Atur `.env.local` sesuai alamat backend:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api
VITE_USE_API=true
```

## Build Production

```bash
npm run build
```

Hasil build tersedia di folder `dist/`.

## Catatan Deployment

- Pastikan `VITE_API_BASE_URL` mengarah ke URL API production.
- Pastikan konfigurasi CORS backend mengizinkan domain frontend.
- Login menggunakan akun yang dibuat melalui backend/admin, bukan akun bawaan dari kode.
