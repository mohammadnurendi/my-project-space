import { ReactNode, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Home, BookOpen, User, Search, LogOut, Menu, X, Newspaper, History, Eye, Map, Users } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

interface AdminLayoutProps {
  title?: string;
  children: ReactNode;
  headerRight?: ReactNode;
}

const navItems = [
  { to: "/admin", label: "Dashboard", icon: Home, end: true },
  { to: "/admin/dokumen", label: "Dokumen", icon: BookOpen },
  { to: "/admin/berita", label: "Berita", icon: Newspaper },
  { to: "/admin/sejarah", label: "Sejarah", icon: History },
  { to: "/admin/visi-misi", label: "Visi & Misi", icon: Eye },
  { to: "/admin/road-map", label: "Road Map", icon: Map },
  { to: "/admin/tim", label: "Tim LPM", icon: Users },
  { to: "/admin/akun", label: "Akun", icon: User },
];

const AdminLayout = ({ title, children, headerRight }: AdminLayoutProps) => {
  const { email, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const displayName = email?.split("@")[0] ?? "Admin";

  return (
    <div className="min-h-screen bg-surface text-foreground">
      {/* Top header */}
      <header className="sticky top-0 z-40 bg-card border-b border-border">
        <div className="flex items-center gap-3 px-4 md:px-8 lg:px-10 h-16 md:h-20">
          {/* Mobile menu */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-muted transition-colors"
            aria-label="Toggle navigation"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Logo */}
          <Link to="/admin" className="flex flex-col leading-none shrink-0">
            <span className="text-xl md:text-2xl font-black tracking-tight">
              <span className="text-primary">LPM</span>
              <span className="text-foreground">itenas</span>
            </span>
            <span className="hidden md:block text-[9px] font-semibold tracking-[0.2em] text-muted-foreground mt-0.5">
              LEMBAGA PENJAMINAN MUTU
            </span>
          </Link>

          {/* Search */}
          <div className="flex-1 max-w-2xl mx-auto hidden sm:block">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search"
                className="w-full bg-muted/60 border border-transparent focus:border-primary/40 focus:bg-card focus:ring-2 focus:ring-primary/15 rounded-full pl-11 pr-4 py-2.5 text-sm placeholder:text-muted-foreground outline-none transition-all"
              />
            </div>
          </div>

          {/* User */}
          <div className="flex items-center gap-3 ml-auto">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-foreground capitalize leading-tight">
                {displayName}
              </p>
              <p className="text-[11px] text-muted-foreground leading-tight">
                Admin LPM ITENAS
              </p>
            </div>
            <div className="relative w-10 h-10 rounded-full bg-primary/15 text-primary flex items-center justify-center font-bold ring-2 ring-primary/20">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <button
              onClick={handleLogout}
              className="hidden md:inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors ml-2 px-3 py-2 rounded-lg hover:bg-muted"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
              Keluar
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={cn(
            "fixed lg:sticky top-16 md:top-20 left-0 z-30 h-[calc(100vh-4rem)] md:h-[calc(100vh-5rem)] w-64 bg-card border-r border-border transition-transform duration-300 lg:translate-x-0",
            mobileOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <nav className="p-4 space-y-1.5">
            {navItems.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 group",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )
                }
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span>{label}</span>
              </NavLink>
            ))}

            <button
              onClick={handleLogout}
              className="md:hidden w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-muted-foreground hover:bg-muted hover:text-foreground transition-all mt-4"
            >
              <LogOut className="w-5 h-5" />
              Keluar
            </button>
          </nav>
        </aside>

        {/* Backdrop mobile */}
        {mobileOpen && (
          <div
            className="lg:hidden fixed inset-0 top-16 bg-foreground/30 z-20"
            onClick={() => setMobileOpen(false)}
          />
        )}

        {/* Main */}
        <main className="flex-1 min-w-0">
          {title && (
            <div className="border-b border-border px-4 md:px-8 lg:px-12 py-6 md:py-8 flex flex-wrap items-center justify-between gap-4 bg-card/40">
              <h1 className="text-2xl md:text-3xl font-black tracking-tight text-foreground">
                {title}
              </h1>
              {headerRight}
            </div>
          )}
          <div className="px-4 md:px-8 lg:px-12 py-8 md:py-10 animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
