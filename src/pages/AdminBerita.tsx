import { useMemo, useRef, useState } from "react";
import {
  Plus, Search, Filter, Newspaper, Pencil, Trash2,
  Eye, X, CheckCircle2, AlertCircle, UploadCloud,
  Calendar, Tag, Star, StarOff, TrendingUp,
  BookOpen, Megaphone, MoreVertical,
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
type BeritaItem = {
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

/* ─── Constants ─────────────────────────────────────────── */
const KATEGORI_LIST = ["Audit", "Kegiatan", "Prestasi", "Pengumuman"];

const seedBerita: BeritaItem[] = [
  {
    id: "BRT-001",
    judul: "LPM Itenas Sukses Laksanakan Audit Mutu Internal Semester Ganjil 2024/2025",
    kategori: "Audit",
    ringkasan: "Audit Mutu Internal (AMI) semester ganjil tahun akademik 2024/2025 telah dilaksanakan secara menyeluruh di seluruh unit kerja Itenas.",
    isi: "Konten lengkap berita...",
    penulis: "Tim LPM Itenas",
    tanggal: "2025-10-24",
    gambar: "https://images.unsplash.com/photo-1606761568499-6d2451b23c66?w=800&auto=format&fit=crop",
    featured: true,
    tags: ["Audit", "AMI", "Mutu"],
  },
  {
    id: "BRT-002",
    judul: "Workshop Penyusunan Kurikulum Berbasis OBE bersama Seluruh Program Studi",
    kategori: "Kegiatan",
    ringkasan: "LPM Itenas menyelenggarakan workshop penyusunan kurikulum berbasis Outcome-Based Education (OBE).",
    isi: "Konten lengkap berita...",
    penulis: "Divisi Akademik LPM",
    tanggal: "2025-10-18",
    gambar: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&auto=format&fit=crop",
    featured: true,
    tags: ["Workshop", "OBE", "Kurikulum"],
  },
  {
    id: "BRT-003",
    judul: "Itenas Raih Akreditasi Unggul dari BAN-PT untuk 8 Program Studi",
    kategori: "Prestasi",
    ringkasan: "Sebanyak 8 program studi di Institut Teknologi Nasional Bandung berhasil meraih akreditasi Unggul dari BAN-PT.",
    isi: "Konten lengkap berita...",
    penulis: "Humas Itenas",
    tanggal: "2025-10-12",
    gambar: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop",
    featured: false,
    tags: ["Akreditasi", "BAN-PT", "Prestasi"],
  },
  {
    id: "BRT-004",
    judul: "Sosialisasi Standar Mutu Baru SPMI kepada Dosen dan Tendik",
    kategori: "Pengumuman",
    ringkasan: "LPM Itenas melaksanakan sosialisasi standar mutu terbaru dalam Sistem Penjaminan Mutu Internal.",
    isi: "Konten lengkap berita...",
    penulis: "Tim LPM Itenas",
    tanggal: "2025-10-05",
    gambar: "https://images.unsplash.com/photo-1558008258-3256797b43f3?w=800&auto=format&fit=crop",
    featured: false,
    tags: ["SPMI", "Sosialisasi", "Standar"],
  },
];

/* ─── Helpers ─────────────────────────────────────────────── */
const formatTanggal = (iso: string) =>
  new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });

const kategoriColor = (k: string) => ({
  Audit: "bg-amber-100 text-amber-700 ring-1 ring-amber-200",
  Kegiatan: "bg-blue-100 text-blue-700 ring-1 ring-blue-200",
  Prestasi: "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200",
  Pengumuman: "bg-violet-100 text-violet-700 ring-1 ring-violet-200",
} as Record<string, string>)[k] ?? "bg-muted text-muted-foreground";

const kategoriIcon = (k: string) => ({
  Audit: TrendingUp,
  Kegiatan: BookOpen,
  Prestasi: Newspaper,
  Pengumuman: Megaphone,
} as Record<string, React.ElementType>)[k] ?? Newspaper;

function nextId(list: BeritaItem[]) {
  return `BRT-${String(list.length + 1).padStart(3, "0")}`;
}

