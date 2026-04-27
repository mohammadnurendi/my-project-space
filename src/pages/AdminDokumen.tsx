import { useMemo, useRef, useState } from "react";
import {
  Plus, Search, Filter, FileText, Pencil, Trash2,
  Download, Eye, UploadCloud, X, CheckCircle2,
  AlertCircle, FilePlus2, GitBranch, ChevronDown,
} from "lucide-react";
import { toast } from "sonner";
import AdminLayout from "@/components/AdminLayout";
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

/* ─── Types ─────────────────────────────────────────────── */
type DocStatus = "Aktif" | "Revisi" | "Arsip";
type DocItem = {
  id: string;
  name: string;
  category: string;
  kegiatan: string;
  unit: string;
  version: string;
  updatedAt: string;
  status: DocStatus;
  jenis?: string;
  alasanRevisi?: string;
  isRevisi?: boolean;
};

/* ─── Constants ─────────────────────────────────────────── */
const CATEGORIES = ["Pedoman", "Standar", "Formulir", "Manual", "Rapat", "Audit", "SOP"];
const JENIS_DOKUMEN = ["Pedoman", "Standar Operasional Prosedur (SOP)", "Instruksi Kerja", "Formulir", "Manual Mutu"];
const UNITS = ["LPM", "Fakultas Teknik", "Fakultas Ekonomi", "Fakultas Desain", "Rektorat", "BAAK", "BAUK"];
const STATUS_OPTIONS: DocStatus[] = ["Aktif", "Revisi", "Arsip"];

const seedDocs: DocItem[] = [
  { id: "DOC-001", name: "Pedoman SPMI 2025", category: "Pedoman", kegiatan: "Audit Mutu Internal", unit: "LPM", version: "v2.1", updatedAt: "24 Okt 2025", status: "Aktif" },
  { id: "DOC-002", name: "Standar Pendidikan", category: "Standar", kegiatan: "Penjaminan Mutu", unit: "Rektorat", version: "v1.4", updatedAt: "22 Okt 2025", status: "Aktif" },
  { id: "DOC-003", name: "Formulir Audit Mutu", category: "Formulir", kegiatan: "Audit Internal", unit: "LPM", version: "v3.0", updatedAt: "20 Okt 2025", status: "Revisi" },
  { id: "DOC-004", name: "Manual Mutu Akademik", category: "Manual", kegiatan: "Pengembangan Kurikulum", unit: "BAAK", version: "v1.0", updatedAt: "18 Okt 2025", status: "Aktif" },
  { id: "DOC-005", name: "Notulensi Rapat LPM", category: "Rapat", kegiatan: "Rapat Koordinasi", unit: "LPM", version: "v1.2", updatedAt: "15 Okt 2025", status: "Arsip" },
  { id: "DOC-006", name: "Laporan Audit Internal", category: "Audit", kegiatan: "Evaluasi Kinerja", unit: "Rektorat", version: "v2.0", updatedAt: "10 Okt 2025", status: "Aktif" },
];

/* ─── Empty form states ───────────────────────────────────── */
const emptyBaru = {
  namaDokumen: "", kategori: "", kegiatan: "", status: "" as DocStatus | "",
  unit: "", tanggalUpload: new Date().toISOString().slice(0, 10),
};
const emptyRevisi = {
  jenisDokumen: "", revisiDari: "", namaDokumen: "", revisiKe: "",
  alasanRevisi: "", tanggalUpload: new Date().toISOString().slice(0, 10),
};

/* ─── Helpers ───────────────────────────────────────────── */
const statusBadge = (s: DocStatus) =>
  s === "Aktif" ? "bg-emerald-500/10 text-emerald-600 ring-1 ring-emerald-500/20"
  : s === "Revisi" ? "bg-blue-500/10 text-blue-600 ring-1 ring-blue-500/20"
  : "bg-muted text-muted-foreground ring-1 ring-border";

const today = () =>
  new Date().toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });

