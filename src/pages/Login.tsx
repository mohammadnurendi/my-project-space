import { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import logoLpmPutih from "@/assets/logolpmputih.png";
import logoLpm from "@/assets/logo-lpm.png";
import heroBg from "@/assets/Gambar1.jpg";
import { toast } from "sonner";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState(() => localStorage.getItem("lpm-remember-email") ?? "");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(() => Boolean(localStorage.getItem("lpm-remember-email")));
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError("Email dan kata sandi wajib diisi.");
      return;
    }

    setSubmitting(true);
    const result = await login(email, password);
    setSubmitting(false);

    if (!result.success) {
      const message = result.error ?? "Login gagal.";
      setError(message);
      toast.error("Gagal masuk", {
        description: message,
      });
      return;
    }

    if (remember) {
      localStorage.setItem("lpm-remember-email", email.trim().toLowerCase());
    } else {
      localStorage.removeItem("lpm-remember-email");
    }

    toast.success("Berhasil masuk", {
      description: "Selamat datang kembali di Sistem LPM Itenas.",
    });
    navigate(result.role === "admin" ? "/admin" : "/", { replace: true });
  };

  return (
    <div className="min-h-screen bg-background text-foreground lg:grid lg:grid-cols-[1.05fr_0.95fr]">
      <section className="relative hidden min-h-screen overflow-hidden bg-foreground lg:block">
        <img src={heroBg} alt="" className="absolute inset-0 h-full w-full object-cover opacity-35" />
        <div className="absolute inset-0 bg-gradient-to-br from-foreground via-foreground/90 to-primary/65" />
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.7) 1px, transparent 0)",
            backgroundSize: "30px 30px",
          }}
        />

        <div className="relative z-10 flex min-h-screen flex-col justify-between px-12 py-10">
          <Link to="/" className="inline-flex w-fit items-center gap-3 rounded-2xl px-4 py-3">
            <img src={logoLpmPutih} alt="LPM Itenas" className="h-10 w-auto" />
          </Link>

          <div className="max-w-xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/15 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              Portal Mutu Itenas
            </div>
            <h1 className="text-5xl font-black leading-tight tracking-tight text-background">
              Kelola dokumen, berita, dan data mutu dalam satu sistem.
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-background/70">
              Area masuk untuk pengelola LPM dan pengguna terdaftar dalam mengakses layanan dokumen Lembaga Penjaminan Mutu.
            </p>
          </div>

          <p className="text-xs text-background/45">
            © Lembaga Penjaminan Mutu Institut Teknologi Nasional Bandung
          </p>
        </div>
      </section>

      <main className="flex min-h-screen items-center justify-center px-4 py-10 sm:px-6 lg:px-12">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center lg:hidden">
            <Link to="/" className="inline-flex items-center justify-center rounded-2xl bg-card px-4 py-3 shadow-sm border border-border">
              <img src={logoLpm} alt="LPM Itenas" className="h-12 w-auto" />
            </Link>
          </div>

          <div className="rounded-[2rem] border border-border bg-card p-6 shadow-2xl shadow-foreground/5 sm:p-8">
            <div className="mb-7">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-black tracking-tight text-foreground">Masuk ke Sistem LPM</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Gunakan akun yang sudah dibuat oleh admin untuk mengakses dashboard atau dokumen LPM.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div className="space-y-1.5">
                <label className="text-[13px] font-bold text-foreground/80">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@itenas.ac.id"
                    autoComplete="username"
                    maxLength={255}
                    className="h-12 w-full rounded-xl border border-input bg-background pl-11 pr-4 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-4 focus:ring-primary/15"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[13px] font-bold text-foreground/80">Kata Sandi</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan kata sandi"
                    autoComplete="current-password"
                    maxLength={100}
                    className="h-12 w-full rounded-xl border border-input bg-background pl-11 pr-12 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-4 focus:ring-primary/15"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-primary"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 pt-1">
                <label className="flex cursor-pointer select-none items-center gap-2">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="h-4 w-4 rounded border-border text-primary focus:ring-primary/30"
                  />
                  <span className="text-xs font-medium text-muted-foreground">Ingat email</span>
                </label>
                <span className="text-xs font-medium text-muted-foreground">Hubungi admin LPM</span>
              </div>

              {error && (
                <div
                  role="alert"
                  className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive animate-fade-in"
                >
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className={cn(
                  "group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-black text-primary-foreground transition-all duration-200 hover:bg-primary-dark hover:shadow-lg hover:shadow-primary/30 active:scale-[0.99]",
                  submitting && "cursor-not-allowed opacity-70"
                )}
              >
                {submitting ? "Memproses..." : "Masuk"}
                {!submitting && <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />}
              </button>
            </form>

            <Link
              to="/"
              className="mt-6 flex items-center justify-center text-xs font-bold text-muted-foreground transition-colors hover:text-primary"
            >
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
