/**
 * Mock store untuk konten "Profil": Sejarah, Visi & Misi, Road Map, Tim.
 * Disimpan di localStorage agar perubahan dari Admin terbaca di halaman publik.
 */
import { useEffect, useState, useCallback } from "react";

/* ─── Sejarah ─────────────────────────────────────────────── */
export type SejarahItem = { id: string; year: string; title: string; content: string };
export type SejarahData = {
  intro: string;
  events: SejarahItem[];
  legalTitle: string;
  legalIntro: string;
  legalTasks: string[];
  legalFooter: string;
};

const SEJARAH_DEFAULT: SejarahData = {
  intro:
    "Keberadaan Lembaga Penjaminan Mutu (LPM) dalam struktur organisasi Itenas telah ditetapkan sejak tahun 2003 dalam Statuta Itenas, sebagai tindak lanjut dari keberhasilan empat jurusan yaitu jurusan Teknik Industri, Teknik Sipil, Teknik Mesin dan Teknik Kimia dalam memperoleh hibah Technological and Professional Skills Development Sector Project (TPSDP) dari Dikti pada tahun 2002 dan 2003.",
  events: [
    { id: "s1", year: "2003", title: "Penetapan LPM dalam Statuta Itenas", content: "Keberadaan LPM dalam struktur organisasi Itenas ditetapkan dalam Statuta Itenas." },
    { id: "s2", year: "2005", title: "Pembentukan Resmi LPM", content: "Secara resmi LPM (dahulu UPM) dibentuk pada Juli 2005." },
    { id: "s3", year: "2006", title: "Hibah ISS-QA dari TPSDP", content: "Pada Juni 2006 sampai Juli 2007 LPM Itenas memperoleh Hibah ISS-QA dari TPSDP." },
    { id: "s4", year: "2016", title: "Perubahan Struktur Organisasi", content: "Struktur organisasi LPM diubah, terdiri dari Kepala LPM dan dua Wakil Kepala." },
  ],
  legalTitle: "Tugas & Wewenang Perguruan Tinggi",
  legalIntro:
    "Program penjaminan mutu di Itenas dilaksanakan berdasarkan Permenristekdikti No 62 tahun 2016, BAB III pasal 8 ayat 4 mengenai Tugas dan wewenang, yaitu:",
  legalTasks: [
    "Merencanakan, melaksanakan, mengevaluasi, mengendalikan, dan mengembangkan SPMI;",
    "Menyusun dokumen SPMI yang terdiri atas dokumen kebijakan SPMI, dokumen manual SPMI, dokumen standar dalam SPMI, dan dokumen formulir yang digunakan dalam SPMI;",
    "Membentuk unit penjaminan mutu atau mengintegrasikan SPMI pada manajemen perguruan tinggi;",
    "Mengelola Pangkalan Data Pendidikan Tinggi (PD Dikti) pada tingkat perguruan tinggi;",
  ],
  legalFooter: "- Permenristekdikti No 62 tahun 2016 BAB III pasal 8 ayat 4 mengenai Tugas dan wewenang",
};

/* ─── Visi & Misi ─────────────────────────────────────────── */
export type VisiMisiData = {
  visi: string;
  misi: string[];
  sasaran: string[];
};
const VISIMISI_DEFAULT: VisiMisiData = {
  visi:
    "Menjadi lembaga penjaminan mutu yang profesional, akuntabel dan selalu relevan dengan tuntutan perkembangan dunia pendidikan dan mampu membawa Itenas berperan aktif dalam pembangunan berkelanjutan di lingkup nasional, berlandaskan nilai nilai integritas, kualitas, dan inovasi yang tinggi.",
  misi: [
    "Mengembangkan dokumen Sistem Penjaminan Mutu Internal yang relevan dengan tuntutan nasional secara konsisten dan berkesinambungan",
    "Mendorong terwujudnya Sistem Penjaminan Mutu Internal sebagai budaya pada setiap aras di Itenas",
  ],
  sasaran: [
    "Tersusunnya dokumen SPMI berupa standar, manual, dan formulir : 100 standar",
    "Terlaksananya Audit Mutu Internal (AMI) pada semua unit kerja secara berkelanjutan",
    "Terpenuhinya standar pelayanan mahasiswa pada 20 laboratorium dan studio",
  ],
};

/* ─── Road Map ────────────────────────────────────────────── */
export type RoadMapItem = { id: string; period: string; title: string; description: string; active: boolean };
export type RoadMapData = {
  items: RoadMapItem[];
  ppepp: string[];
};
const ROADMAP_DEFAULT: RoadMapData = {
  items: [
    { id: "r1", period: "2014 – 2020", title: "Tahap Pengembangan Sistem Manajemen Mutu", description: "Tahap pengembangan Sistem Penjaminan Mutu secara bertahap dan berkesinambungan.", active: false },
    { id: "r2", period: "2021 – 2025", title: "Tahap Memantapkan Sistem Penjaminan Mutu", description: "Pelaksanaan SPMI di semua unit kerja, fokus penguatan SPMI berbasis riset dan standar internasional.", active: true },
    { id: "r3", period: "2026 – 2030", title: "Tahap Pencapaian Keunggulan Mutu Itenas", description: "SPMI berjalan sesuai falsafah, visi, misi Itenas dan ketentuan Ristekdikti, siap menggunakan standar mutu internasional.", active: false },
  ],
  ppepp: ["Standar", "Pelaksanaan", "Monitoring", "Evaluasi", "Audit Internal", "Peningkatan Mutu"],
};

