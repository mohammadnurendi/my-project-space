/**
 * AdminBerita — CRUD Berita via backend Laravel API.
 */
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { beritaApi, type ApiBerita, type BeritaInput } from "@/services/beritaApi";
import type { ApiError } from "@/services/api";
import {
  Plus, Search, Filter, Newspaper, Pencil, Trash2,
  X, CheckCircle2, AlertCircle, UploadCloud,
  Star, StarOff, TrendingUp, BookOpen, Megaphone,
  MoreVertical, Loader2, Bold, Italic, Heading2, List, Quote,
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

const KATEGORI_LIST = ["Audit", "Kegiatan", "Prestasi", "Pengumuman", "Sosialisasi", "Workshop", "Akreditasi"];

const formatTanggal = (iso: string) =>
  new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });

const kategoriColor = (k: string) =>
  (({
    Audit: "bg-amber-100 text-amber-700 ring-1 ring-amber-200",
    Kegiatan: "bg-blue-100 text-blue-700 ring-1 ring-blue-200",
    Prestasi: "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200",
    Pengumuman: "bg-violet-100 text-violet-700 ring-1 ring-violet-200",
    Sosialisasi: "bg-sky-100 text-sky-700 ring-1 ring-sky-200",
    Workshop: "bg-orange-100 text-orange-700 ring-1 ring-orange-200",
    Akreditasi: "bg-rose-100 text-rose-700 ring-1 ring-rose-200",
  } as Record<string,string>)[k] ?? "bg-muted text-muted-foreground");

const kategoriIcon = (k: string) =>
  (({
    Audit: TrendingUp, Kegiatan: BookOpen, Prestasi: Newspaper,
    Pengumuman: Megaphone, Sosialisasi: Megaphone,
    Workshop: BookOpen, Akreditasi: TrendingUp,
  } as Record<string, React.ElementType>)[k] ?? Newspaper);

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

function ImageUploadZone({ files, onFilesChange, existingUrls = [], error }: {
  files: File[]; onFilesChange: (files: File[]) => void;
  existingUrls?: string[]; error?: string;
}) {
  const ref = useRef<HTMLInputElement>(null);

  const handleFiles = (list: FileList | null) => {
    const selected = Array.from(list ?? []).filter((file) => file.type.startsWith("image/"));
    const limited = selected.slice(0, 3);
    if (selected.length > 3) toast.error("Maksimal 3 foto berita");
    onFilesChange(limited);
  };

  return (
    <div className="space-y-2">
      <FieldLabel>Foto Berita</FieldLabel>
      <div
        onClick={() => ref.current?.click()}
        className={`flex flex-col items-center justify-center gap-2 p-5 rounded-xl border-2 border-dashed cursor-pointer transition-all
          ${error ? "border-destructive/50 bg-destructive/5" : "border-border hover:border-primary/50 hover:bg-primary/5"}
          ${files.length ? "border-emerald-400/60 bg-emerald-50/40" : ""}`}
      >
        <input ref={ref} type="file" accept="image/*" multiple className="hidden"
          onChange={(e) => handleFiles(e.target.files)} />
        {files.length ? (
          <div className="text-center">
            <CheckCircle2 className="w-7 h-7 text-emerald-500 mx-auto mb-1" />
            <p className="text-[13px] font-semibold text-emerald-700 truncate max-w-[240px]">{files.length} foto dipilih</p>
            <p className="text-[11px] text-muted-foreground truncate max-w-[260px]">{files.map((file) => file.name).join(", ")}</p>
            <button type="button" onClick={(e) => { e.stopPropagation(); onFilesChange([]); }}
              className="text-[11px] text-muted-foreground hover:text-destructive mt-1">Hapus</button>
          </div>
        ) : (
          <>
            <UploadCloud className="w-7 h-7 text-muted-foreground" />
            <p className="text-[13px] text-foreground/60 font-medium">
              {existingUrls.length ? "Klik untuk ganti foto" : "Klik untuk upload 1-3 foto (opsional)"}
            </p>
          </>
        )}
      </div>
      {!files.length && existingUrls.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {existingUrls.map((url, i) => (
            <div key={url} className="rounded-xl overflow-hidden border border-border h-24 bg-muted">
              <img src={url} alt={`Foto berita ${i + 1}`} className="w-full h-full object-cover"
                onError={(e) => (e.currentTarget.style.display = "none")} />
            </div>
          ))}
        </div>
      )}
      <p className="text-[11px] text-muted-foreground">Foto pertama menjadi foto utama. Maksimal 3 foto, masing-masing 2MB.</p>
      <ErrorMsg msg={error} />
    </div>
  );
}

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
      <p className="text-[11px] text-muted-foreground">
        Ketik satu tag lalu tekan Enter untuk menambahkan tag.
      </p>
      <div className="flex flex-wrap gap-2 min-h-[42px] px-3 py-2 rounded-lg border border-input bg-background items-center">
        {tags.map((t) => (
          <span key={t} className="inline-flex items-center gap-1 bg-primary/10 text-primary text-[12px] font-semibold px-2.5 py-0.5 rounded-full">
            {t}
            <button type="button" onClick={() => onChange(tags.filter((x) => x !== t))} className="hover:text-destructive ml-0.5">
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        <input
          value={input} onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addTag(); } }}
          placeholder={tags.length ? "" : "Ketik tag, tekan Enter"}
          className="flex-1 min-w-[100px] outline-none bg-transparent text-sm placeholder:text-muted-foreground"
        />
      </div>
    </div>
  );
}

