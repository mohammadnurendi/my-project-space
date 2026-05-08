import { Link } from "react-router-dom";
import { BookOpen, Users, FileCheck2, TrendingUp, ArrowUpRight, Clock, Plus, Loader2 } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { dokumenApi, kategoriApi } from "@/services/dokumenApi";
import { beritaApi } from "@/services/beritaApi";

type RecentItem = { name: string; date: string; action: string };

const Admin = () => {
  const { name } = useAuth();
  const displayName = name?.trim() || "Admin";

  const [loading, setLoading] = useState(true);
  const [totalDokumen, setTotalDokumen] = useState(0);
  const [revisiCount, setRevisiCount] = useState(0);
  const [categories, setCategories] = useState<{ title: string; count: number; to: string }[]>([]);
  const [recent, setRecent] = useState<RecentItem[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [kategoris, dokumens, beritas] = await Promise.all([
          kategoriApi.list(),
          dokumenApi.list(),
          beritaApi.list(),
        ]);

        setTotalDokumen(dokumens.length);

        // Hitung dokumen yang ditambah bulan ini
        const now = new Date();
        const thisMonth = dokumens.filter((d) => {
          const cat = new Date(d.created_at);
          return cat.getMonth() === now.getMonth() && cat.getFullYear() === now.getFullYear();
        });
        setRevisiCount(thisMonth.length);

        // Kategori dengan jumlah dokumen masing-masing
        const cats = kategoris.map((k) => ({
          title: k.title,
          count: dokumens.filter((d) => d.kategori_id === k.id).length,
          to: "/admin/dokumen",
        }));
        setCategories(cats);

        // Aktivitas terbaru: gabung dokumen & berita
        const formatTgl = (iso: string) =>
          new Date(iso).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
          });

        const recentDocs: RecentItem[] = dokumens.slice(0, 4).map((d) => ({
          name: d.nama_dokumen,
          date: formatTgl(d.created_at),
          action: "Tambah",
        }));

        const recentBerita: RecentItem[] = beritas.slice(0, 2).map((b) => ({
          name: b.judul,
          date: formatTgl(b.tanggal),
          action: "Berita",
        }));

        const combined = [...recentDocs, ...recentBerita].slice(0, 5);
        setRecent(combined);
      } catch (e) {
        console.error("Gagal load dashboard:", e);
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  const stats = [
    { label: "Total Dokumen", value: loading ? "…" : String(totalDokumen), icon: BookOpen, tint: "bg-primary/10 text-primary" },
    { label: "Kategori Dokumen", value: loading ? "…" : String(categories.length), icon: Users, tint: "bg-emerald-500/10 text-emerald-600" },
    { label: "Dokumen Bulan Ini", value: loading ? "…" : String(revisiCount), icon: FileCheck2, tint: "bg-blue-500/10 text-blue-600" },
    { label: "Aktivitas Terkini", value: loading ? "…" : String(recent.length), icon: TrendingUp, tint: "bg-amber-500/10 text-amber-600" },
  ];

  return (
    <AdminLayout title="Dashboard">
      {/* Greeting */}
      <div className="bg-gradient-to-br from-foreground to-foreground/90 rounded-2xl p-6 md:p-8 mb-8 text-background relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-primary mb-2">
              Selamat Datang
            </p>
            <h2 className="text-2xl md:text-3xl font-black capitalize">
              Halo, {displayName} 👋
            </h2>
            <p className="text-background/70 text-sm mt-2 max-w-lg">
              Kelola dokumen Sistem Penjaminan Mutu Internal Itenas dengan mudah dari satu tempat.
            </p>
          </div>
          <Link
            to="/admin/dokumen"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-light text-primary-foreground font-semibold px-5 py-3 rounded-xl shadow-lg shadow-primary/30 transition-all duration-300 hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            Tambah Dokumen
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 mb-10">
        {stats.map(({ label, value, icon: Icon, tint }) => (
          <div
            key={label}
            className="bg-card border border-border rounded-xl p-5 md:p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${tint}`}>
                <Icon className="w-5 h-5" />
              </div>
              {loading && <Loader2 className="w-4 h-4 text-muted-foreground animate-spin" />}
            </div>
            <p className="text-3xl font-black text-foreground tracking-tight">{value}</p>
            <p className="text-sm text-muted-foreground mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Categories + Recent */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Categories */}
        <section className="lg:col-span-2 bg-card border border-border rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-lg font-black text-foreground">Kategori Dokumen</h3>
              <p className="text-sm text-muted-foreground mt-0.5">
                Akses cepat ke semua kategori
              </p>
            </div>
            <Link
              to="/admin/dokumen"
              className="text-sm font-semibold text-primary hover:text-primary-dark inline-flex items-center gap-1 transition-colors"
            >
              Lihat semua
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : categories.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">Belum ada kategori dokumen.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {categories.map((c) => (
                <Link
                  key={c.title}
                  to={c.to}
                  className="group flex items-center justify-between p-4 rounded-xl border border-border hover:border-primary/40 hover:bg-primary/5 transition-all duration-300"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm text-foreground truncate">
                        {c.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {c.count} dokumen
                      </p>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Recent activity */}
        <section className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-black text-foreground">Aktivitas Terbaru</h3>
            <Clock className="w-4 h-4 text-muted-foreground" />
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : recent.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">Belum ada aktivitas.</p>
          ) : (
            <ul className="space-y-3">
              {recent.map((r, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 p-3 rounded-xl hover:bg-muted/60 transition-colors"
                >
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-foreground truncate">
                      {r.name}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {r.date}
                    </p>
                  </div>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full shrink-0 ${
                      r.action === "Revisi"
                        ? "bg-blue-500/10 text-blue-600"
                        : r.action === "Berita"
                        ? "bg-violet-500/10 text-violet-600"
                        : "bg-emerald-500/10 text-emerald-600"
                    }`}
                  >
                    {r.action}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </AdminLayout>
  );
};

export default Admin;
