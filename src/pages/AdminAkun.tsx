import { useMemo, useState } from "react";
import { Plus, Search, Pencil, Trash2, Mail, Shield, User as UserIcon } from "lucide-react";
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

type Account = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  status: "Aktif" | "Nonaktif";
  joinedAt: string;
};

const seed: Account[] = [
  { id: "U-001", name: "Admin LPM", email: "admin@lpm.com", role: "admin", status: "Aktif", joinedAt: "01 Jan 2025" },
  { id: "U-002", name: "Budi Santoso", email: "budi@itenas.ac.id", role: "user", status: "Aktif", joinedAt: "12 Feb 2025" },
  { id: "U-003", name: "Sinta Dewi", email: "sinta@itenas.ac.id", role: "user", status: "Aktif", joinedAt: "03 Mar 2025" },
  { id: "U-004", name: "Rahmat Hidayat", email: "rahmat@itenas.ac.id", role: "user", status: "Nonaktif", joinedAt: "20 Mar 2025" },
  { id: "U-005", name: "Dewi Kartika", email: "dewi@itenas.ac.id", role: "user", status: "Aktif", joinedAt: "08 Apr 2025" },
];

const AdminAkun = () => {
  const [accounts, setAccounts] = useState<Account[]>(seed);
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Account | null>(null);
  const [form, setForm] = useState({ name: "", email: "", role: "user" as Account["role"], status: "Aktif" as Account["status"] });
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return accounts.filter((a) => {
      const matchQ = a.name.toLowerCase().includes(query.toLowerCase()) || a.email.toLowerCase().includes(query.toLowerCase());
      const matchR = roleFilter === "all" || a.role === roleFilter;
      return matchQ && matchR;
    });
  }, [accounts, query, roleFilter]);

  const openCreate = () => {
    setEditing(null);
    setForm({ name: "", email: "", role: "user", status: "Aktif" });
    setFormOpen(true);
  };

  const openEdit = (a: Account) => {
    setEditing(a);
    setForm({ name: a.name, email: a.email, role: a.role, status: a.status });
    setFormOpen(true);
  };

  const handleSave = () => {
    if (!form.name.trim() || !form.email.trim()) {
      toast.error("Nama dan email wajib diisi");
      return;
    }
    if (editing) {
      setAccounts((prev) => prev.map((a) => (a.id === editing.id ? { ...a, ...form } : a)));
      toast.success("Akun diperbarui", { description: `${form.name} berhasil diperbarui.` });
    } else {
      const id = `U-${String(accounts.length + 1).padStart(3, "0")}`;
      const today = new Date().toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
      setAccounts((prev) => [{ id, ...form, joinedAt: today }, ...prev]);
      toast.success("Akun ditambahkan", { description: `${form.email} berhasil dibuat.` });
    }
    setFormOpen(false);
  };

  const handleDelete = () => {
    if (!deleteId) return;
    const a = accounts.find((x) => x.id === deleteId);
    setAccounts((prev) => prev.filter((x) => x.id !== deleteId));
    toast.success("Akun dihapus", { description: `${a?.name ?? "Akun"} telah dihapus.` });
    setDeleteId(null);
  };

  const toggleStatus = (a: Account) => {
    const next: Account["status"] = a.status === "Aktif" ? "Nonaktif" : "Aktif";
    setAccounts((prev) => prev.map((x) => (x.id === a.id ? { ...x, status: next } : x)));
    toast(`Status diubah ke ${next}`, { description: a.email });
  };

  return (
    <AdminLayout
      title="Akun"
      headerRight={
        <Button onClick={openCreate} className="rounded-xl shadow-md shadow-primary/20">
          <Plus className="w-4 h-4" />
          Tambah Akun
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
            placeholder="Cari nama atau email..."
            className="w-full bg-muted/60 border border-transparent focus:border-primary/40 focus:bg-card focus:ring-2 focus:ring-primary/15 rounded-xl pl-11 pr-4 py-2.5 text-sm placeholder:text-muted-foreground outline-none transition-all"
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-full md:w-48 rounded-xl">
            <SelectValue placeholder="Semua peran" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua peran</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="user">User</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/60 text-muted-foreground">
            <tr className="text-left">
              <th className="px-5 py-3.5 font-semibold">Pengguna</th>
              <th className="px-5 py-3.5 font-semibold">Email</th>
              <th className="px-5 py-3.5 font-semibold">Peran</th>
              <th className="px-5 py-3.5 font-semibold">Bergabung</th>
              <th className="px-5 py-3.5 font-semibold">Status</th>
              <th className="px-5 py-3.5 font-semibold text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="px-5 py-12 text-center text-muted-foreground">Tidak ada akun ditemukan.</td></tr>
            )}
            {filtered.map((a) => (
              <tr key={a.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/15 text-primary flex items-center justify-center font-bold shrink-0">
                      {a.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{a.name}</p>
                      <p className="text-xs text-muted-foreground">{a.id}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-muted-foreground">{a.email}</td>
                <td className="px-5 py-4">
                  <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${a.role === "admin" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                    {a.role === "admin" ? <Shield className="w-3 h-3" /> : <UserIcon className="w-3 h-3" />}
                    {a.role}
                  </span>
                </td>
                <td className="px-5 py-4 text-muted-foreground">{a.joinedAt}</td>
                <td className="px-5 py-4">
                  <button
                    onClick={() => toggleStatus(a)}
                    className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full transition-colors ${a.status === "Aktif" ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
                  >
                    {a.status}
                  </button>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => toast(`Email dikirim ke ${a.email}`)}
                      className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                      title="Kirim email"
                    >
                      <Mail className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => openEdit(a)}
                      className="p-2 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                      title="Edit"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteId(a.id)}
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
            Tidak ada akun ditemukan.
          </div>
        )}
        {filtered.map((a) => (
          <div key={a.id} className="bg-card border border-border rounded-2xl p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="w-11 h-11 rounded-full bg-primary/15 text-primary flex items-center justify-center font-bold shrink-0">
                {a.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-foreground truncate">{a.name}</p>
                <p className="text-xs text-muted-foreground truncate">{a.email}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${a.role === "admin" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                    {a.role}
                  </span>
                  <button
                    onClick={() => toggleStatus(a)}
                    className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${a.status === "Aktif" ? "bg-emerald-500/10 text-emerald-600" : "bg-muted text-muted-foreground"}`}
                  >
                    {a.status}
                  </button>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-1 mt-3 pt-3 border-t border-border">
              <button onClick={() => toast(`Email dikirim ke ${a.email}`)} className="p-2 rounded-lg hover:bg-muted text-muted-foreground"><Mail className="w-4 h-4" /></button>
              <button onClick={() => openEdit(a)} className="p-2 rounded-lg hover:bg-primary/10 text-primary"><Pencil className="w-4 h-4" /></button>
              <button onClick={() => setDeleteId(a.id)} className="p-2 rounded-lg hover:bg-destructive/10 text-destructive"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>

      {/* Form */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Akun" : "Tambah Akun"}</DialogTitle>
            <DialogDescription>
              {editing ? "Perbarui informasi pengguna." : "Buat akun pengguna baru."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="aname">Nama Lengkap</Label>
              <Input id="aname" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nama pengguna" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="aemail">Email</Label>
              <Input id="aemail" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="email@itenas.ac.id" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Peran</Label>
                <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v as Account["role"] })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as Account["status"] })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Aktif">Aktif</SelectItem>
                    <SelectItem value="Nonaktif">Nonaktif</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFormOpen(false)}>Batal</Button>
            <Button onClick={handleSave}>{editing ? "Simpan Perubahan" : "Tambah"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus akun?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Akun pengguna akan dihapus permanen.
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

export default AdminAkun;
