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

const seed: BeritaItem[] = [];

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
