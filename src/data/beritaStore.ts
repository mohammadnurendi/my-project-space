/**
 * Shared mock store untuk Berita.
 * Sumber tunggal yang dipakai oleh AdminBerita dan halaman publik (Berita & BeritaDetail).
 * Saat backend sudah ada, ganti implementasinya jadi fetch ke API.
 */
import { useEffect, useState, useCallback } from "react";

export type BeritaItem = {
  id: string;
  judul: string;
  kategori: string;
  ringkasan: string;
  isi: string;
  penulis: string;
  tanggal: string;
  gambar: string;
  featured: boolean;
  tags: string[];
};

const STORAGE_KEY = "lpm:berita:v1";

const seed: BeritaItem[] = [
  {
    id: "BRT-001",
    judul: "LPM Itenas Sukses Laksanakan Audit Mutu Internal Semester Ganjil 2024/2025",
    kategori: "Audit",
    ringkasan:
      "Audit Mutu Internal (AMI) semester ganjil tahun akademik 2024/2025 telah dilaksanakan secara menyeluruh di seluruh unit kerja Itenas, mencakup 12 program studi dan 6 unit layanan.",
    isi: `Lembaga Penjaminan Mutu (LPM) Institut Teknologi Nasional Bandung (Itenas) telah berhasil melaksanakan Audit Mutu Internal (AMI) untuk semester ganjil tahun akademik 2024/2025 secara menyeluruh dan komprehensif.

Pelaksanaan AMI kali ini mencakup 12 program studi yang tersebar di seluruh fakultas di lingkungan Itenas, serta 6 unit layanan pendukung akademik. Kegiatan audit berlangsung selama dua minggu penuh, yakni dari tanggal 10 hingga 24 Oktober 2025.

**Cakupan dan Metodologi Audit**

Tim auditor yang terdiri dari 27 auditor internal terlatih melaksanakan audit dengan menggunakan standar dan instrumen yang telah ditetapkan dalam dokumen SPMI Itenas. Metodologi yang digunakan meliputi desk evaluation terhadap dokumen dan laporan kinerja, wawancara mendalam dengan pimpinan unit, observasi lapangan terhadap proses pembelajaran dan pelayanan, serta verifikasi data capaian standar mutu.

**Hasil dan Temuan**

Secara umum, hasil AMI semester ganjil 2024/2025 menunjukkan peningkatan yang signifikan dibandingkan periode sebelumnya. Sebanyak 9 dari 12 program studi berhasil memenuhi seluruh standar yang ditetapkan dengan kategori sangat baik.

**Tindak Lanjut dan Rekomendasi**

Seluruh temuan audit telah didokumentasikan dan akan ditindaklanjuti oleh masing-masing unit dalam bentuk Rencana Tindak Lanjut (RTL) yang harus diselesaikan dalam 30 hari kerja.`,
    penulis: "Tim LPM Itenas",
    tanggal: "2025-10-24",
    gambar: "https://images.unsplash.com/photo-1606761568499-6d2451b23c66?w=1200&auto=format&fit=crop",
    featured: true,
    tags: ["Audit", "AMI", "Mutu", "SPMI"],
  },
  {
    id: "BRT-002",
    judul: "Workshop Penyusunan Kurikulum Berbasis OBE bersama Seluruh Program Studi",
    kategori: "Kegiatan",
    ringkasan:
      "LPM Itenas menyelenggarakan workshop penyusunan kurikulum berbasis Outcome-Based Education (OBE) yang diikuti oleh seluruh ketua program studi dan tim kurikulum.",
    isi: `Lembaga Penjaminan Mutu (LPM) Itenas kembali menyelenggarakan workshop strategis dalam rangka pengembangan kurikulum berbasis Outcome-Based Education (OBE).

Workshop yang berlangsung selama dua hari penuh ini bertujuan untuk menyamakan pemahaman dan memperkuat kapasitas seluruh program studi dalam menyusun kurikulum yang berorientasi pada capaian pembelajaran.

**Narasumber dan Materi**

Workshop menghadirkan narasumber dari Direktorat Pembelajaran dan Kemahasiswaan Kemendikbudristek serta pakar pendidikan tinggi dari Universitas Gadjah Mada.

**Hasil Workshop**

Seluruh peserta berhasil menyusun draft rencana revisi kurikulum berbasis OBE untuk program studi masing-masing.`,
    penulis: "Divisi Akademik LPM",
    tanggal: "2025-10-18",
    gambar: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1200&auto=format&fit=crop",
    featured: true,
    tags: ["Workshop", "OBE", "Kurikulum"],
  },
  {
    id: "BRT-003",
    judul: "Itenas Raih Akreditasi Unggul dari BAN-PT untuk 8 Program Studi",
    kategori: "Prestasi",
    ringkasan:
      "Sebanyak 8 program studi di Institut Teknologi Nasional Bandung berhasil meraih akreditasi Unggul dari BAN-PT pada periode penilaian 2025.",
    isi: `Sebuah pencapaian membanggakan diraih Institut Teknologi Nasional Bandung (Itenas) pada tahun 2025. Sebanyak 8 program studi berhasil meraih predikat Akreditasi Unggul dari BAN-PT.

**Program Studi yang Meraih Akreditasi Unggul**

Teknik Sipil, Teknik Mesin, Teknik Elektro, Teknik Informatika, Arsitektur, Desain Produk, Manajemen, dan Teknik Industri.

**Peran LPM dalam Proses Akreditasi**

LPM Itenas memainkan peran sentral dalam mempersiapkan seluruh program studi menuju akreditasi Unggul.`,
    penulis: "Humas Itenas",
    tanggal: "2025-10-12",
    gambar: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&auto=format&fit=crop",
    featured: false,
    tags: ["Akreditasi", "BAN-PT", "Prestasi"],
  },
  {
    id: "BRT-004",
    judul: "Sosialisasi Standar Mutu Baru SPMI kepada Dosen dan Tendik",
    kategori: "Pengumuman",
    ringkasan:
      "LPM Itenas melaksanakan sosialisasi standar mutu terbaru dalam Sistem Penjaminan Mutu Internal kepada seluruh dosen dan tenaga kependidikan.",
    isi: `LPM Itenas telah melaksanakan rangkaian kegiatan sosialisasi Standar Mutu terbaru dalam Sistem Penjaminan Mutu Internal (SPMI).

**Latar Belakang Pembaruan Standar**

Pembaruan standar mutu SPMI Itenas dilakukan sebagai respons terhadap perubahan regulasi pendidikan tinggi.

**Jadwal Implementasi**

Implementasi standar mutu yang baru akan berlaku efektif mulai semester genap tahun akademik 2024/2025.`,
    penulis: "Tim LPM Itenas",
    tanggal: "2025-10-05",
    gambar: "https://images.unsplash.com/photo-1558008258-3256797b43f3?w=1200&auto=format&fit=crop",
    featured: false,
    tags: ["SPMI", "Sosialisasi", "Standar"],
  },
];

function load(): BeritaItem[] {
  if (typeof window === "undefined") return seed;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return seed;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return seed;
    return parsed as BeritaItem[];
  } catch {
    return seed;
  }
}

function save(list: BeritaItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  window.dispatchEvent(new CustomEvent("berita:changed"));
}

export function useBeritaStore() {
  const [list, setList] = useState<BeritaItem[]>(() => load());

  useEffect(() => {
    const handler = () => setList(load());
    window.addEventListener("berita:changed", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("berita:changed", handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  const update = useCallback((updater: (prev: BeritaItem[]) => BeritaItem[]) => {
    setList((prev) => {
      const next = updater(prev);
      save(next);
      return next;
    });
  }, []);

  return { list, update };
}

export function nextBeritaId(list: BeritaItem[]) {
  const max = list.reduce((m, b) => {
    const n = parseInt(b.id.replace(/\D/g, ""), 10);
    return Number.isFinite(n) ? Math.max(m, n) : m;
  }, 0);
  return `BRT-${String(max + 1).padStart(3, "0")}`;
}
