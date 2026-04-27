import { useMemo, useState } from "react";
import { Plus, Search, Filter, FileText, Pencil, Trash2, Download, Eye, MoreVertical } from "lucide-react";
import { toast } from "sonner";
import AdminLayout from "@/components/AdminLayout";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

type DocItem = {
  id: string;
  name: string;
  category: string;
  version: string;
  updatedAt: string;
  status: "Aktif" | "Revisi" | "Arsip";
};

const seedDocs: DocItem[] = [
  { id: "DOC-001", name: "Pedoman SPMI 2025", category: "Pedoman", version: "v2.1", updatedAt: "24 Okt 2025", status: "Aktif" },
  { id: "DOC-002", name: "Standar Pendidikan", category: "Standar", version: "v1.4", updatedAt: "22 Okt 2025", status: "Aktif" },
  { id: "DOC-003", name: "Formulir Audit Mutu", category: "Formulir", version: "v3.0", updatedAt: "20 Okt 2025", status: "Revisi" },
  { id: "DOC-004", name: "Manual Mutu Akademik", category: "Manual", version: "v1.0", updatedAt: "18 Okt 2025", status: "Aktif" },
  { id: "DOC-005", name: "Notulensi Rapat LPM", category: "Rapat", version: "v1.2", updatedAt: "15 Okt 2025", status: "Arsip" },
  { id: "DOC-006", name: "Laporan Audit Internal", category: "Audit", version: "v2.0", updatedAt: "10 Okt 2025", status: "Aktif" },
];

const CATEGORIES = ["Pedoman", "Standar", "Formulir", "Manual", "Rapat", "Audit"];

const statusBadge = (s: DocItem["status"]) =>
  s === "Aktif"
    ? "bg-emerald-500/10 text-emerald-600"
    : s === "Revisi"
    ? "bg-blue-500/10 text-blue-600"
    : "bg-muted text-muted-foreground";

const AdminDokumen = () => {
  const [docs, setDocs] = useState<DocItem[]>(seedDocs);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<string>("all");

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<DocItem | null>(null);
  const [form, setForm] = useState({ name: "", category: CATEGORIES[0], version: "v1.0", status: "Aktif" as DocItem["status"] });

  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return docs.filter((d) => {
      const matchQ = d.name.toLowerCase().includes(query.toLowerCase()) || d.id.toLowerCase().includes(query.toLowerCase());
      const matchF = filter === "all" || d.category === filter;
      return matchQ && matchF;
    });
  }, [docs, query, filter]);

  const openCreate = () => {
    setEditing(null);
    setForm({ name: "", category: CATEGORIES[0], version: "v1.0", status: "Aktif" });
    setFormOpen(true);
  };

  const openEdit = (doc: DocItem) => {
    setEditing(doc);
    setForm({ name: doc.name, category: doc.category, version: doc.version, status: doc.status });
    setFormOpen(true);
  };

  const handleSave = () => {
    if (!form.name.trim()) {
      toast.error("Nama dokumen wajib diisi");
      return;
    }
    const today = new Date().toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
    if (editing) {
      setDocs((prev) => prev.map((d) => (d.id === editing.id ? { ...d, ...form, updatedAt: today } : d)));
      toast.success("Dokumen diperbarui", { description: `${form.name} berhasil diperbarui.` });
    } else {
      const id = `DOC-${String(docs.length + 1).padStart(3, "0")}`;
      setDocs((prev) => [{ id, ...form, updatedAt: today }, ...prev]);
      toast.success("Dokumen ditambahkan", { description: `${form.name} berhasil ditambahkan.` });
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

  return (
    <AdminLayout
      title="Dokumen"
      headerRight={
        <Button onClick={openCreate} className="rounded-xl shadow-md shadow-primary/20">
          <Plus className="w-4 h-4" />
          Tambah Dokumen
        </Button>
      }
    >
      {/* Toolbar */}
      <div className="bg-card border border-border rounded-2xl p-4 md:p-5 shadow-sm mb-6 flex flex-col md:flex-row gap-3 md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
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
              {CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/60 text-muted-foreground">
            <tr className="text-left">
              <th className="px-5 py-3.5 font-semibold">ID</th>
              <th className="px-5 py-3.5 font-semibold">Nama Dokumen</th>
              <th className="px-5 py-3.5 font-semibold">Kategori</th>
              <th className="px-5 py-3.5 font-semibold">Versi</th>
              <th className="px-5 py-3.5 font-semibold">Diperbarui</th>
              <th className="px-5 py-3.5 font-semibold">Status</th>
              <th className="px-5 py-3.5 font-semibold text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-5 py-12 text-center text-muted-foreground">
                  Tidak ada dokumen ditemukan.
                </td>
              </tr>
            )}
            {filtered.map((d) => (
              <tr key={d.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                <td className="px-5 py-4 font-mono text-xs text-muted-foreground">{d.id}</td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <span className="font-semibold text-foreground">{d.name}</span>
                  </div>
                </td>
                <td className="px-5 py-4 text-muted-foreground">{d.category}</td>
                <td className="px-5 py-4 text-muted-foreground">{d.version}</td>
                <td className="px-5 py-4 text-muted-foreground">{d.updatedAt}</td>
                <td className="px-5 py-4">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${statusBadge(d.status)}`}>
                    {d.status}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => toast(`Pratinjau: ${d.name}`)}
                      className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                      title="Lihat"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => toast.success("Unduhan dimulai", { description: d.name })}
                      className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                      title="Unduh"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => openEdit(d)}
                      className="p-2 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                      title="Edit"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteId(d.id)}
                      className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                      title="Hapus"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {filtered.length === 0 && (
          <div className="bg-card border border-border rounded-2xl p-8 text-center text-muted-foreground text-sm">
            Tidak ada dokumen ditemukan.
          </div>
        )}
        {filtered.map((d) => (
          <div key={d.id} className="bg-card border border-border rounded-2xl p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-foreground truncate">{d.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{d.id} • {d.category} • {d.version}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${statusBadge(d.status)}`}>
                    {d.status}
                  </span>
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

      {/* Form dialog */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Dokumen" : "Tambah Dokumen"}</DialogTitle>
            <DialogDescription>
              {editing ? "Perbarui informasi dokumen." : "Isi detail dokumen baru."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="name">Nama Dokumen</Label>
              <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Contoh: Pedoman SPMI 2025" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Kategori</Label>
                <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="version">Versi</Label>
                <Input id="version" value={form.version} onChange={(e) => setForm({ ...form, version: e.target.value })} placeholder="v1.0" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as DocItem["status"] })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Aktif">Aktif</SelectItem>
                  <SelectItem value="Revisi">Revisi</SelectItem>
                  <SelectItem value="Arsip">Arsip</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFormOpen(false)}>Batal</Button>
            <Button onClick={handleSave}>{editing ? "Simpan Perubahan" : "Tambah"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus dokumen?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Dokumen akan dihapus permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default AdminDokumen;
