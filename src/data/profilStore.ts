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
  items: [],
  ppepp: [],
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
  levels: [],
  pengelola: [],
  auditor: [],
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
