import { useMemo, useRef, useState } from "react";
import {
  Plus, Search, FileText, Pencil, Trash2, Download, Eye,
  UploadCloud, X, CheckCircle2, AlertCircle, GitBranch,
  ArrowLeft, BookMarked, Image as ImageIcon, History, FilePlus2,
  Calendar, Layers,
} from "lucide-react";
import { toast } from "sonner";
import AdminLayout from "@/components/AdminLayout";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  useDokumenStoreApi,
} from "@/data/dokumenStoreApi";
import { TOKEN_KEY, type ApiError } from "@/services/api";
import {
  formatDate, latestRevision, countDocs,
  type Cover, type DocumentItem, type DocStatus, type Revision,
} from "@/data/dokumenStore";

const STATUS_OPTIONS: DocStatus[] = ["Aktif", "Tidak Aktif"];

async function openRevisionFile(rev: Revision, download = false) {
  const url = download ? (rev.fileDownloadUrl ?? rev.fileDataUrl) : rev.fileDataUrl;
  if (!url) {
    toast("URL tidak tersedia");
    return;
  }

  const token = localStorage.getItem(TOKEN_KEY);
  const res = await fetch(url, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

  if (!res.ok) {
    toast.error("File tidak bisa dibuka");
    return;
  }

  const blobUrl = URL.createObjectURL(await res.blob());
  if (download) {
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = rev.fileName;
    a.click();
  } else {
    window.open(blobUrl, "_blank");
  }
}

/* ─────────────────────────────────────────────────────────── */

type View =
  | { kind: "covers" }
  | { kind: "docs"; coverId: string }
  | { kind: "doc"; docId: string };

const AdminDokumen = () => {
  const store = useDokumenStoreApi();
  const { data } = store;

  const [view, setView] = useState<View>({ kind: "covers" });
  const [query, setQuery] = useState("");

  /* dialog state */
  const [coverDlg, setCoverDlg] = useState<{ open: boolean; editing?: Cover }>({ open: false });
  const [docDlg, setDocDlg] = useState<{ open: boolean; coverId?: string; editing?: DocumentItem }>({ open: false });
  const [revDlg, setRevDlg] = useState<{ open: boolean; docId?: string }>({ open: false });
  const [deleteDlg, setDeleteDlg] = useState<{ kind: "cover" | "doc" | "rev"; id: string; parentId?: string } | null>(null);

  const showApiError = (title: string, error: unknown) => {
    const apiErr = error as ApiError;
    const validation = apiErr.errors
      ? Object.values(apiErr.errors).flat().filter(Boolean).join(" ")
      : undefined;

    toast.error(title, {
      description: validation || apiErr.message || "Terjadi kesalahan saat menghubungi server.",
    });
  };

  const currentCover = view.kind === "docs" ? data.covers.find((c) => c.id === view.coverId) : undefined;
  const currentDoc = view.kind === "doc" ? data.documents.find((d) => d.id === view.docId) : undefined;
  const currentDocCover = currentDoc ? data.covers.find((c) => c.id === currentDoc.coverId) : undefined;

  const filteredCovers = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return data.covers;
    return data.covers.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        (c.description ?? "").toLowerCase().includes(q),
    );
  }, [data.covers, query]);
  const filteredDocs = useMemo(() => {
    if (view.kind !== "docs") return [];
    const base = data.documents.filter((d) => d.coverId === view.coverId);
    const q = query.trim().toLowerCase();
    if (!q) return base;
    return base.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.kegiatan.toLowerCase().includes(q) ||
        d.unit.toLowerCase().includes(q) ||
        (d.jenis ?? "").toLowerCase().includes(q),
    );
  }, [data.documents, view, query]);

  /* ── Delete handler ─── */
  const handleDelete = async () => {
    if (!deleteDlg) return;
    try {
      if (deleteDlg.kind === "cover") {
        await store.removeCover(deleteDlg.id);
        toast.success("Kategori dihapus", { description: "Termasuk semua dokumen di dalamnya." });
      } else if (deleteDlg.kind === "doc") {
        await store.removeDocument(deleteDlg.id);
        toast.success("Dokumen dihapus");
        if (view.kind === "doc" && view.docId === deleteDlg.id) {
          setView({ kind: "docs", coverId: deleteDlg.parentId! });
        }
      } else if (deleteDlg.kind === "rev") {
        await store.removeRevision(deleteDlg.parentId!, deleteDlg.id);
        toast.success("Revisi dihapus");
      }
      setDeleteDlg(null);
    } catch (error) {
      showApiError("Gagal menghapus data", error);
    }
  };

  /* ─── Header configuration ─── */
  const headerRight =
    view.kind === "covers" ? (
      <Button onClick={() => setCoverDlg({ open: true })} className="rounded-xl shadow-md shadow-primary/20 gap-2">
        <Plus className="w-4 h-4" />Tambah Kategori
      </Button>
    ) : view.kind === "docs" ? (
      <Button onClick={() => setDocDlg({ open: true, coverId: view.coverId })} className="rounded-xl shadow-md shadow-primary/20 gap-2">
        <FilePlus2 className="w-4 h-4" />Tambah Dokumen
      </Button>
    ) : (
      <Button onClick={() => setRevDlg({ open: true, docId: view.docId })} className="rounded-xl shadow-md shadow-primary/20 gap-2">
        <GitBranch className="w-4 h-4" />Tambah Revisi
      </Button>
    );

  return (
    <AdminLayout title="Dokumen Lembaga Penjaminan Mutu" headerRight={headerRight}>
      {/* Breadcrumb */}
      <Breadcrumbs
        view={view}
        cover={currentCover ?? currentDocCover}
        doc={currentDoc}
        onHome={() => { setView({ kind: "covers" }); setQuery(""); }}
        onBackToCover={(coverId) => { setView({ kind: "docs", coverId }); setQuery(""); }}
      />

      {/* Stats */}
      {view.kind === "covers" && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: "Total Kategori", value: data.covers.length, color: "text-foreground" },
            { label: "Total Dokumen", value: data.documents.length, color: "text-primary" },
            { label: "Aktif", value: data.documents.filter((d) => d.status === "Aktif").length, color: "text-emerald-600" },
            { label: "Tidak Aktif", value: data.documents.filter((d) => d.status === "Tidak Aktif").length, color: "text-muted-foreground" },
          ].map((s) => (
            <div key={s.label} className="bg-card border border-border rounded-2xl px-4 py-3.5 shadow-sm">
              <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">{s.label}</p>
              <p className={`text-2xl font-black mt-0.5 ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Search bar */}
      {(view.kind === "covers" || view.kind === "docs") && (
        <div className="bg-card border border-border rounded-2xl p-4 shadow-sm mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text" value={query} onChange={(e) => setQuery(e.target.value)}
              placeholder={view.kind === "covers" ? "Cari kategori dokumen, judul, atau deskripsi..." : "Cari dokumen (nama, jenis, unit, kegiatan)..."}
              className="w-full bg-muted/60 border border-transparent focus:border-primary/40 focus:bg-card focus:ring-2 focus:ring-primary/15 rounded-xl pl-11 pr-4 py-2.5 text-sm placeholder:text-muted-foreground outline-none transition-all"
            />
          </div>
        </div>
      )}

      {/* ── VIEW: COVERS ── */}
      {view.kind === "covers" && (
        <CoversGrid
          covers={filteredCovers}
          data={data}
          onOpen={(id) => setView({ kind: "docs", coverId: id })}
          onEdit={(c) => setCoverDlg({ open: true, editing: c })}
          onDelete={(id) => setDeleteDlg({ kind: "cover", id })}
        />
      )}

      {/* ── VIEW: DOCS in COVER ── */}
      {view.kind === "docs" && currentCover && (
        <DocsList
          cover={currentCover}
          docs={filteredDocs}
          onOpen={(id) => setView({ kind: "doc", docId: id })}
          onEdit={(d) => setDocDlg({ open: true, coverId: currentCover.id, editing: d })}
          onDelete={(id) => setDeleteDlg({ kind: "doc", id, parentId: currentCover.id })}
        />
      )}

      {/* ── VIEW: DOC DETAIL with REVISIONS ── */}
      {view.kind === "doc" && currentDoc && currentDocCover && (
        <DocDetail
          doc={currentDoc}
          cover={currentDocCover}
          onAddRevision={() => setRevDlg({ open: true, docId: currentDoc.id })}
          onDeleteRevision={(revId) => setDeleteDlg({ kind: "rev", id: revId, parentId: currentDoc.id })}
          onToggleDocumentStatus={async (status) => {
            await store.updateDocument(currentDoc.id, { status });
            toast.success(status === "Aktif" ? "Dokumen induk diaktifkan" : "Dokumen induk dinonaktifkan");
          }}
          onToggleRevisionStatus={async (revId, status) => {
            await store.updateRevision(currentDoc.id, revId, { status });
            toast.success(status === "Aktif" ? "Revisi diaktifkan" : "Revisi dinonaktifkan");
          }}
        />
      )}

      {/* ── DIALOGS ── */}
      <CoverDialog
        open={coverDlg.open}
        editing={coverDlg.editing}
        onClose={() => setCoverDlg({ open: false })}
        onSave={async (payload) => {
          try {
            if (coverDlg.editing) {
              await store.updateCover(coverDlg.editing.id, {
                title: payload.title,
                description: payload.description,
                image: payload.existingImage,
                imageFile: payload.imageFile,
              });
              toast.success("Kategori diperbarui");
            } else {
              await store.addCover({
                title: payload.title,
                description: payload.description,
                imageFile: payload.imageFile,
              });
              toast.success("Kategori ditambahkan");
            }
            setCoverDlg({ open: false });
          } catch (error) {
            showApiError("Gagal menyimpan kategori", error);
          }
        }}
      />

      <DocumentDialog
        open={docDlg.open}
        coverId={docDlg.coverId}
        editing={docDlg.editing}
        covers={data.covers}
        onClose={() => setDocDlg({ open: false })}
        onSave={async (payload, file) => {
          try {
            if (docDlg.editing) {
              const { initialRevision, ...rest } = payload;
              await store.updateDocument(docDlg.editing.id, rest);
              toast.success("Dokumen diperbarui");
            } else {
              await store.addDocument({
                ...payload,
                initialRevision: {
                  ...payload.initialRevision,
                  fileName: file?.name ?? payload.initialRevision.fileName,
                  fileSize: file?.size,
                  file,
                },
              });
              toast.success("Dokumen ditambahkan", { description: payload.name });
            }
            setDocDlg({ open: false });
          } catch (error) {
            showApiError("Gagal menyimpan dokumen", error);
          }
        }}
      />

      <RevisionDialog
        open={revDlg.open}
        doc={view.kind === "doc" ? currentDoc : data.documents.find((d) => d.id === revDlg.docId)}
        onClose={() => setRevDlg({ open: false })}
        onSave={async (payload, file) => {
          if (!revDlg.docId) return;
          try {
            await store.addRevision(revDlg.docId, {
              ...payload,
              fileName: file?.name ?? payload.fileName,
              fileSize: file?.size,
              file,
            });
            toast.success("Revisi disimpan", { description: `Versi ${payload.version}` });
            setRevDlg({ open: false });
          } catch (error) {
            showApiError("Gagal menyimpan revisi", error);
          }
        }}
      />

      <AlertDialog open={!!deleteDlg} onOpenChange={(o) => !o && setDeleteDlg(null)}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {deleteDlg?.kind === "cover" && "Hapus kategori ini?"}
              {deleteDlg?.kind === "doc" && "Hapus dokumen ini?"}
              {deleteDlg?.kind === "rev" && "Hapus revisi ini?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {deleteDlg?.kind === "cover"
                ? "Semua dokumen di dalam kategori ini juga akan terhapus. Tindakan ini tidak dapat dibatalkan."
                : "Tindakan ini tidak dapat dibatalkan."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default AdminDokumen;

/* ═══════════════════════════════════════════════════════════
   BREADCRUMB
   ═══════════════════════════════════════════════════════════ */
function Breadcrumbs({
  view, cover, doc, onHome, onBackToCover,
}: {
  view: View; cover?: Cover; doc?: DocumentItem;
  onHome: () => void; onBackToCover: (coverId: string) => void;
}) {
  return (
    <div className="flex items-center gap-2 text-sm mb-5 flex-wrap">
      <button onClick={onHome} className="font-semibold text-muted-foreground hover:text-primary transition-colors">
        Semua Kategori
      </button>
      {(view.kind === "docs" || view.kind === "doc") && cover && (
        <>
          <span className="text-muted-foreground/40">/</span>
          <button
            onClick={() => onBackToCover(cover.id)}
            className={`font-semibold transition-colors ${view.kind === "doc" ? "text-muted-foreground hover:text-primary" : "text-foreground"}`}
          >
            {cover.title}
          </button>
        </>
      )}
      {view.kind === "doc" && doc && (
        <>
          <span className="text-muted-foreground/40">/</span>
          <span className="font-semibold text-foreground">{doc.name}</span>
        </>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   COVERS GRID
   ═══════════════════════════════════════════════════════════ */
function CoversGrid({
  covers, data, onOpen, onEdit, onDelete,
}: {
  covers: Cover[];
  data: { documents: DocumentItem[] } & any;
  onOpen: (id: string) => void;
  onEdit: (c: Cover) => void;
  onDelete: (id: string) => void;
}) {
  if (covers.length === 0) {
    return (
      <div className="bg-card border border-dashed border-border rounded-2xl p-12 text-center">
        <BookMarked className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
        <p className="text-sm text-muted-foreground">Belum ada kategori. Klik "Tambah Kategori" untuk mulai.</p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {covers.map((c) => (
        <div key={c.id} className="group bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
          <button onClick={() => onOpen(c.id)} className="block w-full text-left">
            <div className="aspect-[16/9] bg-gradient-to-br from-primary/15 to-primary/5 relative overflow-hidden">
              {c.image ? (
                <img src={c.image} alt={c.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <BookMarked className="w-14 h-14 text-primary/40" />
                </div>
              )}
              <div className="absolute top-3 right-3 inline-flex items-center gap-1 bg-foreground/80 backdrop-blur-sm text-background text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                <FileText className="w-3 h-3" />
                {countDocs(data, c.id)} Dokumen
              </div>
            </div>
            <div className="p-5">
              <h3 className="font-black text-foreground text-lg leading-tight group-hover:text-primary transition-colors">{c.title}</h3>
              {c.description && <p className="text-sm text-muted-foreground mt-1.5 line-clamp-2">{c.description}</p>}
            </div>
          </button>
          <div className="px-5 pb-4 flex items-center justify-end gap-1 border-t border-border pt-3">
            <button onClick={() => onEdit(c)} className="p-2 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors" title="Edit kategori">
              <Pencil className="w-4 h-4" />
            </button>
            <button onClick={() => onDelete(c.id)} className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors" title="Hapus kategori">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   DOCS LIST (in a Cover)
   ═══════════════════════════════════════════════════════════ */
function DocsList({
  cover, docs, onOpen, onEdit, onDelete,
}: {
  cover: Cover;
  docs: DocumentItem[];
  onOpen: (id: string) => void;
  onEdit: (d: DocumentItem) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="space-y-4">
      {/* Cover summary */}
      <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-5 flex items-center gap-4">
        <div className="w-16 h-16 rounded-xl bg-card border border-border flex items-center justify-center shrink-0 overflow-hidden">
          {cover.image ? <img src={cover.image} alt={cover.title} className="w-full h-full object-cover" /> : <BookMarked className="w-7 h-7 text-primary" />}
        </div>
        <div className="min-w-0">
          <h3 className="font-black text-lg text-foreground">{cover.title}</h3>
          {cover.description && <p className="text-sm text-muted-foreground line-clamp-1">{cover.description}</p>}
        </div>
      </div>

      {docs.length === 0 ? (
        <div className="bg-card border border-dashed border-border rounded-2xl p-12 text-center">
          <FileText className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Belum ada dokumen di kategori ini.</p>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-sm hidden md:table">
            <thead className="bg-muted/50">
              <tr className="text-left text-[12px] text-muted-foreground font-semibold uppercase tracking-wider">
                <th className="px-5 py-4">Nama Dokumen</th>
                <th className="px-5 py-4">Jenis</th>
                <th className="px-5 py-4">Unit</th>
                <th className="px-5 py-4">Versi Terbaru</th>
                <th className="px-5 py-4">Diperbarui</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {docs.map((d) => {
                const last = latestRevision(d);
                return (
                  <tr key={d.id} className="border-t border-border hover:bg-muted/25 transition-colors group">
                    <td className="px-5 py-4">
                      <button onClick={() => onOpen(d.id)} className="flex items-center gap-3 text-left">
                        <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground leading-snug group-hover:text-primary transition-colors">{d.name}</p>
                          {d.revisions.length > 1 && (
                            <p className="text-[10px] text-blue-500 font-semibold mt-0.5 inline-flex items-center gap-1">
                              <GitBranch className="w-3 h-3" />{d.revisions.length} Revisi
                            </p>
                          )}
                        </div>
                      </button>
                    </td>
                    <td className="px-5 py-4 text-muted-foreground">{d.jenis ?? "—"}</td>
                    <td className="px-5 py-4 text-muted-foreground">{d.unit}</td>
                    <td className="px-5 py-4 text-muted-foreground font-mono text-xs">{last?.version ?? "—"}</td>
                    <td className="px-5 py-4 text-muted-foreground">{last ? formatDate(last.uploadedAt) : "—"}</td>
                    <td className="px-5 py-4">
                      <StatusBadge status={d.status} />
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => onOpen(d.id)} className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground" title="Lihat"><Eye className="w-4 h-4" /></button>
                        <button onClick={() => onEdit(d)} className="p-2 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary" title="Edit"><Pencil className="w-4 h-4" /></button>
                        <button onClick={() => onDelete(d.id)} className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive" title="Hapus"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Mobile */}
          <div className="md:hidden divide-y divide-border">
            {docs.map((d) => {
              const last = latestRevision(d);
              return (
                <div key={d.id} className="p-4">
                  <button onClick={() => onOpen(d.id)} className="flex items-start gap-3 w-full text-left">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm text-foreground">{d.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {d.jenis} · {last?.version ?? "—"} · {last ? formatDate(last.uploadedAt) : "—"}
                      </p>
                      <div className="mt-2 flex items-center justify-between">
                        <StatusBadge status={d.status} />
                        {d.revisions.length > 1 && (
                          <span className="text-[10px] text-blue-500 font-semibold inline-flex items-center gap-1">
                            <GitBranch className="w-3 h-3" />{d.revisions.length} Revisi
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                  <div className="flex items-center justify-end gap-1 mt-3 pt-3 border-t border-border">
                    <button onClick={() => onEdit(d)} className="p-2 rounded-lg hover:bg-primary/10 text-primary"><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => onDelete(d.id)} className="p-2 rounded-lg hover:bg-destructive/10 text-destructive"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   DOC DETAIL with REVISION HISTORY
   ═══════════════════════════════════════════════════════════ */
function DocDetail({
  doc, cover, onAddRevision, onDeleteRevision, onToggleDocumentStatus, onToggleRevisionStatus,
}: {
  doc: DocumentItem;
  cover: Cover;
  onAddRevision: () => void;
  onDeleteRevision: (revId: string) => void;
  onToggleDocumentStatus: (status: DocStatus) => void;
  onToggleRevisionStatus: (revId: string, status: DocStatus) => void;
}) {
  const last = latestRevision(doc);
  return (
    <div className="space-y-5">
      {/* Doc summary */}
      <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shrink-0 shadow-md shadow-primary/30">
            <FileText className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] uppercase tracking-widest text-muted-foreground font-bold">{cover.title}</p>
            <h2 className="text-xl font-black text-foreground mt-0.5">{doc.name}</h2>
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              <Badge icon={<Layers className="w-3 h-3" />}>{doc.jenis ?? "—"}</Badge>
              <Badge>{doc.unit}</Badge>
              <Badge>{doc.kegiatan}</Badge>
              <StatusBadge status={doc.status} />
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 shrink-0">
            <Button
              variant="outline"
              onClick={() => onToggleDocumentStatus(doc.status === "Aktif" ? "Tidak Aktif" : "Aktif")}
              className="rounded-xl"
            >
              {doc.status === "Aktif" ? "Nonaktifkan Dokumen" : "Aktifkan Dokumen"}
            </Button>
            <Button onClick={onAddRevision} className="rounded-xl gap-2">
              <GitBranch className="w-4 h-4" />Tambah Revisi
            </Button>
          </div>
        </div>
        <div className="sm:hidden mt-4 grid grid-cols-1 gap-2">
          <Button
            variant="outline"
            onClick={() => onToggleDocumentStatus(doc.status === "Aktif" ? "Tidak Aktif" : "Aktif")}
            className="rounded-xl"
          >
            {doc.status === "Aktif" ? "Nonaktifkan Dokumen" : "Aktifkan Dokumen"}
          </Button>
          <Button onClick={onAddRevision} className="rounded-xl gap-2">
            <GitBranch className="w-4 h-4" />Tambah Revisi
          </Button>
        </div>
      </div>

      {/* Latest revision spotlight */}
      {last && (
        <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/30 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
              <CheckCircle2 className="w-3 h-3" />Versi Terbaru
            </span>
            <span className="text-xs text-muted-foreground font-mono">{last.version}</span>
            <StatusBadge status={last.status} />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <div className="flex-1">
              <p className="font-bold text-foreground">{last.fileName}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Diunggah {formatDate(last.uploadedAt)}
                {last.fileSize && ` · ${(last.fileSize / 1024).toFixed(0)} KB`}
              </p>
              {last.alasanRevisi && (
                <p className="text-sm text-foreground/80 mt-2 italic">"{last.alasanRevisi}"</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="rounded-xl gap-2" onClick={() => void openRevisionFile(last)}>
                <Eye className="w-4 h-4" />Lihat
              </Button>
              <Button size="sm" className="rounded-xl gap-2" onClick={() => void openRevisionFile(last, true)}>
                <Download className="w-4 h-4" />Unduh
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Revision history */}
      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-muted-foreground" />
            <h3 className="font-bold text-sm">Riwayat Revisi</h3>
            <span className="text-xs text-muted-foreground">({doc.revisions.length})</span>
          </div>
          <Button onClick={onAddRevision} size="sm" variant="outline" className="rounded-xl gap-2 sm:hidden">
            <GitBranch className="w-4 h-4" />Revisi
          </Button>
        </div>

        <div className="relative">
          {doc.revisions.map((rev, i) => {
            const isLatest = i === 0;
            const isOldest = i === doc.revisions.length - 1;
            return (
              <div key={rev.id} className={`flex gap-4 px-5 py-4 ${isLatest ? "bg-emerald-50/40 dark:bg-emerald-950/10" : ""} border-t border-border first:border-t-0`}>
                {/* Timeline indicator */}
                <div className="flex flex-col items-center pt-1 shrink-0">
                  <div className={`w-3 h-3 rounded-full ring-4 ${isLatest ? "bg-emerald-500 ring-emerald-500/20" : "bg-muted-foreground/40 ring-muted"}`} />
                  {!isOldest && <div className="flex-1 w-px bg-border mt-1" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm text-foreground font-mono">{rev.version}</span>
                        <StatusBadge status={rev.status} />
                        {isLatest && (
                          <span className="text-[9px] font-bold uppercase tracking-wider bg-emerald-500 text-white px-1.5 py-0.5 rounded">Terbaru</span>
                        )}
                        {isOldest && doc.revisions.length > 1 && (
                          <span className="text-[9px] font-bold uppercase tracking-wider bg-muted text-muted-foreground px-1.5 py-0.5 rounded">Awal</span>
                        )}
                      </div>
                      <p className="text-sm text-foreground mt-1">{rev.fileName}</p>
                      <p className="text-[11px] text-muted-foreground inline-flex items-center gap-1 mt-1">
                        <Calendar className="w-3 h-3" />{formatDate(rev.uploadedAt)}
                        {rev.fileSize && <> · {(rev.fileSize / 1024).toFixed(0)} KB</>}
                      </p>
                      {rev.alasanRevisi && (
                        <p className="text-xs text-muted-foreground mt-1.5 italic">"{rev.alasanRevisi}"</p>
                      )}
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button onClick={() => onToggleRevisionStatus(rev.id, rev.status === "Aktif" ? "Tidak Aktif" : "Aktif")} className="px-2 py-1.5 rounded-lg hover:bg-muted text-[11px] font-semibold text-muted-foreground hover:text-primary" title={rev.status === "Aktif" ? "Nonaktifkan revisi" : "Aktifkan revisi"}>
                        {rev.status === "Aktif" ? "Nonaktifkan" : "Aktifkan"}
                      </button>
                      <button onClick={() => void openRevisionFile(rev)} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground" title="Lihat"><Eye className="w-3.5 h-3.5" /></button>
                      <button onClick={() => void openRevisionFile(rev, true)} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground" title="Unduh"><Download className="w-3.5 h-3.5" /></button>
                      {doc.revisions.length > 1 && (
                        <button onClick={() => onDeleteRevision(rev.id)} className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive" title="Hapus revisi"><Trash2 className="w-3.5 h-3.5" /></button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   COVER DIALOG
   ═══════════════════════════════════════════════════════════ */
function CoverDialog({
  open, editing, onClose, onSave,
}: {
  open: boolean;
  editing?: Cover;
  onClose: () => void;
  onSave: (payload: { title: string; description?: string; imageFile?: File; existingImage?: string }) => void;
}) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | undefined>();
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  // sync when open
  useMemo(() => {
    if (open) {
      setTitle(editing?.title ?? "");
      setDesc(editing?.description ?? "");
      setImageFile(null);
      setImagePreview(editing?.image);
      setError("");
    }
    return null;
  }, [open, editing]);

  const handleImage = (f: File | null) => {
    if (!f) return;
    if (!f.type.startsWith("image/")) { toast.error("File harus gambar"); return; }
    if (f.size > 2 * 1024 * 1024) { toast.error("Maks 2MB"); return; }
    setImageFile(f);
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target?.result as string);
    reader.readAsDataURL(f);
  };

  const submit = () => {
    if (!title.trim()) { setError("Judul kategori wajib diisi"); return; }
    onSave({ title: title.trim(), description: desc.trim() || undefined, imageFile: imageFile ?? undefined, existingImage: editing?.image });
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="rounded-2xl max-w-lg p-0 gap-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border">
          <DialogTitle className="text-xl font-black">{editing ? "Edit Kategori" : "Tambah Kategori"}</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Kategori berfungsi sebagai pembatas / pengelompok dokumen.
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 py-5 space-y-4">
          {/* Image upload */}
          <div className="space-y-1.5">
            <Label className="text-[13px] font-semibold text-foreground/80">Gambar Kategori (opsional)</Label>
            <div
              onClick={() => fileRef.current?.click()}
              className="aspect-[16/9] rounded-xl border-2 border-dashed border-border hover:border-primary/50 cursor-pointer overflow-hidden bg-muted/30 flex items-center justify-center relative group transition-colors"
            >
              {imagePreview ? (
                <>
                  <img src={imagePreview} alt="Kategori" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setImageFile(null); setImagePreview(undefined); }}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-foreground/70 text-background opacity-0 group-hover:opacity-100 flex items-center justify-center"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </>
              ) : (
                <div className="text-center">
                  <ImageIcon className="w-10 h-10 text-muted-foreground/40 mx-auto" />
                  <p className="text-xs text-muted-foreground mt-2">Klik untuk pilih gambar (maks 2MB)</p>
                </div>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleImage(e.target.files?.[0] ?? null)} />
          </div>

          <div>
            <Label className="text-[13px] font-semibold text-foreground/80">Judul Kategori <span className="text-destructive">*</span></Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Contoh: Pedoman SPMI" className="rounded-lg h-10 mt-1.5" />
            {error && <p className="text-[11px] text-destructive mt-1.5 inline-flex items-center gap-1"><AlertCircle className="w-3 h-3" />{error}</p>}
          </div>

          <div>
            <Label className="text-[13px] font-semibold text-foreground/80">Deskripsi Singkat</Label>
            <Textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={3} placeholder="Penjelasan singkat tentang kategori ini..." className="rounded-lg mt-1.5" />
          </div>
        </div>

        <DialogFooter className="px-6 py-4 border-t border-border bg-muted/30 gap-2 flex-row justify-end">
          <Button variant="outline" onClick={onClose} className="rounded-xl"><X className="w-4 h-4 mr-1.5" />Batal</Button>
          <Button onClick={submit} className="rounded-xl shadow-md shadow-primary/20 min-w-[120px]">
            <CheckCircle2 className="w-4 h-4 mr-1.5" />{editing ? "Simpan" : "Tambah"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ═══════════════════════════════════════════════════════════
   DOCUMENT DIALOG
   ═══════════════════════════════════════════════════════════ */
function DocumentDialog({
  open, coverId, editing, covers, onClose, onSave,
}: {
  open: boolean;
  coverId?: string;
  editing?: DocumentItem;
  covers: Cover[];
  onClose: () => void;
  onSave: (
    payload: {
      coverId: string; name: string; kegiatan: string; unit: string;
      jenis?: string; status: DocStatus;
      initialRevision: { version: string; fileName: string; alasanRevisi: string };
    },
    file: File | null
  ) => void;
}) {
  const [form, setForm] = useState({
    coverId: "", name: "", kegiatan: "", unit: "", jenis: "", status: "Aktif" as DocStatus,
    version: "v1.0", fileName: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useMemo(() => {
    if (open) {
      setForm({
        coverId: editing?.coverId ?? coverId ?? (covers[0]?.id ?? ""),
        name: editing?.name ?? "",
        kegiatan: editing?.kegiatan ?? "",
        unit: editing?.unit ?? "",
        jenis: editing?.jenis ?? "",
        status: editing?.status ?? "Aktif",
        version: editing?.revisions[0]?.version ?? "v1.0",
        fileName: editing?.revisions[0]?.fileName ?? "",
      });
      setFile(null);
      setErrors({});
    }
    return null;
  }, [open, editing, coverId, covers]);

  const submit = () => {
    const e: Record<string, string> = {};
    if (!form.coverId) e.coverId = "Cover wajib dipilih";
    if (!form.name.trim()) e.name = "Nama wajib diisi";
    if (!form.kegiatan.trim()) e.kegiatan = "Kegiatan wajib diisi";
    if (!form.unit) e.unit = "Unit wajib dipilih";
    if (!editing && !file) e.file = "File PDF wajib diunggah";
    if (Object.keys(e).length) { setErrors(e); return; }

    onSave({
      coverId: form.coverId, name: form.name.trim(), kegiatan: form.kegiatan.trim(),
      unit: form.unit, jenis: form.jenis || undefined, status: form.status,
      initialRevision: {
        version: form.version || "v1.0",
        fileName: file?.name ?? form.fileName,
        alasanRevisi: editing ? "Update metadata" : "Versi awal",
      },
    }, file);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="rounded-2xl max-w-2xl max-h-[92vh] overflow-y-auto p-0 gap-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border sticky top-0 bg-card z-10">
          <DialogTitle className="text-xl font-black">{editing ? "Edit Dokumen" : "Tambah Dokumen Baru"}</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {editing ? "Ubah metadata dokumen. Untuk update file gunakan menu Tambah Revisi." : "Dokumen baru akan otomatis dibuat versi awal v1.0."}
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 py-5 space-y-4">
          <div>
            <Label className="text-[13px] font-semibold">Kategori Dokumen <span className="text-destructive">*</span></Label>
            <Select value={form.coverId} onValueChange={(v) => setForm({ ...form, coverId: v })}>
              <SelectTrigger className="rounded-lg h-10 mt-1.5"><SelectValue placeholder="Pilih kategori" /></SelectTrigger>
              <SelectContent>
                {covers.map((c) => <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>)}
              </SelectContent>
            </Select>
            <ErrMsg msg={errors.coverId} />
          </div>

          <div>
            <Label className="text-[13px] font-semibold">Nama Dokumen <span className="text-destructive">*</span></Label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="rounded-lg h-10 mt-1.5" placeholder="Contoh: Pedoman SPMI 2025" />
            <ErrMsg msg={errors.name} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label className="text-[13px] font-semibold">Jenis Dokumen</Label>
              <Input
                value={form.jenis}
                onChange={(e) => setForm({ ...form, jenis: e.target.value })}
                className="rounded-lg h-10 mt-1.5"
                placeholder="Contoh: Standar, Manual, Formulir"
              />
            </div>
            <div>
              <Label className="text-[13px] font-semibold">Status <span className="text-destructive">*</span></Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as DocStatus })}>
                <SelectTrigger className="rounded-lg h-10 mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label className="text-[13px] font-semibold">Kegiatan <span className="text-destructive">*</span></Label>
              <Input value={form.kegiatan} onChange={(e) => setForm({ ...form, kegiatan: e.target.value })} className="rounded-lg h-10 mt-1.5" placeholder="Contoh: Audit Mutu Internal" />
              <ErrMsg msg={errors.kegiatan} />
            </div>
            <div>
              <Label className="text-[13px] font-semibold">Unit <span className="text-destructive">*</span></Label>
              <Input
                value={form.unit}
                onChange={(e) => setForm({ ...form, unit: e.target.value })}
                className="rounded-lg h-10 mt-1.5"
                placeholder="Contoh: LPM, Fakultas Teknik, Program Studi"
              />
              <ErrMsg msg={errors.unit} />
            </div>
          </div>

          {!editing && <FileDrop file={file} onChange={setFile} error={errors.file} />}
        </div>

        <DialogFooter className="px-6 py-4 border-t border-border bg-muted/30 sticky bottom-0 gap-2 flex-row justify-end">
          <Button variant="outline" onClick={onClose} className="rounded-xl"><X className="w-4 h-4 mr-1.5" />Batal</Button>
          <Button onClick={submit} className="rounded-xl shadow-md shadow-primary/20 min-w-[120px]">
            <CheckCircle2 className="w-4 h-4 mr-1.5" />{editing ? "Simpan" : "Tambah"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ═══════════════════════════════════════════════════════════
   REVISION DIALOG
   ═══════════════════════════════════════════════════════════ */
function RevisionDialog({
  open, doc, onClose, onSave,
}: {
  open: boolean;
  doc?: DocumentItem;
  onClose: () => void;
  onSave: (
    payload: { version: string; fileName: string; alasanRevisi: string; status: DocStatus },
    file: File | null
  ) => void;
}) {
  const [version, setVersion] = useState("");
  const [alasan, setAlasan] = useState("");
  const [status, setStatus] = useState<DocStatus>("Aktif");
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useMemo(() => {
    if (open && doc) {
      const last = doc.revisions[0]?.version ?? "v1.0";
      const [maj] = last.replace("v", "").split(".");
      const next = `v${Number(maj) + 1}.0`;
      setVersion(next);
      setAlasan("");
      setStatus("Aktif");
      setFile(null);
      setErrors({});
    }
    return null;
  }, [open, doc]);

  const submit = () => {
    const e: Record<string, string> = {};
    if (!version.trim()) e.version = "Versi wajib diisi";
    if (!alasan.trim()) e.alasan = "Alasan revisi wajib diisi";
    if (!file) e.file = "File PDF revisi wajib diunggah";
    if (Object.keys(e).length) { setErrors(e); return; }
    onSave({ version: version.trim(), fileName: file!.name, alasanRevisi: alasan.trim(), status }, file);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="rounded-2xl max-w-lg p-0 gap-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border">
          <DialogTitle className="text-xl font-black flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-blue-500" />Tambah Revisi
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {doc && <>Revisi untuk dokumen <strong className="text-foreground">{doc.name}</strong>. File lama tetap tersimpan sebagai arsip.</>}
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 py-5 space-y-4">
          <div className="flex items-start gap-3 p-3.5 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/50 rounded-xl">
            <GitBranch className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <p className="text-[12px] text-blue-700 dark:text-blue-300 leading-relaxed">
              Revisi baru akan menjadi versi yang ditampilkan pertama. Riwayat lama tetap dapat diakses.
            </p>
          </div>

          <div>
            <Label className="text-[13px] font-semibold">Versi Baru <span className="text-destructive">*</span></Label>
            <Input value={version} onChange={(e) => setVersion(e.target.value)} placeholder="v2.0" className="rounded-lg h-10 mt-1.5 font-mono" />
            <ErrMsg msg={errors.version} />
          </div>

          <div>
            <Label className="text-[13px] font-semibold">Alasan Revisi <span className="text-destructive">*</span></Label>
            <Textarea value={alasan} onChange={(e) => setAlasan(e.target.value)} rows={3} placeholder="Jelaskan alasan dilakukan revisi..." className="rounded-lg mt-1.5" />
            <ErrMsg msg={errors.alasan} />
          </div>

          <div>
            <Label className="text-[13px] font-semibold">Status Revisi <span className="text-destructive">*</span></Label>
            <Select value={status} onValueChange={(v) => setStatus(v as DocStatus)}>
              <SelectTrigger className="rounded-lg h-10 mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <FileDrop file={file} onChange={setFile} error={errors.file} />
        </div>

        <DialogFooter className="px-6 py-4 border-t border-border bg-muted/30 gap-2 flex-row justify-end">
          <Button variant="outline" onClick={onClose} className="rounded-xl"><X className="w-4 h-4 mr-1.5" />Batal</Button>
          <Button onClick={submit} className="rounded-xl shadow-md shadow-primary/20 min-w-[120px]">
            <CheckCircle2 className="w-4 h-4 mr-1.5" />Simpan Revisi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ═══════════════════════════════════════════════════════════
   SHARED SUBCOMPONENTS
   ═══════════════════════════════════════════════════════════ */
function ErrMsg({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <p className="flex items-center gap-1.5 text-[11px] text-destructive mt-1.5 font-medium">
      <AlertCircle className="w-3 h-3 shrink-0" />{msg}
    </p>
  );
}

function FileDrop({
  file, onChange, error,
}: { file: File | null; onChange: (f: File | null) => void; error?: string }) {
  const ref = useRef<HTMLInputElement>(null);
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f && f.type === "application/pdf") onChange(f);
    else toast.error("Hanya file PDF yang diizinkan");
  };
  return (
    <div className="space-y-1.5">
      <Label className="text-[13px] font-semibold">Upload File (PDF) <span className="text-destructive">*</span></Label>
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        onClick={() => ref.current?.click()}
        className={`
          group relative flex flex-col items-center justify-center gap-2.5 p-6 rounded-xl border-2 border-dashed cursor-pointer transition-all
          ${error ? "border-destructive/50 bg-destructive/5" : "border-border hover:border-primary/50 hover:bg-primary/5"}
          ${file ? "border-emerald-400/60 bg-emerald-50/40 dark:bg-emerald-950/20" : ""}
        `}
      >
        <input
          ref={ref} type="file" accept="application/pdf" className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0] ?? null;
            if (f && f.type !== "application/pdf") { toast.error("Hanya PDF"); return; }
            onChange(f);
          }}
        />
        {file ? (
          <>
            <CheckCircle2 className="w-8 h-8 text-emerald-500" />
            <div className="text-center">
              <p className="text-[13px] font-semibold text-emerald-700 dark:text-emerald-400 truncate max-w-[260px]">{file.name}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">{(file.size / 1024).toFixed(0)} KB</p>
            </div>
            <button
              type="button" onClick={(e) => { e.stopPropagation(); onChange(null); }}
              className="absolute top-2 right-2 p-1 rounded-full hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
            ><X className="w-3.5 h-3.5" /></button>
          </>
        ) : (
          <>
            <UploadCloud className={`w-8 h-8 ${error ? "text-destructive/60" : "text-muted-foreground group-hover:text-primary"}`} />
            <div className="text-center">
              <p className="text-[13px] font-semibold text-foreground/70">Seret & lepas file PDF</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">atau <span className="text-primary font-semibold">klik untuk memilih</span></p>
            </div>
          </>
        )}
      </div>
      <ErrMsg msg={error} />
    </div>
  );
}

function StatusBadge({ status }: { status: DocStatus }) {
  const cls =
    status === "Aktif" ? "bg-emerald-500/10 text-emerald-600 ring-1 ring-emerald-500/20"
    : "bg-muted text-muted-foreground ring-1 ring-border";
  return <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${cls}`}>{status}</span>;
}

function Badge({ children, icon }: { children: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 bg-muted text-foreground/80 px-2.5 py-1 rounded-full text-[11px] font-semibold">
      {icon}{children}
    </span>
  );
}