const nextDocId = (docs: DocItem[]) =>
  `DOC-${String(docs.length + 1).padStart(3, "0")}`;

/* ─── Sub-components ──────────────────────────────────────── */
function ErrorMsg({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <p className="flex items-center gap-1.5 text-[11px] text-destructive mt-1.5 font-medium">
      <AlertCircle className="w-3 h-3 shrink-0" />{msg}
    </p>
  );
}

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <Label className="text-[13px] font-semibold text-foreground/80">
      {children}
      {required && <span className="text-destructive ml-0.5">*</span>}
    </Label>
  );
}

function FileUploadZone({
  file, onChange, error,
}: { file: File | null; onChange: (f: File | null) => void; error?: string }) {
  const ref = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f && f.type === "application/pdf") onChange(f);
    else toast.error("Hanya file PDF yang diizinkan");
  };

  return (
    <div className="space-y-1.5">
      <FieldLabel required>Upload File (PDF)</FieldLabel>
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => ref.current?.click()}
        className={`
          group relative flex flex-col items-center justify-center gap-2.5 p-6 rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200
          ${error ? "border-destructive/50 bg-destructive/5" : "border-border hover:border-primary/50 hover:bg-primary/5"}
          ${file ? "border-emerald-400/60 bg-emerald-50/40 dark:bg-emerald-950/20" : ""}
        `}
      >
        <input
          ref={ref}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0] ?? null;
            if (f && f.type !== "application/pdf") {
              toast.error("Hanya file PDF yang diizinkan");
              return;
            }
            onChange(f);
          }}
        />
        {file ? (
          <>
            <CheckCircle2 className="w-8 h-8 text-emerald-500" />
            <div className="text-center">
              <p className="text-[13px] font-semibold text-emerald-700 dark:text-emerald-400 truncate max-w-[220px]">
                {file.name}
              </p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {(file.size / 1024).toFixed(0)} KB
              </p>
            </div>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onChange(null); }}
              className="absolute top-2 right-2 p-1 rounded-full hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </>
        ) : (
          <>
            <UploadCloud className={`w-8 h-8 transition-colors ${error ? "text-destructive/60" : "text-muted-foreground group-hover:text-primary"}`} />
            <div className="text-center">
              <p className="text-[13px] font-semibold text-foreground/70">Seret & lepas file PDF di sini</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">atau <span className="text-primary font-semibold">klik untuk memilih</span></p>
            </div>
          </>
        )}
      </div>
      <ErrorMsg msg={error} />
    </div>
  );
}

/* ─── Mode Toggle ───────────────────────────────────────── */
function ModeToggle({
  mode, onChange,
}: { mode: "baru" | "revisi"; onChange: (m: "baru" | "revisi") => void }) {
  return (
    <div className="flex gap-2 p-1 bg-muted rounded-xl">
      {(["baru", "revisi"] as const).map((m) => (
        <button
          key={m}
          type="button"
          onClick={() => onChange(m)}
          className={`
            flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-[13px] font-semibold transition-all duration-200
            ${mode === m
              ? "bg-card text-foreground shadow-sm ring-1 ring-border"
              : "text-muted-foreground hover:text-foreground"}
          `}
        >
          {m === "baru"
            ? <><FilePlus2 className="w-4 h-4" />Dokumen Baru</>
            : <><GitBranch className="w-4 h-4" />Revisi Dokumen</>}
        </button>
      ))}
    </div>
  );
}

/* ─── Styled Select ─────────────────────────────────────── */
function FormSelect({
  label, value, onValueChange, placeholder, options, required, error,
}: {
  label: string; value: string; onValueChange: (v: string) => void;
  placeholder?: string; options: string[]; required?: boolean; error?: string;
}) {
  return (
    <div className="space-y-1.5">
      <FieldLabel required={required}>{label}</FieldLabel>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className={`rounded-lg text-sm h-10 ${error ? "border-destructive/60 focus:ring-destructive/20" : ""}`}>
          <SelectValue placeholder={placeholder ?? `Pilih ${label.toLowerCase()}`} />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
        </SelectContent>
      </Select>
      <ErrorMsg msg={error} />
    </div>
  );
}

