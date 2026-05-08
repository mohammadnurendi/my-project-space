/**
 * Store Dokumen Pedoman dengan struktur:
 *   Cover (Judul / Pembatas, ada gambar)
 *     └─ Document (Isi dokumen)
 *           └─ Revision[] (riwayat revisi; revisi terbaru tampil pertama)
 *
 * Semua data disimpan di localStorage (mock). Hanya frontend.
 */
import { useCallback, useEffect, useState } from "react";

export type DocStatus = "Aktif" | "Tidak Aktif";

export type Revision = {
  id: string;
  version: string;          // contoh: "v2.0"
  fileName: string;         // nama file PDF
  fileSize?: number;        // bytes (opsional)
  fileDataUrl?: string;     // dataURL (opsional, mock storage)
  fileDownloadUrl?: string;  // URL khusus download (opsional, API storage)
  alasanRevisi: string;
  status: DocStatus;
  uploadedAt: string;       // ISO date
  uploadedBy?: string;
};

export type DocumentItem = {
  id: string;
  coverId: string;
  name: string;             // nama isi dokumen
  kegiatan: string;
  unit: string;
  jenis?: string;
  status: DocStatus;
  createdAt: string;
  /** Revisi[0] = revisi paling baru, Revisi[last] = versi awal */
  revisions: Revision[];
};

export type Cover = {
  id: string;
  title: string;            // judul / pembatas
  description?: string;
  image?: string;           // dataURL atau URL gambar cover
  createdAt: string;
};

export type DokumenData = {
  covers: Cover[];
  documents: DocumentItem[];
};

/* ─── Defaults ────────────────────────────────────────────── */
const now = () => new Date().toISOString();
const isoDate = (s: string) => new Date(s).toLocaleDateString("id-ID", {
  day: "numeric", month: "short", year: "numeric",
});

const DEFAULT: DokumenData = {
  covers: [],
  documents: [],
};

/* ─── Persistence ─────────────────────────────────────────── */
const KEY = "lpm:dokumen:v1";

function load(): DokumenData {
  if (typeof window === "undefined") return DEFAULT;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULT;
    return { ...DEFAULT, ...JSON.parse(raw) } as DokumenData;
  } catch {
    return DEFAULT;
  }
}
function save(v: DokumenData) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(v));
  window.dispatchEvent(new CustomEvent(`${KEY}:changed`));
}

/* ─── Hook ────────────────────────────────────────────────── */
export function useDokumenStore() {
  const [data, setData] = useState<DokumenData>(() => load());
  useEffect(() => {
    const h = () => setData(load());
    window.addEventListener(`${KEY}:changed`, h);
    window.addEventListener("storage", h);
    return () => {
      window.removeEventListener(`${KEY}:changed`, h);
      window.removeEventListener("storage", h);
    };
  }, []);

  const update = useCallback((updater: (prev: DokumenData) => DokumenData) => {
    setData((prev) => {
      const next = updater(prev);
      save(next);
      return next;
    });
  }, []);

  /* Cover ops */
  const addCover = (c: Omit<Cover, "id" | "createdAt">) =>
    update((d) => ({ ...d, covers: [{ ...c, id: newId("cv"), createdAt: now() }, ...d.covers] }));
  const updateCover = (id: string, p: Partial<Cover>) =>
    update((d) => ({ ...d, covers: d.covers.map((c) => (c.id === id ? { ...c, ...p } : c)) }));
  const removeCover = (id: string) =>
    update((d) => ({
      ...d,
      covers: d.covers.filter((c) => c.id !== id),
      documents: d.documents.filter((doc) => doc.coverId !== id),
    }));

  /* Document ops */
  const addDocument = (
    doc: Omit<DocumentItem, "id" | "createdAt" | "revisions"> & { initialRevision: Omit<Revision, "id" | "uploadedAt" | "status"> }
  ) =>
    update((d) => {
      const { initialRevision, ...rest } = doc;
      const newDoc: DocumentItem = {
        ...rest,
        id: newId("doc"),
        createdAt: now(),
        revisions: [{ status: "Aktif", ...initialRevision, id: newId("rv"), uploadedAt: now() }],
      };
      return { ...d, documents: [newDoc, ...d.documents] };
    });
  const updateDocument = (id: string, p: Partial<DocumentItem>) =>
    update((d) => ({ ...d, documents: d.documents.map((x) => (x.id === id ? { ...x, ...p } : x)) }));
  const removeDocument = (id: string) =>
    update((d) => ({ ...d, documents: d.documents.filter((x) => x.id !== id) }));

  /* Revision ops — revisi baru di-prepend (jadi index 0 = terbaru) */
  const addRevision = (docId: string, rev: Omit<Revision, "id" | "uploadedAt">) =>
    update((d) => ({
      ...d,
      documents: d.documents.map((x) =>
        x.id === docId
          ? { ...x, revisions: [{ status: "Aktif", ...rev, id: newId("rv"), uploadedAt: now() }, ...x.revisions] }
          : x
      ),
    }));
  const removeRevision = (docId: string, revId: string) =>
    update((d) => ({
      ...d,
      documents: d.documents.map((x) =>
        x.id === docId ? { ...x, revisions: x.revisions.filter((r) => r.id !== revId) } : x
      ),
    }));
  const updateRevision = (docId: string, revId: string, p: Partial<Revision>) =>
    update((d) => ({
      ...d,
      documents: d.documents.map((x) =>
        x.id === docId
          ? { ...x, revisions: x.revisions.map((r) => (r.id === revId ? { ...r, ...p } : r)) }
          : x
      ),
    }));

  return {
    data,
    addCover, updateCover, removeCover,
    addDocument, updateDocument, removeDocument,
    addRevision, updateRevision, removeRevision,
  };
}

/* ─── Helpers ─────────────────────────────────────────────── */
export function newId(prefix = "id"): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}
export const formatDate = (iso: string) => isoDate(iso);

export const fileToDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = () => reject(r.error);
    r.readAsDataURL(file);
  });

/** Revisi terbaru dari sebuah dokumen */
export const latestRevision = (doc: DocumentItem): Revision | undefined =>
  doc.revisions[0];

/** Hitung dokumen per cover */
export const countDocs = (data: DokumenData, coverId: string) =>
  data.documents.filter((d) => d.coverId === coverId).length;
