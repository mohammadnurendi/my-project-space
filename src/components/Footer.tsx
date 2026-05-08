import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { kategoriApi, type ApiKategori } from "@/services/dokumenApi";
import logoLpm from "@/assets/logo-lpm.png";

const navLinks = [
  { label: "Beranda", path: "/" },
  { label: "Sejarah", path: "/sejarah" },
  { label: "Visi & Misi", path: "/visi-misi" },
  { label: "Road Map", path: "/road-map" },
  { label: "Tim LPM Itenas", path: "/tim" },
];

const Footer = () => {
  const [categories, setCategories] = useState<ApiKategori[]>([]);

  useEffect(() => {
    kategoriApi.list().then(setCategories).catch(() => setCategories([]));
  }, []);

  const docLinks = categories.slice(0, 4);
  const otherLinks = categories.slice(4, 8);

  return (
    <footer className="bg-foreground text-background/80 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-background/10">
          <div>
            <div className="mb-4 bg-background/95 rounded-xl p-3 inline-block">
              <img src={logoLpm} alt="LPM Itenas" className="h-10 w-auto" />
            </div>
            <p className="text-sm text-background/60 leading-relaxed">
              Jl. PH.H. Mustofa No.23 Bandung, 40124 Indonesia
            </p>
            <div className="mt-4 space-y-1">
              <p className="text-sm text-background/60">
                Telepon: <span className="text-background/80">+62-227-2722-15</span>
              </p>
              <p className="text-sm text-background/60">
                Email: <span className="text-background/80">lpm@itenas.ac.id</span>
              </p>
            </div>
          </div>

          <div>
            <h4 className="text-background font-semibold text-sm uppercase tracking-wider mb-5">
              Navigasi
            </h4>
            <ul className="space-y-3">
              {navLinks.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="text-sm text-background/60 hover:text-primary transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-primary/50 group-hover:bg-primary transition-colors" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-background font-semibold text-sm uppercase tracking-wider mb-5">
              Dokumen
            </h4>
            <ul className="space-y-3">
              {docLinks.map((item) => (
                <li key={item.id}>
                  <Link
                    to="/dokumen"
                    className="text-sm text-background/60 hover:text-primary transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-primary/50 group-hover:bg-primary transition-colors" />
                    {item.title}
                  </Link>
                </li>
              ))}
              {docLinks.length === 0 && (
                <li className="text-sm text-background/40">Belum ada kategori.</li>
              )}
            </ul>
          </div>

          <div>
            <h4 className="text-background font-semibold text-sm uppercase tracking-wider mb-5">
              Lainnya
            </h4>
            <ul className="space-y-3">
              {otherLinks.map((item) => (
                <li key={item.id}>
                  <Link
                    to="/dokumen"
                    className="text-sm text-background/60 hover:text-primary transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-primary/50 group-hover:bg-primary transition-colors" />
                    {item.title}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/berita"
                  className="text-sm text-background/60 hover:text-primary transition-colors duration-200 flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 rounded-full bg-primary/50 group-hover:bg-primary transition-colors" />
                  Berita LPM
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="text-sm text-background/60 hover:text-primary transition-colors duration-200 flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 rounded-full bg-primary/50 group-hover:bg-primary transition-colors" />
                  Login Sistem
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between pt-8 gap-4">
          <p className="text-xs text-background/40">
            © <Link to="/" className="text-primary hover:underline">Lembaga Penjaminan Mutu</Link> ITENAS 2026. All Rights Reserved.
          </p>
          <p className="text-xs text-background/40">
            Designed By <span className="text-primary">UPT-TIK</span> Itenas
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
