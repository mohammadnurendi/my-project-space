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
  intro: "",
  events: [],
  legalTitle: "",
  legalIntro: "",
  legalTasks: [],
  legalFooter: "",
};

/* ─── Visi & Misi ─────────────────────────────────────────── */
export type VisiMisiData = {
  visi: string;
  misi: string[];
  sasaran: string[];
};
const VISIMISI_DEFAULT: VisiMisiData = {
  visi: "",
  misi: [],
  sasaran: [],
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