/* ─── Tim ─────────────────────────────────────────────────
 * `levels` adalah daftar level struktur organisasi yang dinamis.
 * Level 1 idealnya berisi 1 anggota (Kepala). Level 2,3,4,...
 * bebas jumlah anggota. Admin bisa menambah / menghapus level.
 */
export type TimMember = { id: string; name: string; role: string; photo?: string };
export type TimLevel = { id: string; label: string; members: TimMember[] };
export type TimData = {
  levels: TimLevel[];
  pengelola: TimMember[];
  auditor: string[];
};
const TIM_DEFAULT: TimData = {
  levels: [
    {
      id: "lv-1",
      label: "Kepala LPM",
      members: [
        { id: "k1", name: "Ni Made Rai Ratih, S.T., M.Si", role: "Kepala Lembaga Penjaminan Mutu Itenas" },
      ],
    },
    {
      id: "lv-2",
      label: "Struktur Level 2",
      members: [
        { id: "l1", name: "Sri Lestari", role: "Administrasi Satuan Penjamin Mutu" },
        { id: "l2", name: "Kancitra Pharmawati, S.T., M.T\nTia Adelia Suryani, S.T., M.P.K\nIndrianawati, S.T., M.T.", role: "SPMF - Fakultas Teknik Sipil dan Perencanaan" },
        { id: "l3", name: "Dian Duhita Permata, S.T.M.T.\nAnwar Subkiman, S.Sn., M.Ds.\nMaharani Dian Permanasari, M. Ds.", role: "SPMF - Fakultas Arsitektur dan Desain" },
        { id: "l4", name: "Dyah Setyo Pertiwi, S.T., M.T., Ph.D\nFerry Hidayat, S.T., M.T.\nIwan Agustiawan, S.T., M.T.", role: "SPMF - Fakultas Teknologi Industri" },
      ],
    },
    {
      id: "lv-3",
      label: "Anggota Level 3",
      members: [
        { id: "l3a", name: "Andika Dwicahyo Aribowo, S.Ds., M.Ds. & Dr.rer.nat Dian Noor Handiani", role: "Anggota Lembaga Penjaminan Mutu Itenas" },
      ],
    },
  ],
  pengelola: Array.from({ length: 12 }, (_, i) => ({ id: `p${i + 1}`, name: "Muhammad Fulan, S.T.", role: "Kepala SPM Itenas" })),
  auditor: [
    "Aldrian Agusta, S. Sn., M. Ds", "Ali, S.T., M.T", "Ambar Harsono, Ir., M.T",
    "Andika Dwicahyo Aribowo, M.Ds.", "Aprilana, Ir., M.T", "Boyke Arief Taufik, Drs., M.Ds",
    "Budi Rahardjo, S. S., M.T", "Deddy Ismail, S. Sn., M. Ds", "Dewi Rosmala, S. Si., M.T",
    "Elkhasnet, Ir., M.T", "Fifi Herni Mustofa, S.T., M.T", "Iwan Agustiawan, Ir., M.T",
  ],
};

/* ─── Generic store factory ───────────────────────────────── */
function makeStore<T>(key: string, defaults: T) {
  function load(): T {
    if (typeof window === "undefined") return defaults;
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return defaults;
      return { ...defaults, ...JSON.parse(raw) } as T;
    } catch {
      return defaults;
    }
  }
  function save(v: T) {
    if (typeof window === "undefined") return;
    localStorage.setItem(key, JSON.stringify(v));
    window.dispatchEvent(new CustomEvent(`${key}:changed`));
  }

  return function useStore() {
    const [data, setData] = useState<T>(() => load());
    useEffect(() => {
      const h = () => setData(load());
      window.addEventListener(`${key}:changed`, h);
      window.addEventListener("storage", h);
      return () => {
        window.removeEventListener(`${key}:changed`, h);
        window.removeEventListener("storage", h);
      };
    }, []);
    const update = useCallback((updater: (prev: T) => T) => {
      setData((prev) => {
        const next = updater(prev);
        save(next);
        return next;
      });
    }, []);
    const reset = useCallback(() => {
      save(defaults);
      setData(defaults);
    }, []);
    return { data, update, reset };
  };
}

export const useSejarahStore = makeStore<SejarahData>("lpm:sejarah:v1", SEJARAH_DEFAULT);
export const useVisiMisiStore = makeStore<VisiMisiData>("lpm:visimisi:v1", VISIMISI_DEFAULT);
export const useRoadMapStore = makeStore<RoadMapData>("lpm:roadmap:v1", ROADMAP_DEFAULT);
/* v2 = struktur Tim dinamis (levels[]) */
export const useTimStore = makeStore<TimData>("lpm:tim:v2", TIM_DEFAULT);

/* Helper: convert a File ke data URL (base64) untuk disimpan di store. */
export const fileToDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = () => reject(r.error);
    r.readAsDataURL(file);
  });

export const newId = () => `id-${Math.random().toString(36).slice(2, 9)}`;
