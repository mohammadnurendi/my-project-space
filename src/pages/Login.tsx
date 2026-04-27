import { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError("Email dan kata sandi wajib diisi.");
      return;
    }

    setSubmitting(true);
    const result = login(email, password);
    setSubmitting(false);

    if (!result.success) {
      setError(result.error ?? "Login gagal.");
      return;
    }

    if (remember) {
      localStorage.setItem("lpm-remember-email", email.trim().toLowerCase());
    } else {
      localStorage.removeItem("lpm-remember-email");
    }

    navigate(result.role === "admin" ? "/admin" : "/", { replace: true });
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-card rounded-3xl border border-border shadow-sm p-8 sm:p-10">
          {/* Logo */}
          <Link to="/" className="flex items-center justify-center gap-1 mb-2">
            <span className="text-3xl font-black text-primary tracking-tight">LPM</span>
            <span className="text-3xl font-black text-foreground tracking-tight">itenas</span>
          </Link>
          <p className="text-center text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.25em] mb-8">
            Lembaga Penjaminan Mutu
          </p>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Nomor telepon, username, atau email"
                autoComplete="username"
                maxLength={255}
                className="w-full px-4 py-3.5 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              />
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Kata sandi"
                autoComplete="current-password"
                maxLength={100}
                className="w-full px-4 py-3.5 pr-12 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-accent transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <label className="flex items-center gap-2 cursor-pointer select-none pt-1">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="w-4 h-4 rounded border-border text-primary focus:ring-primary/30 cursor-pointer"
              />
              <span className="text-xs text-muted-foreground">Ingat Username</span>
            </label>

            {error && (
              <div
                role="alert"
                className="bg-destructive/10 border border-destructive/30 text-destructive rounded-xl px-4 py-3 text-sm font-medium animate-fade-in"
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className={cn(
                "w-full mt-2 bg-primary hover:bg-primary-dark text-primary-foreground py-3.5 rounded-full font-bold text-base transition-all duration-200 hover:shadow-lg hover:shadow-primary/30 active:scale-[0.98]",
                submitting && "opacity-70 cursor-not-allowed"
              )}
            >
              {submitting ? "Memproses..." : "Masuk"}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-border">
            <p className="text-[11px] text-muted-foreground text-center leading-relaxed">
              <span className="font-semibold text-foreground/70">Demo akun:</span><br />
              admin@lpm.com / 123456 &nbsp;·&nbsp; user@lpm.com / 123456
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
