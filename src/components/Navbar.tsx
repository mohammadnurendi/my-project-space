import { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { ChevronDown, Menu, User, X } from "lucide-react";
import { cn } from "@/lib/utils";

const profilItems = [
  { label: "Sejarah", path: "/sejarah" },
  { label: "Visi & Misi", path: "/visi-misi" },
  { label: "Road Map", path: "/road-map" },
  { label: "Tim LPM Itenas", path: "/tim" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    const onClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    window.addEventListener("scroll", onScroll);
    document.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("click", onClick);
    };
  }, []);

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

            {/* Profil dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((v) => !v)}
                className={cn(
                  "flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-lg hover:text-primary hover:bg-accent transition-all duration-200",
                  dropdownOpen ? "text-primary bg-accent" : "text-foreground/80"
                )}
              >
                Profil
                <ChevronDown
                  className={cn(
                    "w-4 h-4 transition-transform duration-200",
                    dropdownOpen && "rotate-180"
                  )}
                />
              </button>

              {dropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-card rounded-xl shadow-xl border border-border py-1 overflow-hidden animate-fade-in">
                  {profilItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground/80 hover:bg-accent hover:text-primary transition-colors duration-150"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <a
              href="#"
              className="px-4 py-2 text-sm font-medium text-foreground/80 rounded-lg hover:text-primary hover:bg-accent transition-all duration-200"
            >
              Dokumen
            </a>
          </div>

          {/* Masuk Button */}
          <div className="hidden md:flex items-center gap-3">
            <button className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-primary-foreground px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-primary/30 active:scale-95">
              <User className="w-4 h-4" />
              Masuk
            </button>
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
          <div className="pt-1 pb-1">
            <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
              Profil
            </p>
            {profilItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm text-foreground/70 hover:bg-accent hover:text-primary pl-6"
              >
                {item.label}
              </Link>
            ))}
          </div>
          <a
            href="#"
            className="block px-3 py-2 rounded-lg text-sm font-medium text-foreground/80 hover:bg-accent hover:text-primary"
          >
            Dokumen
          </a>
          <div className="pt-2">
            <button className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-full text-sm font-semibold">
              <User className="w-4 h-4" />
              Masuk
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
