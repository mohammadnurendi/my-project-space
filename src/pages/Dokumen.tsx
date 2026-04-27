import { Link, useNavigate } from "react-router-dom";
import { BookOpen, ScrollText, FileCheck2, ArrowRight, Lock } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const documents = [
  {
    title: "Dokumen Pedoman",
    description: "Pedoman umum pelaksanaan Sistem Penjaminan Mutu Internal Itenas.",
    Icon: BookOpen,
    accent: "from-blue-900 to-blue-700",
  },
  {
    title: "Dokumen Kebijakan",
    description: "Kebijakan resmi yang menjadi landasan SPMI di lingkungan Itenas.",
    Icon: ScrollText,
    accent: "from-primary to-primary-light",
  },
  {
    title: "Dokumen Manual",
    description: "Manual prosedur pelaksanaan penjaminan mutu untuk semua unit.",
    Icon: FileCheck2,
    accent: "from-purple-900 to-purple-700",
  },
];

const Dokumen = () => {
  const { email, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-surface">
      {/* Hero */}
      <section className="relative overflow-hidden pt-16 bg-foreground">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-foreground via-foreground/95 to-primary/30" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="animate-fade-up flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-primary/20 border border-primary/30 text-primary rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-widest mb-5">
                <Lock className="w-3 h-3" />
                Area Pengguna
              </div>
              <h1 className="text-4xl sm:text-5xl font-black text-background leading-tight tracking-tight">
                Dokumen <span className="text-primary">LPM Itenas</span>
              </h1>
              <p className="mt-3 text-background/60 text-base max-w-xl">
                Pilih kategori dokumen di bawah untuk mengakses arsip lengkap Sistem Penjaminan Mutu Internal Itenas.
              </p>
            </div>
            {email && (
              <div className="flex items-center gap-3 bg-background/5 border border-background/10 rounded-2xl px-4 py-3 backdrop-blur-sm">
                <div className="text-right">
                  <p className="text-[10px] uppercase tracking-wider text-background/50 font-semibold">
                    Login sebagai
                  </p>
                  <p className="text-sm font-semibold text-background">{email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-xs font-semibold text-primary hover:text-primary-light transition-colors"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-surface to-transparent" />
      </section>

      {/* Cards */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documents.map((doc, i) => {
              const { Icon } = doc;
              return (
                <Link
                  key={doc.title}
                  to="#"
                  className="group relative bg-card rounded-3xl overflow-hidden border border-border shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 animate-fade-up"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  {/* Image / illustration */}
                  <div
                    className={`relative aspect-[4/3] bg-gradient-to-br ${doc.accent} overflow-hidden`}
                  >
                    <div
                      className="absolute inset-0 opacity-20"
                      style={{
                        backgroundImage:
                          "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)",
                        backgroundSize: "24px 24px",
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-24 h-24 rounded-3xl bg-background/15 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500">
                        <Icon className="w-12 h-12 text-background" strokeWidth={1.5} />
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors duration-300" />
                  </div>

                  {/* Body */}
                  <div className="p-6">
                    <h3 className="font-black text-foreground text-lg leading-tight group-hover:text-primary transition-colors">
                      {doc.title}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                      {doc.description}
                    </p>
                    <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                      Lihat Dokumen
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dokumen;