function FormInput({
  label, value, onChange, placeholder, required, error, type = "text",
}: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; required?: boolean; error?: string; type?: string;
}) {
  return (
    <div className="space-y-1.5">
      <FieldLabel required={required}>{label}</FieldLabel>
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`rounded-lg text-sm h-10 ${error ? "border-destructive/60 focus-visible:ring-destructive/20" : ""}`}
      />
      <ErrorMsg msg={error} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════ */
const AdminDokumen = () => {
  const [docs, setDocs] = useState<DocItem[]>(seedDocs);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");

  /* ── Form dialog state ─── */
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<DocItem | null>(null);
  const [mode, setMode] = useState<"baru" | "revisi">("baru");

  /* ── Dokumen Baru form ─── */
  const [formBaru, setFormBaru] = useState(emptyBaru);
  const [fileBaru, setFileBaru] = useState<File | null>(null);

  /* ── Revisi form ─── */
  const [formRevisi, setFormRevisi] = useState(emptyRevisi);
  const [fileRevisi, setFileRevisi] = useState<File | null>(null);

  /* ── Validation errors ─── */
  const [errors, setErrors] = useState<Record<string, string>>({});

  /* ── Delete ─── */
  const [deleteId, setDeleteId] = useState<string | null>(null);

  /* ── Filtered docs ─── */
  const filtered = useMemo(() =>
    docs.filter((d) => {
      const q = query.toLowerCase();
      return (
        (d.name.toLowerCase().includes(q) || d.id.toLowerCase().includes(q)) &&
        (filter === "all" || d.category === filter)
      );
    }), [docs, query, filter]);

  /* ── Open / Reset ─────────────────────────────────── */
  const openCreate = () => {
    setEditing(null);
    setMode("baru");
    setFormBaru(emptyBaru);
    setFormRevisi(emptyRevisi);
    setFileBaru(null);
    setFileRevisi(null);
    setErrors({});
    setFormOpen(true);
  };

  const openEdit = (doc: DocItem) => {
    setEditing(doc);
    setMode(doc.isRevisi ? "revisi" : "baru");
    setFormBaru({ namaDokumen: doc.name, kategori: doc.category, kegiatan: doc.kegiatan, status: doc.status, unit: doc.unit, tanggalUpload: new Date().toISOString().slice(0, 10) });
    setFormRevisi({ jenisDokumen: doc.jenis ?? "", revisiDari: doc.id, namaDokumen: doc.name, revisiKe: doc.version, alasanRevisi: doc.alasanRevisi ?? "", tanggalUpload: new Date().toISOString().slice(0, 10) });
    setFileBaru(null);
    setFileRevisi(null);
    setErrors({});
    setFormOpen(true);
  };

  /* ── Validation ───────────────────────────────────── */
  const validateBaru = () => {
    const e: Record<string, string> = {};
    if (!formBaru.namaDokumen.trim()) e.namaDokumen = "Nama dokumen wajib diisi";
    if (!formBaru.kategori) e.kategori = "Kategori wajib dipilih";
    if (!formBaru.kegiatan.trim()) e.kegiatan = "Kegiatan wajib diisi";
    if (!formBaru.status) e.status = "Status wajib dipilih";
    if (!formBaru.unit.trim()) e.unit = "Unit wajib diisi";
    if (!fileBaru && !editing) e.fileBaru = "File PDF wajib diunggah";
    if (!formBaru.tanggalUpload) e.tanggalUpload = "Tanggal upload wajib diisi";
    return e;
  };

  const validateRevisi = () => {
    const e: Record<string, string> = {};
    if (!formRevisi.jenisDokumen) e.jenisDokumen = "Jenis dokumen wajib dipilih";
    if (!formRevisi.revisiDari) e.revisiDari = "Revisi dari dokumen wajib dipilih";
    if (!formRevisi.namaDokumen.trim()) e.namaDokumen = "Nama dokumen wajib diisi";
    if (!formRevisi.revisiKe.trim()) e.revisiKe = "Revisi ke wajib diisi";
    if (!formRevisi.alasanRevisi.trim()) e.alasanRevisi = "Alasan revisi wajib diisi";
    if (!fileRevisi && !editing) e.fileRevisi = "File PDF wajib diunggah";
    if (!formRevisi.tanggalUpload) e.tanggalUpload = "Tanggal upload wajib diisi";
    return e;
  };

  /* ── Save ─────────────────────────────────────────── */
  const handleSave = () => {
    const errs = mode === "baru" ? validateBaru() : validateRevisi();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});

    const t = today();
    if (editing) {
      const updated: DocItem =
        mode === "baru"
          ? { ...editing, name: formBaru.namaDokumen, category: formBaru.kategori, kegiatan: formBaru.kegiatan, status: formBaru.status as DocStatus, unit: formBaru.unit, updatedAt: t, isRevisi: false }
          : { ...editing, name: formRevisi.namaDokumen, version: formRevisi.revisiKe, jenis: formRevisi.jenisDokumen, alasanRevisi: formRevisi.alasanRevisi, updatedAt: t, status: "Revisi", isRevisi: true };
      setDocs((prev) => prev.map((d) => (d.id === editing.id ? updated : d)));
      toast.success("Dokumen diperbarui", { description: `${updated.name} berhasil diperbarui.` });
    } else {
      const id = nextDocId(docs);
      const newDoc: DocItem =
        mode === "baru"
          ? { id, name: formBaru.namaDokumen, category: formBaru.kategori, kegiatan: formBaru.kegiatan, status: formBaru.status as DocStatus, unit: formBaru.unit, version: "v1.0", updatedAt: t, isRevisi: false }
          : { id, name: formRevisi.namaDokumen, category: "Revisi", kegiatan: "-", unit: "-", version: formRevisi.revisiKe, jenis: formRevisi.jenisDokumen, alasanRevisi: formRevisi.alasanRevisi, updatedAt: t, status: "Revisi", isRevisi: true };
      setDocs((prev) => [newDoc, ...prev]);
      toast.success("Dokumen ditambahkan", { description: `${newDoc.name} berhasil ditambahkan.` });
    }
    setFormOpen(false);
  };

  const handleDelete = () => {
    if (!deleteId) return;
    const doc = docs.find((d) => d.id === deleteId);
    setDocs((prev) => prev.filter((d) => d.id !== deleteId));
    toast.success("Dokumen dihapus", { description: `${doc?.name ?? "Dokumen"} telah dihapus.` });
    setDeleteId(null);
  };

  /* ── Render ─────────────────────────────────────────── */
  return (
    <AdminLayout
      title="Dokumen Pedoman"
      headerRight={
        <Button onClick={openCreate} className="rounded-xl shadow-md shadow-primary/20 gap-2">
          <Plus className="w-4 h-4" />
          Tambah Dokumen
        </Button>
      }
    >

      {/* ── Stats bar ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Total Dokumen", value: docs.length, color: "text-foreground" },
          { label: "Aktif", value: docs.filter(d => d.status === "Aktif").length, color: "text-emerald-600" },
          { label: "Revisi", value: docs.filter(d => d.status === "Revisi").length, color: "text-blue-600" },
          { label: "Arsip", value: docs.filter(d => d.status === "Arsip").length, color: "text-muted-foreground" },
        ].map((s) => (
          <div key={s.label} className="bg-card border border-border rounded-2xl px-4 py-3.5 shadow-sm">
            <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">{s.label}</p>
            <p className={`text-2xl font-black mt-0.5 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* ── Toolbar ── */}
      <div className="bg-card border border-border rounded-2xl p-4 md:p-5 shadow-sm mb-6 flex flex-col md:flex-row gap-3 md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text" value={query} onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari dokumen atau ID..."
            className="w-full bg-muted/60 border border-transparent focus:border-primary/40 focus:bg-card focus:ring-2 focus:ring-primary/15 rounded-xl pl-11 pr-4 py-2.5 text-sm placeholder:text-muted-foreground outline-none transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground hidden sm:block" />
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-full sm:w-48 rounded-xl">
              <SelectValue placeholder="Semua kategori" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua kategori</SelectItem>
              {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* ── Desktop table ── */}
      <div className="hidden md:block bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr className="text-left text-[12px] text-muted-foreground font-semibold uppercase tracking-wider">
              <th className="px-5 py-4">ID</th>
              <th className="px-5 py-4">Nama Dokumen</th>
              <th className="px-5 py-4">Kategori</th>
              <th className="px-5 py-4">Unit</th>
              <th className="px-5 py-4">Versi</th>
              <th className="px-5 py-4">Diperbarui</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={8} className="px-5 py-14 text-center text-muted-foreground text-sm">Tidak ada dokumen ditemukan.</td></tr>
            )}
            {filtered.map((d) => (
              <tr key={d.id} className="border-t border-border hover:bg-muted/25 transition-colors group">
                <td className="px-5 py-4 font-mono text-[11px] text-muted-foreground">{d.id}</td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${d.isRevisi ? "bg-blue-500/10 text-blue-600" : "bg-primary/10 text-primary"}`}>
                      {d.isRevisi ? <GitBranch className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground leading-snug">{d.name}</p>
                      {d.isRevisi && <p className="text-[10px] text-blue-500 font-semibold mt-0.5">REVISI</p>}
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-muted-foreground">{d.category}</td>
                <td className="px-5 py-4 text-muted-foreground">{d.unit}</td>
                <td className="px-5 py-4 text-muted-foreground font-mono text-xs">{d.version}</td>
                <td className="px-5 py-4 text-muted-foreground">{d.updatedAt}</td>
                <td className="px-5 py-4">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${statusBadge(d.status)}`}>
                    {d.status}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => toast(`Pratinjau: ${d.name}`)} className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors" title="Lihat"><Eye className="w-4 h-4" /></button>
                    <button onClick={() => toast.success("Unduhan dimulai", { description: d.name })} className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors" title="Unduh"><Download className="w-4 h-4" /></button>
                    <button onClick={() => openEdit(d)} className="p-2 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors" title="Edit"><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => setDeleteId(d.id)} className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors" title="Hapus"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Mobile cards ── */}
      <div className="md:hidden space-y-3">
        {filtered.length === 0 && (
          <div className="bg-card border border-border rounded-2xl p-8 text-center text-muted-foreground text-sm">Tidak ada dokumen ditemukan.</div>
        )}
        {filtered.map((d) => (
          <div key={d.id} className="bg-card border border-border rounded-2xl p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${d.isRevisi ? "bg-blue-500/10 text-blue-600" : "bg-primary/10 text-primary"}`}>
                {d.isRevisi ? <GitBranch className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-foreground truncate">{d.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{d.id} · {d.category} · {d.version}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${statusBadge(d.status)}`}>{d.status}</span>
                  <span className="text-[11px] text-muted-foreground">{d.updatedAt}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-1 mt-3 pt-3 border-t border-border">
              <button onClick={() => toast(`Pratinjau: ${d.name}`)} className="p-2 rounded-lg hover:bg-muted text-muted-foreground"><Eye className="w-4 h-4" /></button>
              <button onClick={() => toast.success("Unduhan dimulai", { description: d.name })} className="p-2 rounded-lg hover:bg-muted text-muted-foreground"><Download className="w-4 h-4" /></button>
              <button onClick={() => openEdit(d)} className="p-2 rounded-lg hover:bg-primary/10 text-primary"><Pencil className="w-4 h-4" /></button>
              <button onClick={() => setDeleteId(d.id)} className="p-2 rounded-lg hover:bg-destructive/10 text-destructive"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>

      {/* ════════════════════════════════════════════════════
          FORM DIALOG
      ════════════════════════════════════════════════════ */}
      <Dialog open={formOpen} onOpenChange={(o) => { if (!o) setFormOpen(false); }}>
        <DialogContent className="rounded-2xl max-w-2xl max-h-[92vh] overflow-y-auto p-0 gap-0">

          {/* Header */}
          <DialogHeader className="px-6 pt-6 pb-4 border-b border-border sticky top-0 bg-card z-10">
            <DialogTitle className="text-xl font-black">
              {editing ? "Edit Dokumen" : "Tambah Dokumen"}
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              {editing ? "Perbarui informasi dokumen yang sudah ada." : "Isi form sesuai jenis dokumen yang ingin ditambahkan."}
            </DialogDescription>
          </DialogHeader>

          <div className="px-6 py-5 space-y-5">

            {/* Mode Toggle */}
            <ModeToggle mode={mode} onChange={(m) => { setMode(m); setErrors({}); }} />

            {/* ── MODE: DOKUMEN BARU ── */}
            {mode === "baru" && (
              <div className="space-y-4 animate-in fade-in slide-in-from-left-2 duration-200">

                {/* Nama Dokumen */}
                <FormInput
                  label="Nama Dokumen" required
                  value={formBaru.namaDokumen}
                  onChange={(v) => setFormBaru({ ...formBaru, namaDokumen: v })}
                  placeholder="Contoh: Pedoman SPMI 2025"
                  error={errors.namaDokumen}
                />

                {/* Kategori + Status */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormSelect
                    label="Kategori" required
                    value={formBaru.kategori}
                    onValueChange={(v) => setFormBaru({ ...formBaru, kategori: v })}
                    options={CATEGORIES}
                    error={errors.kategori}
                  />
                  <FormSelect
                    label="Status" required
                    value={formBaru.status}
                    onValueChange={(v) => setFormBaru({ ...formBaru, status: v as DocStatus })}
                    options={STATUS_OPTIONS}
                    error={errors.status}
                  />
                </div>

                {/* Kegiatan */}
                <FormInput
                  label="Kegiatan" required
                  value={formBaru.kegiatan}
                  onChange={(v) => setFormBaru({ ...formBaru, kegiatan: v })}
                  placeholder="Contoh: Audit Mutu Internal"
                  error={errors.kegiatan}
                />

                {/* Unit */}
                <FormInput
                  label="Unit" required
                  value={formBaru.unit}
                  onChange={(v) => setFormBaru({ ...formBaru, unit: v })}
                  placeholder="Contoh: LPM, Fakultas Teknik"
                  error={errors.unit}
                />

                {/* Upload */}
                <FileUploadZone file={fileBaru} onChange={setFileBaru} error={errors.fileBaru} />

                {/* Tanggal Upload */}
                <FormInput
                  label="Tanggal Upload" required type="date"
                  value={formBaru.tanggalUpload}
                  onChange={(v) => setFormBaru({ ...formBaru, tanggalUpload: v })}
                  error={errors.tanggalUpload}
                />
              </div>
            )}

            {/* ── MODE: REVISI DOKUMEN ── */}
            {mode === "revisi" && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-2 duration-200">

                {/* Banner info */}
                <div className="flex items-start gap-3 p-3.5 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/50 rounded-xl">
                  <GitBranch className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <p className="text-[12px] text-blue-700 dark:text-blue-300 leading-relaxed">
                    Mode revisi akan membuat versi baru dari dokumen yang sudah ada. Pastikan mengisi alasan revisi dengan lengkap.
                  </p>
                </div>

                {/* Jenis Dokumen */}
                <FormSelect
                  label="Jenis Dokumen" required
                  value={formRevisi.jenisDokumen}
                  onValueChange={(v) => setFormRevisi({ ...formRevisi, jenisDokumen: v })}
                  options={JENIS_DOKUMEN}
                  error={errors.jenisDokumen}
                />

                {/* Revisi dari dokumen */}
                <div className="space-y-1.5">
                  <FieldLabel required>Revisi dari Dokumen</FieldLabel>
                  <Select
                    value={formRevisi.revisiDari}
                    onValueChange={(v) => {
                      const doc = docs.find(d => d.id === v);
                      setFormRevisi({ ...formRevisi, revisiDari: v, namaDokumen: doc?.name ?? "" });
                    }}
                  >
                    <SelectTrigger className={`rounded-lg text-sm h-10 ${errors.revisiDari ? "border-destructive/60" : ""}`}>
                      <SelectValue placeholder="Pilih dokumen yang akan direvisi" />
                    </SelectTrigger>
                    <SelectContent>
                      {docs.map((d) => (
                        <SelectItem key={d.id} value={d.id}>
                          <span className="font-mono text-xs text-muted-foreground mr-2">{d.id}</span>
                          {d.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <ErrorMsg msg={errors.revisiDari} />
                </div>

                {/* Nama Dokumen (auto-fill tapi bisa diedit) */}
                <FormInput
                  label="Nama Dokumen" required
                  value={formRevisi.namaDokumen}
                  onChange={(v) => setFormRevisi({ ...formRevisi, namaDokumen: v })}
                  placeholder="Nama dokumen hasil revisi"
                  error={errors.namaDokumen}
                />

                {/* Revisi ke */}
                <FormInput
                  label="Revisi ke (Versi)" required
                  value={formRevisi.revisiKe}
                  onChange={(v) => setFormRevisi({ ...formRevisi, revisiKe: v })}
                  placeholder="Contoh: v2.0, v1.1"
                  error={errors.revisiKe}
                />

                {/* Alasan Revisi */}
                <div className="space-y-1.5">
                  <FieldLabel required>Alasan Revisi</FieldLabel>
                  <textarea
                    value={formRevisi.alasanRevisi}
                    onChange={(e) => setFormRevisi({ ...formRevisi, alasanRevisi: e.target.value })}
                    placeholder="Jelaskan alasan dilakukan revisi dokumen ini..."
                    rows={3}
                    className={`
                      w-full rounded-lg border px-3 py-2.5 text-sm bg-background placeholder:text-muted-foreground
                      focus:outline-none focus:ring-2 focus:ring-ring resize-none transition-all
                      ${errors.alasanRevisi ? "border-destructive/60 focus:ring-destructive/20" : "border-input"}
                    `}
                  />
                  <div className="flex items-center justify-between">
                    <ErrorMsg msg={errors.alasanRevisi} />
                    <span className="text-[10px] text-muted-foreground ml-auto">
                      {formRevisi.alasanRevisi.length} karakter
                    </span>
                  </div>
                </div>

                {/* Upload */}
                <FileUploadZone file={fileRevisi} onChange={setFileRevisi} error={errors.fileRevisi} />

                {/* Tanggal Upload */}
                <FormInput
                  label="Tanggal Upload" required type="date"
                  value={formRevisi.tanggalUpload}
                  onChange={(v) => setFormRevisi({ ...formRevisi, tanggalUpload: v })}
                  error={errors.tanggalUpload}
                />
              </div>
            )}
          </div>

          {/* Footer */}
          <DialogFooter className="px-6 py-4 border-t border-border bg-muted/30 sticky bottom-0 gap-2 flex-row justify-end">
            <Button variant="outline" onClick={() => setFormOpen(false)} className="rounded-xl">
              <X className="w-4 h-4 mr-1.5" /> Batal
            </Button>
            <Button onClick={handleSave} className="rounded-xl shadow-md shadow-primary/20 min-w-[120px]">
              <CheckCircle2 className="w-4 h-4 mr-1.5" />
              {editing ? "Simpan Perubahan" : mode === "baru" ? "Tambah Dokumen" : "Simpan Revisi"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Delete confirmation ── */}
      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus dokumen?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Dokumen akan dihapus secara permanen dari sistem.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Hapus Dokumen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </AdminLayout>
  );
};

export default AdminDokumen;
