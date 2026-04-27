import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { LogIn, LogOut, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated, userRole, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    navigate("/", { replace: true });
  };

  const handleDokumenClick = () => {
    setMobileOpen(false);
    if (!isAuthenticated) {
      navigate("/login");
    } else if (userRole === "admin") {
      navigate("/admin");
    } else {
      navigate("/dokumen");
    }
  };

  const dokumenLink = (
    <button
      onClick={handleDokumenClick}
      className={({ isActive }: { isActive?: boolean } = {}) =>
        cn(
          "px-4 py-2 text-sm font-medium rounded-lg hover:text-primary hover:bg-accent transition-all duration-200",
          "text-foreground/80"
        )
      }
    >
      Dokumen
    </button>
  );

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-background/90 backdrop-blur-md shadow-sm border-b border-border"
          : "bg-background/80 backdrop-blur-sm"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="flex items-center">
              <span className="text-2xl font-black text-primary tracking-tight">LPM</span>
              <span className="text-2xl font-black text-foreground tracking-tight">itenas</span>
            </div>
            <div className="hidden sm:block border-l border-border pl-2 ml-1">
              <p className="text-[9px] font-semibold text-muted-foreground uppercase tracking-widest leading-tight">
                Lembaga<br />Penjaminan Mutu
              </p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                cn(
                  "px-4 py-2 text-sm font-medium rounded-lg hover:text-primary hover:bg-accent transition-all duration-200",
                  isActive ? "text-primary" : "text-foreground/80"
                )
              }
            >
              Beranda
            </NavLink>

            {dokumenLink}
          </div>

          {/* Auth button (desktop) */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-foreground hover:bg-foreground/90 text-background px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 hover:shadow-lg active:scale-95"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-primary-foreground px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-primary/30 active:scale-95"
              >
                <LogIn className="w-4 h-4" />
                Masuk
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="md:hidden p-2 rounded-lg text-foreground/70 hover:bg-muted"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-card border-t border-border px-4 py-3 space-y-1 animate-fade-in">
          <Link
            to="/"
            onClick={() => setMobileOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-foreground/80 hover:bg-accent hover:text-primary"
          >
            Beranda
          </Link>
          <button
            onClick={handleDokumenClick}
            className="block w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-foreground/80 hover:bg-accent hover:text-primary"
          >
            Dokumen
          </button>
          <div className="pt-2">
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 bg-foreground text-background px-5 py-2.5 rounded-full text-sm font-semibold"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            ) : (
              <button
                onClick={() => {
                  setMobileOpen(false);
                  navigate("/login");
                }}
                className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-full text-sm font-semibold"
              >
                <LogIn className="w-4 h-4" />
                Masuk
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