type FormState = {
  judul: string; kategori: string; ringkasan: string; isi: string;
  penulis: string; tanggal: string; featured: boolean; tags: string[];
};
const emptyForm: FormState = {
  judul: "", kategori: "", ringkasan: "", isi: "",
  penulis: "", tanggal: new Date().toISOString().slice(0, 10),
  featured: false, tags: [],
};

const AdminBerita = () => {
  const [beritaList, setBeritaList] = useState<ApiBerita[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [saving, setSaving] = useState(false);
  const [query, setQuery] = useState("");
  const [filterKat, setFilterKat] = useState("all");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<ApiBerita | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [gambarFiles, setGambarFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const isiRef = useRef<HTMLTextAreaElement>(null);

  const reload = useCallback(async () => {
    setLoadingList(true);
    try {
      const data = await beritaApi.list();
      setBeritaList(data);
    } catch {
      toast.error("Gagal memuat berita dari server");
    } finally {
      setLoadingList(false);
    }
  }, []);

  useEffect(() => { reload(); }, [reload]);

  const filtered = useMemo(() =>
    beritaList.filter((b) => {
      const q = query.toLowerCase();
      const matchQ = !q || b.judul.toLowerCase().includes(q) || b.penulis.toLowerCase().includes(q);
      const matchK = filterKat === "all" || b.kategori === filterKat;
      return matchQ && matchK;
    }), [beritaList, query, filterKat]);

  const openCreate = () => {
    setEditing(null); setForm(emptyForm); setGambarFiles([]); setErrors({}); setFormOpen(true);
  };

  const openEdit = (b: ApiBerita) => {
    setEditing(b);
    setForm({
      judul: b.judul, kategori: b.kategori, ringkasan: b.ringkasan, isi: b.isi,
      penulis: b.penulis, tanggal: b.tanggal?.slice(0, 10) ?? new Date().toISOString().slice(0, 10),
      featured: b.featured, tags: b.tags ?? [],
    });
    setGambarFiles([]); setErrors({}); setFormOpen(true);
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.judul.trim()) e.judul = "Judul wajib diisi";
    if (!form.kategori) e.kategori = "Kategori wajib dipilih";
    if (!form.ringkasan.trim()) e.ringkasan = "Ringkasan wajib diisi";
    if (!form.isi.trim()) e.isi = "Isi berita wajib diisi";
    if (!form.penulis.trim()) e.penulis = "Penulis wajib diisi";
    if (!form.tanggal) e.tanggal = "Tanggal wajib diisi";
    return e;
  };

  const insertFormat = (before: string, after = "", fallback = "teks") => {
    const textarea = isiRef.current;
    const value = form.isi;
    const start = textarea?.selectionStart ?? value.length;
    const end = textarea?.selectionEnd ?? value.length;
    const selected = value.slice(start, end) || fallback;
    const next = `${value.slice(0, start)}${before}${selected}${after}${value.slice(end)}`;

    setForm((current) => ({ ...current, isi: next }));

    requestAnimationFrame(() => {
      textarea?.focus();
      const cursorStart = start + before.length;
      const cursorEnd = cursorStart + selected.length;
      textarea?.setSelectionRange(cursorStart, cursorEnd);
    });
  };

  const insertList = () => {
    const textarea = isiRef.current;
    const value = form.isi;
    const start = textarea?.selectionStart ?? value.length;
    const end = textarea?.selectionEnd ?? value.length;
    const selected = value.slice(start, end);
    const listText = selected
      ? selected.split("\n").map((line) => `- ${line.replace(/^[-*]\s+/, "")}`).join("\n")
      : "- Poin pertama\n- Poin kedua";
    const needsSpacing = start > 0 && !value.slice(0, start).endsWith("\n\n");
    const prefix = needsSpacing ? "\n\n" : "";
    const next = `${value.slice(0, start)}${prefix}${listText}${value.slice(end)}`;

    setForm((current) => ({ ...current, isi: next }));
    requestAnimationFrame(() => textarea?.focus());
  };

  const handleSave = async () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({}); setSaving(true);
    const payload: BeritaInput = {
      judul: form.judul, kategori: form.kategori, ringkasan: form.ringkasan,
      isi: form.isi, penulis: form.penulis, tanggal: form.tanggal,
      featured: form.featured, tags: form.tags,
      ...(gambarFiles.length ? { gambar: gambarFiles[0], gambar_lain: gambarFiles.slice(1) } : {}),
    };
    try {
      if (editing) {
        await beritaApi.update(editing.id, payload);
        toast.success("Berita diperbarui", { description: form.judul });
      } else {
        await beritaApi.create(payload);
        toast.success("Berita dipublikasikan", { description: form.judul });
      }
      setFormOpen(false); reload();
    } catch (e: any) {
      const apiErr = e as ApiError;
      if (apiErr.errors) {
        const mapped: Record<string, string> = {};
        Object.entries(apiErr.errors).forEach(([k, v]) => { mapped[k] = v[0]; });
        setErrors(mapped);
        toast.error("Gagal menyimpan", { description: Object.values(mapped)[0] });
      } else {
        toast.error("Gagal menyimpan", { description: apiErr.message });
      }
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const b = beritaList.find((x) => x.id === deleteId);
    try {
      await beritaApi.remove(deleteId);
      toast.success("Berita dihapus", { description: b?.judul });
      reload();
    } catch { toast.error("Gagal menghapus berita"); }
    finally { setDeleteId(null); }
  };

  const toggleFeatured = async (b: ApiBerita) => {
    try {
      await beritaApi.update(b.id, { featured: !b.featured });
      toast.success(b.featured ? "Dihapus dari unggulan" : "Ditambahkan ke unggulan", { description: b.judul });
      reload();
    } catch { toast.error("Gagal mengubah status unggulan"); }
  };

  return (
    <AdminLayout title="Berita" headerRight={
      <Button onClick={openCreate} className="rounded-xl shadow-md shadow-primary/20 gap-2">
        <Plus className="w-4 h-4" />Tambah Berita
      </Button>
    }>
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Total Berita", val: beritaList.length, color: "text-foreground" },
          { label: "Featured", val: beritaList.filter((b) => b.featured).length, color: "text-amber-600" },
        ].map((s) => (
          <div key={s.label} className="bg-card border border-border rounded-2xl px-4 py-3 shadow-sm">
            <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">{s.label}</p>
            <p className={`text-2xl font-black mt-0.5 ${s.color}`}>{s.val}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="bg-card border border-border rounded-2xl p-4 shadow-sm mb-6 flex flex-col sm:flex-row gap-3 sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input type="text" value={query} onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari judul atau penulis..."
            className="w-full bg-muted/60 border border-transparent focus:border-primary/40 focus:bg-card focus:ring-2 focus:ring-primary/15 rounded-xl pl-11 pr-4 py-2.5 text-sm placeholder:text-muted-foreground outline-none transition-all" />
        </div>
        <Select value={filterKat} onValueChange={setFilterKat}>
          <SelectTrigger className="w-full sm:w-44 rounded-xl"><SelectValue placeholder="Semua kategori" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua kategori</SelectItem>
            {KATEGORI_LIST.map((k) => <SelectItem key={k} value={k}>{k}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Loading */}
      {loadingList && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="ml-3 text-muted-foreground">Memuat berita...</span>
        </div>
      )}

      {/* Table */}
      {!loadingList && (
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
                <tr><td colSpan={6} className="px-5 py-14 text-center text-muted-foreground">Tidak ada berita.</td></tr>
              )}
              {filtered.map((b) => {
                const KatIcon = kategoriIcon(b.kategori);
                return (
                  <tr key={b.id} className="border-t border-border hover:bg-muted/25 transition-colors group">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-10 rounded-lg overflow-hidden shrink-0 bg-muted">
                          {b.gambar_url && <img src={b.gambar_url} alt={b.judul} className="w-full h-full object-cover" />}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-foreground text-[13px] line-clamp-1">{b.judul}</p>
                          <p className="text-[11px] text-muted-foreground font-mono mt-0.5">#{b.id}</p>
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
                      <button onClick={() => toggleFeatured(b)}
                        className={`p-1.5 rounded-lg transition-colors ${b.featured ? "text-amber-500 hover:bg-amber-50" : "text-muted-foreground/40 hover:text-amber-400"}`}>
                        {b.featured ? <Star className="w-4 h-4 fill-current" /> : <StarOff className="w-4 h-4" />}
                      </button>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openEdit(b)} className="p-2 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"><Pencil className="w-4 h-4" /></button>
                        <button onClick={() => setDeleteId(b.id)} className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Mobile */}
      {!loadingList && (
        <div className="md:hidden space-y-3 mb-6">
          {filtered.map((b) => {
            const KatIcon = kategoriIcon(b.kategori);
            return (
              <div key={b.id} className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
                <div className="flex gap-3 p-4">
                  <div className="w-16 h-14 rounded-xl overflow-hidden shrink-0 bg-muted">
                    {b.gambar_url && <img src={b.gambar_url} alt={b.judul} className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-bold text-sm line-clamp-2 flex-1">{b.judul}</p>
                      <button onClick={() => setOpenMenuId(openMenuId === b.id ? null : b.id)} className="p-1 rounded-lg hover:bg-muted text-muted-foreground">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${kategoriColor(b.kategori)}`}>
                        <KatIcon className="w-2.5 h-2.5" />{b.kategori}
                      </span>
                      {b.featured && <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />}
                    </div>
                  </div>
                </div>
                {openMenuId === b.id && (
                  <div className="border-t border-border px-4 py-3 flex gap-2 bg-muted/30">
                    <button onClick={() => { toggleFeatured(b); setOpenMenuId(null); }}
                      className="flex-1 text-[12px] font-semibold py-2 rounded-lg border border-border text-muted-foreground hover:text-amber-600">
                      {b.featured ? "★ Unggulan" : "☆ Unggulan"}
                    </button>
                    <button onClick={() => { openEdit(b); setOpenMenuId(null); }}
                      className="flex-1 text-[12px] font-semibold py-2 rounded-lg border border-border text-muted-foreground hover:text-primary">Edit</button>
                    <button onClick={() => { setDeleteId(b.id); setOpenMenuId(null); }}
                      className="flex-1 text-[12px] font-semibold py-2 rounded-lg border border-border text-muted-foreground hover:text-destructive">Hapus</button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Form Dialog */}
      <Dialog open={formOpen} onOpenChange={(o) => !o && setFormOpen(false)}>
        <DialogContent className="rounded-2xl max-w-2xl max-h-[92vh] overflow-y-auto p-0 gap-0">
          <DialogHeader className="px-6 pt-6 pb-4 border-b border-border sticky top-0 bg-card z-10">
            <DialogTitle className="text-xl font-black">{editing ? "Edit Berita" : "Tambah Berita Baru"}</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              {editing ? "Perbarui konten berita." : "Isi detail berita yang akan dipublikasikan."}
            </DialogDescription>
          </DialogHeader>
          <div className="px-6 py-5 space-y-5">
            <div className="space-y-1.5">
              <FieldLabel required>Judul Berita</FieldLabel>
              <Input value={form.judul} onChange={(e) => setForm({ ...form, judul: e.target.value })}
                placeholder="Masukkan judul berita"
                className={`rounded-lg text-sm h-10 ${errors.judul ? "border-destructive/60" : ""}`} />
              <ErrorMsg msg={errors.judul} />
            </div>
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
                <Input value={form.penulis} onChange={(e) => setForm({ ...form, penulis: e.target.value })}
                  placeholder="Nama penulis / divisi"
                  className={`rounded-lg text-sm h-10 ${errors.penulis ? "border-destructive/60" : ""}`} />
                <ErrorMsg msg={errors.penulis} />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <FieldLabel required>Tanggal</FieldLabel>
                <Input type="date" value={form.tanggal} onChange={(e) => setForm({ ...form, tanggal: e.target.value })}
                  className={`rounded-lg text-sm h-10 ${errors.tanggal ? "border-destructive/60" : ""}`} />
                <ErrorMsg msg={errors.tanggal} />
              </div>
              <div className="space-y-1.5">
                <FieldLabel>Unggulan</FieldLabel>
                <button type="button" onClick={() => setForm({ ...form, featured: !form.featured })}
                  className={`w-full h-10 flex items-center gap-2.5 px-3.5 rounded-lg border text-sm font-semibold transition-all
                    ${form.featured ? "bg-amber-50 border-amber-300 text-amber-700" : "bg-muted/50 border-border text-muted-foreground"}`}>
                  {form.featured ? <Star className="w-4 h-4 fill-current" /> : <StarOff className="w-4 h-4" />}
                  {form.featured ? "Unggulan Aktif" : "Jadikan Unggulan"}
                </button>
              </div>
            </div>
            <div className="space-y-1.5">
              <FieldLabel required>Ringkasan</FieldLabel>
              <textarea value={form.ringkasan} onChange={(e) => setForm({ ...form, ringkasan: e.target.value })}
                placeholder="Ringkasan singkat..." rows={2}
                className={`w-full rounded-lg border px-3 py-2.5 text-sm bg-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none ${errors.ringkasan ? "border-destructive/60" : "border-input"}`} />
              <ErrorMsg msg={errors.ringkasan} />
            </div>
            <div className="space-y-1.5">
              <FieldLabel required>Isi Berita</FieldLabel>
              <div className="flex flex-wrap gap-1 rounded-lg border border-input bg-muted/30 p-1.5">
                <button type="button" onClick={() => insertFormat("**", "**", "teks tebal")} className="inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-semibold text-muted-foreground hover:bg-background hover:text-foreground">
                  <Bold className="w-3.5 h-3.5" />Bold
                </button>
                <button type="button" onClick={() => insertFormat("*", "*", "teks miring")} className="inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-semibold text-muted-foreground hover:bg-background hover:text-foreground">
                  <Italic className="w-3.5 h-3.5" />Italic
                </button>
                <button type="button" onClick={() => insertFormat("\n\n## ", "", "Subjudul")} className="inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-semibold text-muted-foreground hover:bg-background hover:text-foreground">
                  <Heading2 className="w-3.5 h-3.5" />Subjudul
                </button>
                <button type="button" onClick={insertList} className="inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-semibold text-muted-foreground hover:bg-background hover:text-foreground">
                  <List className="w-3.5 h-3.5" />List
                </button>
                <button type="button" onClick={() => insertFormat("\n\n> ", "", "Kutipan penting")} className="inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-semibold text-muted-foreground hover:bg-background hover:text-foreground">
                  <Quote className="w-3.5 h-3.5" />Kutipan
                </button>
              </div>
              <textarea ref={isiRef} value={form.isi} onChange={(e) => setForm({ ...form, isi: e.target.value })}
                placeholder={"Tulis konten lengkap berita di sini...\n\nContoh: pilih teks lalu klik Bold, atau klik Subjudul untuk membuat bagian baru."} rows={8}
                className={`w-full rounded-lg border px-3 py-2.5 text-sm bg-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none ${errors.isi ? "border-destructive/60" : "border-input"}`} />
              <p className="text-[11px] text-muted-foreground">
                Format yang didukung: bold, italic, subjudul, list, dan kutipan. Hasilnya akan tampil rapi di halaman detail berita.
              </p>
              <ErrorMsg msg={errors.isi} />
            </div>
            <ImageUploadZone files={gambarFiles} onFilesChange={setGambarFiles} existingUrls={editing?.gambar_urls ?? (editing?.gambar_url ? [editing.gambar_url] : [])} error={errors.gambar ?? errors.gambar_lain} />
            <TagInput tags={form.tags} onChange={(t) => setForm({ ...form, tags: t })} />
          </div>
          <DialogFooter className="px-6 py-4 border-t border-border bg-muted/30 sticky bottom-0 gap-2 flex-row justify-end">
            <Button variant="outline" onClick={() => setFormOpen(false)} className="rounded-xl" disabled={saving}>
              <X className="w-4 h-4 mr-1.5" />Batal
            </Button>
            <Button onClick={handleSave} className="rounded-xl min-w-[130px]" disabled={saving}>
              {saving ? <Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> : <CheckCircle2 className="w-4 h-4 mr-1.5" />}
              {editing ? "Simpan" : "Publikasikan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus berita ini?</AlertDialogTitle>
            <AlertDialogDescription>Tindakan ini tidak dapat dibatalkan.</AlertDialogDescription>
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
