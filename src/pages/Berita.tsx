import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Search, Calendar, Tag, Clock, ArrowRight, ChevronRight,
  Newspaper, TrendingUp, BookOpen, Megaphone,
} from "lucide-react";
import { useBeritaStore, type BeritaItem as StoreBeritaItem } from "@/data/beritaStore";
import ParallaxBg from "@/components/ParallaxBg";
import heroBg from "@/assets/Gambar6.jpg";

/* ─── Types (re-exported from store untuk kompat) ───────── */
export type BeritaItem = StoreBeritaItem;


export const KATEGORI_LIST = ["Semua", "Audit", "Kegiatan", "Prestasi", "Pengumuman"];

/* ─── Helpers ────────────────────────────────────────────── */
const formatTanggal = (iso: string) =>
  new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });

const kategoriColor = (k: string) => ({
  Audit: "bg-amber-100 text-amber-700 ring-1 ring-amber-200",
  Kegiatan: "bg-blue-100 text-blue-700 ring-1 ring-blue-200",
  Prestasi: "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200",
  Pengumuman: "bg-violet-100 text-violet-700 ring-1 ring-violet-200",
} as Record<string, string>)[k] ?? "bg-muted text-muted-foreground";

const kategoriIcon = (k: string) => ({
  Audit: TrendingUp,
  Kegiatan: BookOpen,
  Prestasi: Newspaper,
  Pengumuman: Megaphone,
} as Record<string, React.ElementType>)[k] ?? Newspaper;

/* ─── Stat card ──────────────────────────────────────────── */
function StatBadge({ icon: Icon, label, val }: { icon: React.ElementType; label: string; val: number | string }) {
  return (
    <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-5 py-3.5">
      <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
        <Icon className="w-4.5 h-4.5 text-white" />
      </div>
      <div>
        <p className="text-xl font-black text-white leading-none">{val}</p>
        <p className="text-[11px] text-white/70 mt-0.5 font-medium">{label}</p>
      </div>
    </div>
  );
}