/* ─── Error msg ──────────────────────────────────────────── */
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
      {children}{required && <span className="text-destructive ml-0.5">*</span>}
    </Label>
  );
}

/* ─── Image Upload Zone ──────────────────────────────────── */
function ImageUploadZone({ url, onUrlChange, file, onFileChange, error }: {
  url: string; onUrlChange: (v: string) => void;
  file: File | null; onFileChange: (f: File | null) => void; error?: string;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<"url" | "file">("url");

  return (
    <div className="space-y-2">
      <FieldLabel>Gambar Berita</FieldLabel>
      <div className="flex gap-2 mb-2">
        {(["url", "file"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={`text-[12px] font-semibold px-3 py-1.5 rounded-lg border transition-all ${mode === m ? "bg-primary text-white border-primary" : "bg-muted text-muted-foreground border-border hover:border-primary/40"}`}
          >
            {m === "url" ? "URL Gambar" : "Upload File"}
          </button>
        ))}
      </div>

      {mode === "url" ? (
        <div>
          <Input
            value={url}
            onChange={(e) => onUrlChange(e.target.value)}
            placeholder="https://contoh.com/gambar.jpg"
            className={`rounded-lg text-sm h-10 ${error ? "border-destructive/60" : ""}`}
          />
          {url && (
            <div className="mt-2 rounded-xl overflow-hidden border border-border h-36">
              <img src={url} alt="preview" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = "none")} />
            </div>
          )}
        </div>
      ) : (
        <div
          onClick={() => ref.current?.click()}
          className={`flex flex-col items-center justify-center gap-2 p-5 rounded-xl border-2 border-dashed cursor-pointer transition-all ${error ? "border-destructive/50 bg-destructive/5" : "border-border hover:border-primary/50 hover:bg-primary/5"} ${file ? "border-emerald-400/60 bg-emerald-50/40" : ""}`}
        >
          <input ref={ref} type="file" accept="image/*" className="hidden"
            onChange={(e) => onFileChange(e.target.files?.[0] ?? null)} />
          {file ? (
            <div className="text-center">
              <CheckCircle2 className="w-7 h-7 text-emerald-500 mx-auto mb-1" />
              <p className="text-[13px] font-semibold text-emerald-700 truncate max-w-[200px]">{file.name}</p>
              <button type="button" onClick={(e) => { e.stopPropagation(); onFileChange(null); }}
                className="text-[11px] text-muted-foreground hover:text-destructive mt-1">Hapus</button>
            </div>
          ) : (
            <>
              <UploadCloud className="w-7 h-7 text-muted-foreground" />
              <p className="text-[13px] text-foreground/60 font-medium">Klik untuk upload gambar</p>
            </>
          )}
        </div>
      )}
      <ErrorMsg msg={error} />
    </div>
  );
}

