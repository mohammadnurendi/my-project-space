import { Link } from "react-router-dom";
import { BookOpen, Users, FileCheck2, TrendingUp, ArrowUpRight, Clock, Plus } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import { useAuth } from "@/context/AuthContext";

const stats = [
  { label: "Total Dokumen", value: "128", delta: "+12", icon: BookOpen, tint: "bg-primary/10 text-primary" },
  { label: "Pengguna Aktif", value: "42", delta: "+5", icon: Users, tint: "bg-emerald-500/10 text-emerald-600" },
  { label: "Revisi Bulan Ini", value: "17", delta: "+3", icon: FileCheck2, tint: "bg-blue-500/10 text-blue-600" },
  { label: "Akses Bulanan", value: "1.2k", delta: "+18%", icon: TrendingUp, tint: "bg-amber-500/10 text-amber-600" },
];

const categories = [
  { title: "Dokumen Pedoman", count: 24, to: "/admin/dokumen" },
  { title: "Dokumen Standar", count: 32, to: "/admin/dokumen" },
  { title: "Dokumen Formulir", count: 41, to: "/admin/dokumen" },
  { title: "Dokumen Manual", count: 18, to: "/admin/dokumen" },
  { title: "Dokumen Rapat", count: 9, to: "/admin/dokumen" },
  { title: "Dokumen Audit", count: 14, to: "/admin/dokumen" },
];

const recent = [
  { name: "Dokumen Pedoman 3", date: "24 Oktober 2025", action: "Revisi" },
  { name: "Dokumen Standar 2", date: "23 Oktober 2025", action: "Tambah" },
  { name: "Dokumen Formulir 7", date: "22 Oktober 2025", action: "Revisi" },
  { name: "Dokumen Audit 1", date: "21 Oktober 2025", action: "Tambah" },
];

const Admin = () => {
  const { email } = useAuth();
  const displayName = email?.split("@")[0] ?? "Admin";

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
        {stats.map(({ label, value, delta, icon: Icon, tint }) => (
          <div
            key={label}
            className="bg-card border border-border rounded-xl p-5 md:p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${tint}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                {delta}
              </span>
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
        </section>

        {/* Recent activity */}
        <section className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-black text-foreground">Aktivitas Terbaru</h3>
            <Clock className="w-4 h-4 text-muted-foreground" />
          </div>

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
                      : "bg-emerald-500/10 text-emerald-600"
                  }`}
                >
                  {r.action}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </AdminLayout>
  );
};

export default Admin;
