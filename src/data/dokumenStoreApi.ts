/**
 * Adapter agar UI yang sudah memakai `useDokumenStore` (localStorage)
 * bisa langsung berbicara ke backend Laravel TANPA perubahan komponen.
 *
 * Aktifkan dengan env var di `.env.local`:
 *
 *   VITE_USE_API=true
 *   VITE_API_BASE_URL=http://127.0.0.1:8000/api
 *
 * Catatan:
 *  - ID di backend (number) di-stringify agar kompatibel dgn UI (string id).
 *  - File di-form-data-kan otomatis (PDF max 2MB divalidasi server).
 *  - Mutasi men-trigger reload menyeluruh agar state konsisten.
 */
import { useCallback, useEffect, useState } from "react";
import { kategoriApi, dokumenApi, revisiApi, type ApiDokumen, type ApiKategori, type ApiRevisi } from "@/services/dokumenApi";
import type {
  Cover, DocumentItem, DokumenData, Revision, DocStatus,
} from "@/data/dokumenStore";

const toCover = (k: ApiKategori): Cover => ({
  id: String(k.id),
  title: k.title,
  description: k.description,
  image: k.image_url,
  createdAt: k.created_at,
});

const toRevision = (r: ApiRevisi): Revision => ({
  id: String(r.id),
  version: r.version,
  fileName: r.file_name,
  fileDataUrl: r.file_url,
  alasanRevisi: r.alasan_revisi,
  uploadedAt: r.uploaded_at,
});

const toDocument = (d: ApiDokumen): DocumentItem => ({
  id: String(d.id),
  coverId: String(d.kategori_id),
  name: d.nama_dokumen,
  kegiatan: d.kegiatan,
  unit: d.unit,
  jenis: d.jenis_dokumen,
  status: d.status as DocStatus,
  createdAt: d.created_at,
  revisions: (d.revisions ?? (d.latest_revision ? [d.latest_revision] : [])).map(toRevision),
});

export function useDokumenStoreApi() {
  const [data, setData] = useState<DokumenData>({ covers: [], documents: [] });
  const [, setLoading] = useState(false);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const [k, d] = await Promise.all([kategoriApi.list(), dokumenApi.list()]);
      setData({ covers: k.map(toCover), documents: d.map(toDocument) });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void reload(); }, [reload]);

  /* ── Cover ── */
  const addCover = async (c: Omit<Cover, "id" | "createdAt"> & { imageFile?: File }) => {
    await kategoriApi.create({ title: c.title, description: c.description, image: c.imageFile });
    await reload();
  };
  const updateCover = async (id: string, p: Partial<Cover> & { imageFile?: File }) => {
    await kategoriApi.update(Number(id), { title: p.title, description: p.description, image: p.imageFile });
    await reload();
  };
  const removeCover = async (id: string) => {
    await kategoriApi.remove(Number(id));
    await reload();
  };

  /* ── Document ── */
  const addDocument = async (
    doc: Omit<DocumentItem, "id" | "createdAt" | "revisions"> & {
      initialRevision: Omit<Revision, "id" | "uploadedAt"> & { file?: File };
    },
  ) => {
    if (!doc.initialRevision.file) {
      throw new Error("File PDF wajib diisi untuk membuat dokumen baru.");
    }
    await dokumenApi.create({
      kategori_id: Number(doc.coverId),
      nama_dokumen: doc.name,
      jenis_dokumen: doc.jenis,
      kegiatan: doc.kegiatan,
      unit: doc.unit,
      status: doc.status,
      version: doc.initialRevision.version,
      file: doc.initialRevision.file,
    });
    await reload();
  };
  const updateDocument = async (id: string, p: Partial<DocumentItem>) => {
    await dokumenApi.update(Number(id), {
      kategori_id: p.coverId ? Number(p.coverId) : undefined,
      nama_dokumen: p.name,
      jenis_dokumen: p.jenis,
      kegiatan: p.kegiatan,
      unit: p.unit,
      status: p.status,
    });
    await reload();
  };
  const removeDocument = async (id: string) => {
    await dokumenApi.remove(Number(id));
    await reload();
  };

  /* ── Revision ── */
  const addRevision = async (
    docId: string,
    rev: Omit<Revision, "id" | "uploadedAt"> & { file?: File },
  ) => {
    if (!rev.file) throw new Error("File PDF revisi wajib diunggah.");
    await revisiApi.create(Number(docId), {
      version: rev.version,
      alasan_revisi: rev.alasanRevisi,
      file: rev.file,
    });
    await reload();
  };
  const removeRevision = async (docId: string, revId: string) => {
    await revisiApi.remove(Number(docId), Number(revId));
    await reload();
  };

  return {
    data,
    addCover, updateCover, removeCover,
    addDocument, updateDocument, removeDocument,
    addRevision, removeRevision,
  };
}

/** Aktif jika env `VITE_USE_API=true`. */
export const isApiMode = (): boolean =>
  String(import.meta.env.VITE_USE_API).toLowerCase() === "true";
