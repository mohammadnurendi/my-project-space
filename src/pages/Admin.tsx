import { Link, useNavigate } from "react-router-dom";
import { Shield, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const Admin = () => {
  const { email, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <header className="bg-foreground text-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-1">
            <span className="text-2xl font-black text-primary">LPM</span>
            <span className="text-2xl font-black text-background">itenas</span>
            <span className="ml-3 text-xs font-bold uppercase tracking-widest text-primary border-l border-background/20 pl-3">
              Admin
            </span>
          </Link>
          <button
            onClick={() => {
              logout();
              navigate("/login", { replace: true });
            }}
            className="flex items-center gap-2 bg-background/10 hover:bg-background/20 text-background px-4 py-2 rounded-full text-sm font-semibold transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-xl w-full bg-card rounded-3xl border border-border shadow-sm p-10 text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-5">
            <Shield className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-black text-foreground">
            Dashboard <span className="text-primary">Admin</span>
          </h1>
          <p className="mt-3 text-muted-foreground">
            Selamat datang, <span className="font-semibold text-foreground">{email}</span>. Halaman admin sudah disiapkan dan siap dikembangkan lebih lanjut.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Admin;
