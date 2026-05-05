import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { ChevronDown, LogIn, LogOut, Menu, User as UserIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import logoLpm from "@/assets/logo-lpm.png";

const profileLinks = [
  { to: "/sejarah", label: "Sejarah" },
  { to: "/visi-misi", label: "Visi & Misi" },
  { to: "/road-map", label: "Road Map" },
  { to: "/tim", label: "Tim LPM Itenas" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated, userRole, email, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setProfileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
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

  const isProfileActive = profileLinks.some((l) => location.pathname === l.to);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-background/95 backdrop-blur-md shadow-sm border-b border-border"
          : "bg-background/80 backdrop-blur-sm"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <img src={logoLpm} alt="LPM Itenas" className="h-9 sm:h-10 w-auto" />
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

            {/* Profile dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen((v) => !v)}
                className={cn(
                  "flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-lg hover:text-primary hover:bg-accent transition-all duration-200",
                  isProfileActive || profileOpen ? "text-primary" : "text-foreground/80"
                )}
              >
                Profil
                <ChevronDown
                  className={cn("w-4 h-4 transition-transform duration-200", profileOpen && "rotate-180")}
                />
              </button>
              {profileOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-card border border-border rounded-2xl shadow-xl shadow-foreground/5 overflow-hidden animate-fade-in">
                  {profileLinks.map((link) => (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      className={({ isActive }) =>
                        cn(
                          "block px-4 py-2.5 text-sm font-medium hover:bg-accent hover:text-primary transition-colors",
                          isActive ? "text-primary bg-accent/50" : "text-foreground/80"
                        )
                      }
                    >
                      {link.label}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>

            {/* ── Berita (public) ── */}
            <NavLink
              to="/berita"
              className={({ isActive }) =>
                cn(
                  "px-4 py-2 text-sm font-medium rounded-lg hover:text-primary hover:bg-accent transition-all duration-200",
                  isActive ? "text-primary" : "text-foreground/80"
                )
              }
            >
              Berita
            </NavLink>

            <button
              onClick={handleDokumenClick}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-lg hover:text-primary hover:bg-accent transition-all duration-200",
                location.pathname === "/dokumen" || location.pathname === "/admin"
                  ? "text-primary"
                  : "text-foreground/80"
              )}
            >
              Dokumen
            </button>
          </div>

          {/* Auth button (desktop) */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              (() => {
                const displayName = email?.split("@")[0] ?? "Pengguna";
                const roleLabel = userRole === "admin" ? "Admin LPM ITENAS" : "User LPM ITENAS";
                return (
                  <div className="flex items-center gap-3">
                    <div className="text-right hidden sm:block leading-tight">
                      <p className="text-sm font-bold text-foreground capitalize">{displayName}</p>
                      <p className="text-[11px] text-muted-foreground">{roleLabel}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-primary/15 text-primary flex items-center justify-center font-bold ring-2 ring-primary/20">
                      {displayName.charAt(0).toUpperCase()}
                    </div>
                    <button
                      onClick={handleLogout}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors px-3 py-2 rounded-lg hover:bg-muted"
                      title="Logout"
                    >
                      <LogOut className="w-4 h-4" />
                      Keluar
                    </button>
                  </div>
                );
              })()
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
            className="md:hidden p-2 rounded-lg text-foreground/70 hover:bg-muted active:scale-95 transition-all"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-card border-t border-border px-4 py-4 space-y-1 animate-fade-in max-h-[calc(100vh-4rem)] overflow-y-auto">
          {isAuthenticated && (
            <div className="flex items-center gap-3 mb-3 p-3 rounded-2xl bg-accent/60 border border-primary/10">
              <div className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                <UserIcon className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                  Login sebagai
                </p>
                <p className="text-sm font-semibold text-foreground truncate">{email}</p>
              </div>
            </div>
          )}

          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              cn(
                "block px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-accent hover:text-primary transition-colors",
                isActive ? "text-primary bg-accent/50" : "text-foreground/80"
              )
            }
          >
            Beranda
          </NavLink>

          <div className="px-3 pt-3 pb-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Profil
          </div>
          {profileLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                cn(
                  "block px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-accent hover:text-primary transition-colors",
                  isActive ? "text-primary bg-accent/50" : "text-foreground/80"
                )
              }
            >
              {link.label}
            </NavLink>
          ))}

          <div className="px-3 pt-3 pb-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Informasi
          </div>

          {/* ── Berita mobile ── */}
          <NavLink
            to="/berita"
            className={({ isActive }) =>
              cn(
                "block px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-accent hover:text-primary transition-colors",
                isActive ? "text-primary bg-accent/50" : "text-foreground/80"
              )
            }
          >
            Berita
          </NavLink>

          <div className="px-3 pt-3 pb-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Akses
          </div>
          <button
            onClick={handleDokumenClick}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-foreground/80 hover:bg-accent hover:text-primary transition-colors"
          >
            Dokumen
          </button>

          <div className="pt-3">
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 bg-foreground text-background px-5 py-3 rounded-full text-sm font-semibold active:scale-95 transition-transform"
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
                className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground px-5 py-3 rounded-full text-sm font-semibold active:scale-95 transition-transform"
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