/* ─── Featured card ─────────────────────────────────────── */
function FeaturedCard({ berita, big = false }: { berita: BeritaItem; big?: boolean }) {
  const KatIcon = kategoriIcon(berita.kategori);
  return (
    <Link
      to={`/berita/${berita.id}`}
      className={`group relative overflow-hidden rounded-3xl flex flex-col justify-end bg-foreground ${big ? "min-h-[400px] md:min-h-[460px]" : "min-h-[300px]"}`}
    >
      <img
        src={berita.gambar}
        alt={berita.judul}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
      <div className="relative p-6 md:p-7 space-y-3">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-white/90 bg-primary px-2.5 py-1 rounded-full">
            <KatIcon className="w-3 h-3" />
            {berita.kategori}
          </span>
          <span className="text-[11px] text-white/60 font-medium flex items-center gap-1">
            <Calendar className="w-3 h-3" />{formatTanggal(berita.tanggal)}
          </span>
        </div>
        <h3 className={`font-black text-white leading-snug group-hover:text-primary-light transition-colors ${big ? "text-xl md:text-2xl" : "text-lg"}`}>
          {berita.judul}
        </h3>
        {big && (
          <p className="text-sm text-white/70 line-clamp-2 leading-relaxed">{berita.ringkasan}</p>
        )}
        <div className="flex items-center gap-1.5 text-primary-light font-semibold text-sm">
          Baca selengkapnya <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
}

/* ─── Regular card ──────────────────────────────────────── */
function BeritaCard({ berita }: { berita: BeritaItem }) {
  const KatIcon = kategoriIcon(berita.kategori);
  return (
    <Link
      to={`/berita/${berita.id}`}
      className="group bg-card border border-border rounded-3xl overflow-hidden hover:shadow-xl hover:shadow-foreground/5 hover:-translate-y-1 transition-all duration-300 flex flex-col"
    >
      <div className="relative overflow-hidden aspect-[16/9]">
        <img
          src={berita.gambar}
          alt={berita.judul}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3">
          <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full ${kategoriColor(berita.kategori)}`}>
            <KatIcon className="w-3 h-3" />
            {berita.kategori}
          </span>
        </div>
      </div>
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-3 text-[11px] text-muted-foreground mb-3">
          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatTanggal(berita.tanggal)}</span>
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />3 menit baca</span>
        </div>
        <h3 className="font-bold text-foreground text-[15px] leading-snug mb-2.5 line-clamp-2 group-hover:text-primary transition-colors">
          {berita.judul}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 flex-1">
          {berita.ringkasan}
        </p>
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
          <span className="text-[12px] text-muted-foreground font-medium">{berita.penulis}</span>
          <span className="flex items-center gap-1 text-primary text-[12px] font-bold group-hover:gap-2 transition-all">
            Baca <ChevronRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════ */
const Berita = () => {
  const { list: seedBerita } = useBeritaStore();
  const [query, setQuery] = useState("");
  const [aktifKategori, setAktifKategori] = useState("Semua");

  const featured = seedBerita.filter((b) => b.featured);
  const nonFeatured = seedBerita.filter((b) => !b.featured);

  const filtered = useMemo(() => {
    const source = aktifKategori === "Semua" ? nonFeatured : seedBerita.filter((b) => b.kategori === aktifKategori);
    if (!query.trim()) return source;
    const q = query.toLowerCase();
    return source.filter(
      (b) => b.judul.toLowerCase().includes(q) || b.ringkasan.toLowerCase().includes(q) || b.tags.some((t) => t.toLowerCase().includes(q))
    );
  }, [aktifKategori, query, seedBerita, nonFeatured]);


  return (
    <div className="min-h-screen bg-surface">

      {/* ── Hero ── */}
      <section className="relative bg-foreground overflow-hidden pt-24 pb-16 md:pt-32 md:pb-20">
        <ParallaxBg src={heroBg} speed={0.35} opacity={0.35} />
        <div className="absolute inset-0 bg-gradient-to-br from-foreground/85 via-foreground/80 to-primary/30" />
        {/* Decorative pattern */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "32px 32px" }}
        />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-10">
            <div className="inline-flex items-center gap-2 bg-primary/20 border border-primary/30 text-primary-light rounded-full px-4 py-1.5 text-[12px] font-bold mb-5 uppercase tracking-wider">
              <Newspaper className="w-3.5 h-3.5" />
              Berita & Informasi
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white leading-tight mb-4">
              Kabar Terkini<br />
              <span className="text-primary">LPM Itenas</span>
            </h1>
            <p className="text-base text-white/60 leading-relaxed">
              Ikuti perkembangan terbaru kegiatan, program, dan pencapaian Lembaga Penjaminan Mutu Institut Teknologi Nasional Bandung.
            </p>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-3">
            <StatBadge icon={Newspaper} label="Total Berita" val={seedBerita.length} />
            <StatBadge icon={TrendingUp} label="Berita Bulan Ini" val={3} />
            <StatBadge icon={Tag} label="Kategori" val={KATEGORI_LIST.length - 1} />
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-14">

        {/* ── Featured ── */}
        {aktifKategori === "Semua" && !query && featured.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-black text-foreground">Berita Utama</h2>
                <p className="text-muted-foreground text-sm mt-0.5">Sorotan kegiatan LPM terkini</p>
              </div>
              <div className="w-12 h-1 bg-primary rounded-full" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FeaturedCard berita={featured[0]} big />
              {featured[1] && <FeaturedCard berita={featured[1]} />}
            </div>
          </section>
        )}

        {/* ── Filter + Search ── */}
        <section>
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            {/* Kategori pills */}
            <div className="flex flex-wrap gap-2">
              {KATEGORI_LIST.map((k) => {
                const KatIcon = k === "Semua" ? Newspaper : kategoriIcon(k);
                return (
                  <button
                    key={k}
                    onClick={() => setAktifKategori(k)}
                    className={`
                      inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-semibold border transition-all duration-200
                      ${aktifKategori === k
                        ? "bg-primary text-white border-primary shadow-md shadow-primary/25"
                        : "bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-primary"}
                    `}
                  >
                    <KatIcon className="w-3.5 h-3.5" />{k}
                  </button>
                );
              })}
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-72 shrink-0">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari berita..."
                className="w-full bg-card border border-border focus:border-primary/50 focus:ring-2 focus:ring-primary/15 rounded-xl pl-11 pr-4 py-2.5 text-sm placeholder:text-muted-foreground outline-none transition-all"
              />
            </div>
          </div>
        </section>

        {/* ── Grid berita ── */}
        <section>
          {aktifKategori !== "Semua" || query ? (
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-xl font-black text-foreground">
                {aktifKategori !== "Semua" ? `Berita ${aktifKategori}` : `Hasil pencarian "${query}"`}
              </h2>
              <span className="bg-primary/10 text-primary text-[12px] font-bold px-2.5 py-1 rounded-full">
                {filtered.length} artikel
              </span>
            </div>
          ) : (
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-black text-foreground">Berita Lainnya</h2>
                <p className="text-muted-foreground text-sm mt-0.5">Semua berita dan informasi terbaru</p>
              </div>
              <div className="w-12 h-1 bg-primary rounded-full" />
            </div>
          )}

          {filtered.length === 0 ? (
            <div className="text-center py-20 bg-card border border-border rounded-3xl">
              <Newspaper className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-foreground font-bold text-lg">Tidak ada berita ditemukan</p>
              <p className="text-muted-foreground text-sm mt-1">Coba ubah kata kunci atau kategori</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((b) => <BeritaCard key={b.id} berita={b} />)}
            </div>
          )}
        </section>

        {/* ── CTA ── */}
        <section className="relative overflow-hidden bg-foreground rounded-3xl px-8 md:px-14 py-12 md:py-14 text-center">
          <div className="absolute inset-0 opacity-[0.03]"
            style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "24px 24px" }}
          />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[200px] bg-primary/20 blur-[80px] rounded-full" />
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center mx-auto mb-4">
              <Megaphone className="w-6 h-6 text-primary-light" />
            </div>
            <h3 className="text-2xl md:text-3xl font-black text-white mb-3">Ada pertanyaan?</h3>
            <p className="text-white/60 mb-7 max-w-md mx-auto text-sm leading-relaxed">
              Hubungi tim LPM Itenas untuk informasi lebih lanjut mengenai kegiatan dan program penjaminan mutu.
            </p>
            <a
              href="mailto:lpm@itenas.ac.id"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-bold px-7 py-3 rounded-full transition-all hover:shadow-lg hover:shadow-primary/30 text-sm"
            >
              Hubungi Kami <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </section>

      </div>
    </div>
  );
};

export default Berita;