/* ─── Tag input ──────────────────────────────────────────── */
function TagInput({ tags, onChange }: { tags: string[]; onChange: (t: string[]) => void }) {
  const [input, setInput] = useState("");

  const addTag = () => {
    const t = input.trim();
    if (t && !tags.includes(t)) onChange([...tags, t]);
    setInput("");
  };

  return (
    <div className="space-y-1.5">
      <FieldLabel>Tags</FieldLabel>
      <div className={`flex flex-wrap gap-2 min-h-[42px] px-3 py-2 rounded-lg border border-input bg-background items-center focus-within:ring-2 focus-within:ring-ring`}>
        {tags.map((t) => (
          <span key={t} className="inline-flex items-center gap-1 bg-primary/10 text-primary text-[12px] font-semibold px-2.5 py-0.5 rounded-full">
            {t}
            <button type="button" onClick={() => onChange(tags.filter((x) => x !== t))} className="hover:text-destructive ml-0.5">
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addTag(); } }}
          placeholder={tags.length ? "" : "Ketik tag, tekan Enter"}
          className="flex-1 min-w-[100px] outline-none bg-transparent text-sm placeholder:text-muted-foreground text-foreground"
        />
      </div>
      <p className="text-[11px] text-muted-foreground">Tekan Enter atau koma untuk menambahkan tag</p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════ */

type FormState = {
  judul: string; kategori: string; ringkasan: string; isi: string;
  penulis: string; tanggal: string; gambarUrl: string; featured: boolean; tags: string[];
};

const emptyForm: FormState = {
  judul: "", kategori: "", ringkasan: "", isi: "",
  penulis: "", tanggal: new Date().toISOString().slice(0, 10),
  gambarUrl: "", featured: false, tags: [],
};

const AdminBerita = () => {
  const [beritaList, setBeritaList] = useState<BeritaItem[]>(seedBerita);
  const [query, setQuery] = useState("");
  const [filterKat, setFilterKat] = useState("all");

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<BeritaItem | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [gambarFile, setGambarFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  /* ── filtered ── */
  const filtered = useMemo(() =>
    beritaList.filter((b) => {
      const q = query.toLowerCase();
      const matchQ = !q || b.judul.toLowerCase().includes(q) || b.penulis.toLowerCase().includes(q);
      const matchK = filterKat === "all" || b.kategori === filterKat;
      return matchQ && matchK;
    }), [beritaList, query, filterKat]);

  /* ── open/reset ── */
  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setGambarFile(null);
    setErrors({});
    setFormOpen(true);
  };

  const openEdit = (b: BeritaItem) => {
    setEditing(b);
    setForm({ judul: b.judul, kategori: b.kategori, ringkasan: b.ringkasan, isi: b.isi, penulis: b.penulis, tanggal: b.tanggal, gambarUrl: b.gambar, featured: b.featured, tags: b.tags });
    setGambarFile(null);
    setErrors({});
    setFormOpen(true);
  };

  /* ── validate ── */
  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.judul.trim()) e.judul = "Judul berita wajib diisi";
    if (!form.kategori) e.kategori = "Kategori wajib dipilih";
    if (!form.ringkasan.trim()) e.ringkasan = "Ringkasan wajib diisi";
    if (!form.isi.trim()) e.isi = "Isi berita wajib diisi";
    if (!form.penulis.trim()) e.penulis = "Nama penulis wajib diisi";
    if (!form.tanggal) e.tanggal = "Tanggal wajib diisi";
    return e;
  };

  /* ── save ── */
  const handleSave = () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});

    const gambar = form.gambarUrl || "https://images.unsplash.com/photo-1606761568499-6d2451b23c66?w=800&auto=format&fit=crop";

    if (editing) {
      setBeritaList((prev) => prev.map((b) => b.id === editing.id
        ? { ...b, judul: form.judul, kategori: form.kategori, ringkasan: form.ringkasan, isi: form.isi, penulis: form.penulis, tanggal: form.tanggal, gambar, featured: form.featured, tags: form.tags }
        : b));
      toast.success("Berita diperbarui", { description: form.judul });
    } else {
      const newItem: BeritaItem = { id: nextId(beritaList), judul: form.judul, kategori: form.kategori, ringkasan: form.ringkasan, isi: form.isi, penulis: form.penulis, tanggal: form.tanggal, gambar, featured: form.featured, tags: form.tags };
      setBeritaList((prev) => [newItem, ...prev]);
      toast.success("Berita ditambahkan", { description: form.judul });
    }
    setFormOpen(false);
  };

  const handleDelete = () => {
    if (!deleteId) return;
    const b = beritaList.find((x) => x.id === deleteId);
    setBeritaList((prev) => prev.filter((x) => x.id !== deleteId));
    toast.success("Berita dihapus", { description: b?.judul });
    setDeleteId(null);
  };

  const toggleFeatured = (id: string) => {
    setBeritaList((prev) => prev.map((b) => b.id === id ? { ...b, featured: !b.featured } : b));
    const b = beritaList.find((x) => x.id === id);
    toast.success(b?.featured ? "Dihapus dari unggulan" : "Ditambahkan ke unggulan", { description: b?.judul });
  };

  /* ── stats ── */
  const stats = [
    { label: "Total Berita", val: beritaList.length, color: "text-foreground" },
    { label: "Featured", val: beritaList.filter((b) => b.featured).length, color: "text-amber-600" },
    ...KATEGORI_LIST.map((k) => ({ label: k, val: beritaList.filter((b) => b.kategori === k).length, color: "text-muted-foreground" })),
  ];

  return (
    <AdminLayout
      title="Berita"
      headerRight={
        <Button onClick={openCreate} className="rounded-xl shadow-md shadow-primary/20 gap-2">
          <Plus className="w-4 h-4" />Tambah Berita
        </Button>
      }
    >
      {/* ── Stats ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        {stats.map((s) => (
          <div key={s.label} className="bg-card border border-border rounded-2xl px-4 py-3 shadow-sm">
            <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider truncate">{s.label}</p>
            <p className={`text-2xl font-black mt-0.5 ${s.color}`}>{s.val}</p>
          </div>
        ))}
      </div>

      {/* ── Toolbar ── */}
      <div className="bg-card border border-border rounded-2xl p-4 shadow-sm mb-6 flex flex-col sm:flex-row gap-3 sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text" value={query} onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari judul atau penulis..."
            className="w-full bg-muted/60 border border-transparent focus:border-primary/40 focus:bg-card focus:ring-2 focus:ring-primary/15 rounded-xl pl-11 pr-4 py-2.5 text-sm placeholder:text-muted-foreground outline-none transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground hidden sm:block" />
          <Select value={filterKat} onValueChange={setFilterKat}>
            <SelectTrigger className="w-full sm:w-44 rounded-xl">
              <SelectValue placeholder="Semua kategori" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua kategori</SelectItem>
              {KATEGORI_LIST.map((k) => <SelectItem key={k} value={k}>{k}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* ── Desktop Table ── */}
      <div className="hidden md:block bg-card border border-border rounded-2xl shadow-sm overflow-hidden mb-6">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr className="text-left text-[11px] text-muted-foreground font-bold uppercase tracking-wider">
              <th className="px-5 py-4">Berita</th>
              <th className="px-5 py-4">Kategori</th>
              <th className="px-5 py-4">Penulis</th>
              <th className="px-5 py-4">Tanggal</th>
              <th className="px-5 py-4">Unggulan</th>
              <th className="px-5 py-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="px-5 py-14 text-center text-muted-foreground text-sm">Tidak ada berita ditemukan.</td></tr>
            )}
            {filtered.map((b) => {
              const KatIcon = kategoriIcon(b.kategori);
              return (
                <tr key={b.id} className="border-t border-border hover:bg-muted/25 transition-colors group">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-10 rounded-lg overflow-hidden shrink-0 bg-muted">
                        <img src={b.gambar} alt={b.judul} className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-foreground text-[13px] line-clamp-1">{b.judul}</p>
                        <p className="text-[11px] text-muted-foreground font-mono mt-0.5">{b.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full ${kategoriColor(b.kategori)}`}>
                      <KatIcon className="w-3 h-3" />{b.kategori}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm text-muted-foreground">{b.penulis}</td>
                  <td className="px-5 py-4 text-sm text-muted-foreground whitespace-nowrap">{formatTanggal(b.tanggal)}</td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => toggleFeatured(b.id)}
                      className={`p-1.5 rounded-lg transition-colors ${b.featured ? "text-amber-500 hover:bg-amber-50" : "text-muted-foreground/40 hover:text-amber-400 hover:bg-amber-50/50"}`}
                      title={b.featured ? "Hapus dari unggulan" : "Jadikan unggulan"}
                    >
                      {b.featured ? <Star className="w-4 h-4 fill-current" /> : <StarOff className="w-4 h-4" />}
                    </button>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => toast(`Pratinjau: ${b.judul}`)} className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors" title="Pratinjau"><Eye className="w-4 h-4" /></button>
                      <button onClick={() => openEdit(b)} className="p-2 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors" title="Edit"><Pencil className="w-4 h-4" /></button>
                      <button onClick={() => setDeleteId(b.id)} className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors" title="Hapus"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ── Mobile cards ── */}
      <div className="md:hidden space-y-3 mb-6">
        {filtered.length === 0 && (
          <div className="bg-card border border-border rounded-2xl p-8 text-center text-muted-foreground text-sm">Tidak ada berita ditemukan.</div>
        )}
        {filtered.map((b) => {
          const KatIcon = kategoriIcon(b.kategori);
          return (
            <div key={b.id} className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
              <div className="flex gap-3 p-4">
                <div className="w-16 h-14 rounded-xl overflow-hidden shrink-0 bg-muted">
                  <img src={b.gambar} alt={b.judul} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-bold text-sm text-foreground line-clamp-2 leading-snug flex-1">{b.judul}</p>
                    <button
                      onClick={() => setOpenMenuId(openMenuId === b.id ? null : b.id)}
                      className="p-1 rounded-lg hover:bg-muted text-muted-foreground shrink-0"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${kategoriColor(b.kategori)}`}>
                      <KatIcon className="w-2.5 h-2.5" />{b.kategori}
                    </span>
                    {b.featured && <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />}
                    <span className="text-[11px] text-muted-foreground">{formatTanggal(b.tanggal)}</span>
                  </div>
                </div>
              </div>
              {openMenuId === b.id && (
                <div className="border-t border-border px-4 py-3 flex gap-2 bg-muted/30">
                  <button onClick={() => { toggleFeatured(b.id); setOpenMenuId(null); }} className={`flex-1 text-[12px] font-semibold py-2 rounded-lg border transition-colors ${b.featured ? "border-amber-200 bg-amber-50 text-amber-700" : "border-border text-muted-foreground hover:text-amber-600"}`}>
                    {b.featured ? "★ Unggulan" : "☆ Unggulan"}
                  </button>
                  <button onClick={() => { openEdit(b); setOpenMenuId(null); }} className="flex-1 text-[12px] font-semibold py-2 rounded-lg border border-border text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors">Edit</button>
                  <button onClick={() => { setDeleteId(b.id); setOpenMenuId(null); }} className="flex-1 text-[12px] font-semibold py-2 rounded-lg border border-border text-muted-foreground hover:text-destructive hover:border-destructive/40 transition-colors">Hapus</button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ════════════════════════════════════════════════════
          FORM DIALOG
      ════════════════════════════════════════════════════ */}
      <Dialog open={formOpen} onOpenChange={(o) => !o && setFormOpen(false)}>
        <DialogContent className="rounded-2xl max-w-2xl max-h-[92vh] overflow-y-auto p-0 gap-0">

          {/* Header */}
          <DialogHeader className="px-6 pt-6 pb-4 border-b border-border sticky top-0 bg-card z-10">
            <DialogTitle className="text-xl font-black">
              {editing ? "Edit Berita" : "Tambah Berita Baru"}
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              {editing ? "Perbarui konten berita yang sudah ada." : "Isi detail berita yang akan dipublikasikan."}
            </DialogDescription>
          </DialogHeader>

          <div className="px-6 py-5 space-y-5">

            {/* Judul */}
            <div className="space-y-1.5">
              <FieldLabel required>Judul Berita</FieldLabel>
              <Input
                value={form.judul}
                onChange={(e) => setForm({ ...form, judul: e.target.value })}
                placeholder="Masukkan judul berita yang menarik"
                className={`rounded-lg text-sm h-10 ${errors.judul ? "border-destructive/60" : ""}`}
              />
              <ErrorMsg msg={errors.judul} />
            </div>

            {/* Kategori + Penulis */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <FieldLabel required>Kategori</FieldLabel>
                <Select value={form.kategori} onValueChange={(v) => setForm({ ...form, kategori: v })}>
                  <SelectTrigger className={`rounded-lg text-sm h-10 ${errors.kategori ? "border-destructive/60" : ""}`}>
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    {KATEGORI_LIST.map((k) => <SelectItem key={k} value={k}>{k}</SelectItem>)}
                  </SelectContent>
                </Select>
                <ErrorMsg msg={errors.kategori} />
              </div>
              <div className="space-y-1.5">
                <FieldLabel required>Penulis</FieldLabel>
                <Input
                  value={form.penulis}
                  onChange={(e) => setForm({ ...form, penulis: e.target.value })}
                  placeholder="Nama penulis / divisi"
                  className={`rounded-lg text-sm h-10 ${errors.penulis ? "border-destructive/60" : ""}`}
                />
                <ErrorMsg msg={errors.penulis} />
              </div>
            </div>

            {/* Tanggal + Featured */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <FieldLabel required>Tanggal Publikasi</FieldLabel>
                <Input
                  type="date"
                  value={form.tanggal}
                  onChange={(e) => setForm({ ...form, tanggal: e.target.value })}
                  className={`rounded-lg text-sm h-10 ${errors.tanggal ? "border-destructive/60" : ""}`}
                />
                <ErrorMsg msg={errors.tanggal} />
              </div>
              <div className="space-y-1.5">
                <FieldLabel>Berita Unggulan</FieldLabel>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, featured: !form.featured })}
                  className={`w-full h-10 flex items-center gap-2.5 px-3.5 rounded-lg border text-sm font-semibold transition-all ${form.featured ? "bg-amber-50 border-amber-300 text-amber-700" : "bg-muted/50 border-border text-muted-foreground hover:border-amber-300 hover:text-amber-600"}`}
                >
                  {form.featured ? <Star className="w-4 h-4 fill-current" /> : <StarOff className="w-4 h-4" />}
                  {form.featured ? "Berita Unggulan Aktif" : "Jadikan Berita Unggulan"}
                </button>
              </div>
            </div>

            {/* Ringkasan */}
            <div className="space-y-1.5">
              <FieldLabel required>Ringkasan</FieldLabel>
              <textarea
                value={form.ringkasan}
                onChange={(e) => setForm({ ...form, ringkasan: e.target.value })}
                placeholder="Ringkasan singkat berita (tampil di halaman daftar berita)..."
                rows={2}
                className={`w-full rounded-lg border px-3 py-2.5 text-sm bg-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none transition-all ${errors.ringkasan ? "border-destructive/60" : "border-input"}`}
              />
              <div className="flex justify-between items-center">
                <ErrorMsg msg={errors.ringkasan} />
                <span className="text-[11px] text-muted-foreground ml-auto">{form.ringkasan.length} karakter</span>
              </div>
            </div>

            {/* Isi */}
            <div className="space-y-1.5">
              <FieldLabel required>Isi Berita</FieldLabel>
              <textarea
                value={form.isi}
                onChange={(e) => setForm({ ...form, isi: e.target.value })}
                placeholder="Tulis konten lengkap berita di sini..."
                rows={6}
                className={`w-full rounded-lg border px-3 py-2.5 text-sm bg-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none transition-all ${errors.isi ? "border-destructive/60" : "border-input"}`}
              />
              <div className="flex justify-between items-center">
                <ErrorMsg msg={errors.isi} />
                <span className="text-[11px] text-muted-foreground ml-auto">{form.isi.length} karakter</span>
              </div>
            </div>

            {/* Gambar */}
            <ImageUploadZone
              url={form.gambarUrl} onUrlChange={(v) => setForm({ ...form, gambarUrl: v })}
              file={gambarFile} onFileChange={setGambarFile}
              error={errors.gambar}
            />

            {/* Tags */}
            <TagInput tags={form.tags} onChange={(t) => setForm({ ...form, tags: t })} />
          </div>

          {/* Footer */}
          <DialogFooter className="px-6 py-4 border-t border-border bg-muted/30 sticky bottom-0 gap-2 flex-row justify-end">
            <Button variant="outline" onClick={() => setFormOpen(false)} className="rounded-xl">
              <X className="w-4 h-4 mr-1.5" />Batal
            </Button>
            <Button onClick={handleSave} className="rounded-xl shadow-md shadow-primary/20 min-w-[130px]">
              <CheckCircle2 className="w-4 h-4 mr-1.5" />
              {editing ? "Simpan Perubahan" : "Publikasikan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Delete confirm ── */}
      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus berita ini?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Berita akan dihapus permanen dari sistem.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Hapus Berita
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </AdminLayout>
  );
};

export default AdminBerita;
