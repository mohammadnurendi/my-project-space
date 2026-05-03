/**
 * Hook contoh CRUD dokumen yang langsung memakai backend Laravel.
 * Pola: state lokal { data, loading, error } + auto-refetch setelah mutasi.
 *
 * Cara pakai di komponen:
 *
 *   const { kategori, loading, error, reload, addKategori } = useKategori();
 *
 * Komponen UI yang sekarang masih pakai `useDokumenStore` (localStorage)
 * tetap berfungsi. Migrasinya cukup ganti hook-nya satu per satu.
 */
import { useCallback, useEffect, useState } from "react";
import {
  ApiDokumen,
  ApiKategori,
  ApiRevisi,
  dokumenApi,
  kategoriApi,
  revisiApi,
} from "@/services/dokumenApi";
import type { ApiError } from "@/services/api";

/* ─── Kategori ───────────────────────────────────────────── */
export function useKategori() {
  const [kategori, setKategori] = useState<ApiKategori[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setKategori(await kategoriApi.list());
    } catch (e) {
      setError(e as ApiError);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  const addKategori = useCallback(
    async (input: Parameters<typeof kategoriApi.create>[0]) => {
      const created = await kategoriApi.create(input);
      await reload();
      return created;
    },
    [reload]
  );

  const updateKategori = useCallback(
    async (id: number, input: Parameters<typeof kategoriApi.update>[1]) => {
      const updated = await kategoriApi.update(id, input);
      await reload();
      return updated;
    },
    [reload]
  );

  const removeKategori = useCallback(
    async (id: number) => {
      await kategoriApi.remove(id);
      await reload();
    },
    [reload]
  );

  return { kategori, loading, error, reload, addKategori, updateKategori, removeKategori };
}

/* ─── Dokumen ────────────────────────────────────────────── */
export function useDokumen(params?: { kategori_id?: number; q?: string }) {
  const [dokumen, setDokumen] = useState<ApiDokumen[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setDokumen(await dokumenApi.list(params));
    } catch (e) {
      setError(e as ApiError);
    } finally {
      setLoading(false);
    }
  }, [params?.kategori_id, params?.q]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    void reload();
  }, [reload]);

  const addDokumen = useCallback(
    async (input: Parameters<typeof dokumenApi.create>[0]) => {
      const created = await dokumenApi.create(input);
      await reload();
      return created;
    },
    [reload]
  );

  const updateDokumen = useCallback(
    async (id: number, input: Parameters<typeof dokumenApi.update>[1]) => {
      const updated = await dokumenApi.update(id, input);
      await reload();
      return updated;
    },
    [reload]
  );

  const removeDokumen = useCallback(
    async (id: number) => {
      await dokumenApi.remove(id);
      await reload();
    },
    [reload]
  );

  const addRevisi = useCallback(
    async (id: number, input: Parameters<typeof revisiApi.create>[1]) => {
      const created = await revisiApi.create(id, input);
      await reload();
      return created;
    },
    [reload]
  );

  return {
    dokumen,
    loading,
    error,
    reload,
    addDokumen,
    updateDokumen,
    removeDokumen,
    addRevisi,
  };
}

/* ─── Revisi (riwayat per dokumen) ───────────────────────── */
export function useRevisi(dokumenId: number | null) {
  const [revisi, setRevisi] = useState<ApiRevisi[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const reload = useCallback(async () => {
    if (dokumenId == null) return;
    setLoading(true);
    setError(null);
    try {
      setRevisi(await revisiApi.list(dokumenId));
    } catch (e) {
      setError(e as ApiError);
    } finally {
      setLoading(false);
    }
  }, [dokumenId]);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { revisi, loading, error, reload };
}
