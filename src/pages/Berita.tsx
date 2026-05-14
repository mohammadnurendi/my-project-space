import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Search, Calendar, ArrowRight, ChevronRight,
  Newspaper, Loader2, Megaphone,
} from "lucide-react";
import { beritaApi, type ApiBerita } from "@/services/beritaApi";
import type { BeritaItem as StoreBeritaItem } from "@/data/beritaStore";
import ParallaxBg from "@/components/ParallaxBg";
import heroBg from "@/assets/Gambar6.jpg";

/* ─── Adapter ───────────────────────────────────────────── */
function toBeritaItem(b: ApiBerita): BeritaItem {
  return {
    id: String(b.id),
    judul: b.judul,
    kategori: b.kategori,
    ringkasan: b.ringkasan,
    isi: b.isi,
    penulis: b.penulis,
    tanggal: b.tanggal,
    gambar: b.gambar_url ?? "",
    gambarUrls: b.gambar_urls ?? (b.gambar_url ? [b.gambar_url] : []),
    featured: b.featured,
    tags: b.tags ?? [],
  };
}

function useBeritaApi() {
  const [list, setList] = useState<BeritaItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    beritaApi.list()
      .then((data) => setList(data.map(toBeritaItem)))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return { list, loading };
}

export type BeritaItem = StoreBeritaItem;

/* ─── Helpers ────────────────────────────────────────────── */
const formatTanggal = (iso: string) =>
  new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });

/* ─── Featured card ─────────────────────────────────────── */
function FeaturedCard({ berita, big = false }: { berita: BeritaItem; big?: boolean }) {
  const image = berita.gambarUrls?.[0] ?? berita.gambar;
  return (
    <Link
      to={`/berita/${berita.id}`}
      className={`group relative overflow-hidden rounded-3xl flex flex-col justify-end bg-foreground ${big ? "min-h-[400px] md:min-h-[460px]" : "min-h-[280px]"}`}
    >
      {image ? (
        <img
          src={image}
          alt={berita.judul}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-primary/40 to-foreground" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
      <div className="relative p-6 md:p-7 space-y-3">
        <div className="flex items-center gap-2 flex-wrap">
          {berita.kategori && (
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-white/90 bg-primary px-2.5 py-1 rounded-full">
              {berita.kategori}
            </span>
          )}
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
  const images = berita.gambarUrls?.length ? berita.gambarUrls : (berita.gambar ? [berita.gambar] : []);
  const image = images[0];
  return (
    <Link
      to={`/berita/${berita.id}`}
      className="group bg-card border border-border rounded-3xl overflow-hidden hover:shadow-xl hover:shadow-foreground/5 hover:-translate-y-1 transition-all duration-300 flex flex-col"
    >
      <div className="relative overflow-hidden aspect-[16/9]">
        {image ? (
          <img
            src={image}
            alt={berita.judul}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <Newspaper className="w-8 h-8 text-muted-foreground/40" />
          </div>
        )}
        {images.length > 1 && (
          <div className="absolute right-3 bottom-3 bg-foreground/75 text-background text-[10px] font-bold px-2 py-1 rounded-full">
            {images.length} Foto
          </div>
        )}
        {berita.kategori && (
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full bg-muted text-muted-foreground">
              {berita.kategori}
            </span>
          </div>
        )}
      </div>
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-3 text-[11px] text-muted-foreground mb-3">
          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatTanggal(berita.tanggal)}</span>
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
const FEATURED_LIMIT = 3;
const BERITA_AWAL = 3;

const Berita = () => {
  const { list: seedBerita, loading } = useBeritaApi();
  const [query, setQuery] = useState("");
  const [showAllOther, setShowAllOther] = useState(false);
  const { featured, nonFeatured } = useMemo(() => {
    const feat = seedBerita.filter((b) => b.featured).slice(0, FEATURED_LIMIT);
    const nonFeat = seedBerita.filter((b) => !b.featured);
    return { featured: feat, nonFeatured: nonFeat };
  }, [seedBerita]);

  const filteredNonFeatured = useMemo(() => {
    if (!query.trim()) return nonFeatured;
    const q = query.toLowerCase();
    return nonFeatured.filter(
      (b) =>
        b.judul.toLowerCase().includes(q) ||
        b.ringkasan.toLowerCase().includes(q) ||
        b.kategori.toLowerCase().includes(q) ||
        b.tags.some((t) => t.toLowerCase().includes(q))
    );
  }, [query, nonFeatured]);

  useEffect(() => {
    setShowAllOther(false);
  }, [query]);

  const beritaTampil = showAllOther ? filteredNonFeatured : filteredNonFeatured.slice(0, BERITA_AWAL);
  const hasMoreBerita = filteredNonFeatured.length > beritaTampil.length;

  return (
    <div className="min-h-screen bg-surface">

      {/* ── Hero ── */}
      <section className="relative bg-foreground overflow-hidden pt-24 pb-16 md:pt-32 md:pb-20">
        <ParallaxBg src={heroBg} speed={0.35} opacity={0.35} />
        <div className="absolute inset-0 bg-gradient-to-br from-foreground/85 via-foreground/80 to-primary/30" />
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "32px 32px" }}
        />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
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
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-14">

        {/* ── Berita Utama (featured, maks 3) ── */}
        {!query && featured.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-black text-foreground">Berita Utama</h2>
                <p className="text-muted-foreground text-sm mt-0.5">Sorotan kegiatan LPM terkini</p>
              </div>
              <div className="w-12 h-1 bg-primary rounded-full" />
            </div>

            {/* Layout: 1 besar kiri + 2 kecil kanan (atau 1-2 sesuai jumlah) */}
            {featured.length === 1 && (
              <FeaturedCard berita={featured[0]} big />
            )}
            {featured.length === 2 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FeaturedCard berita={featured[0]} big />
                <FeaturedCard berita={featured[1]} />
              </div>
            )}
            {featured.length === 3 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FeaturedCard berita={featured[0]} big />
                <div className="flex flex-col gap-5">
                  <FeaturedCard berita={featured[1]} />
                  <FeaturedCard berita={featured[2]} />
                </div>
              </div>
            )}
          </section>
        )}

        {/* ── Search ── */}
        <section>
          <div className="relative w-full max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari judul, kategori, atau tag berita..."
              className="w-full bg-card border border-border focus:border-primary/50 focus:ring-2 focus:ring-primary/15 rounded-xl pl-11 pr-4 py-2.5 text-sm placeholder:text-muted-foreground outline-none transition-all"
            />
          </div>
        </section>

        {/* ── Berita Lainnya ── */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-black text-foreground">
                {query ? `Hasil pencarian "${query}"` : "Berita Lainnya"}
              </h2>
              <p className="text-muted-foreground text-sm mt-0.5">
                {query
                  ? `${filteredNonFeatured.length} berita ditemukan`
                  : "Berita dan informasi terbaru LPM"}
              </p>
            </div>
            <div className="w-12 h-1 bg-primary rounded-full" />
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filteredNonFeatured.length === 0 ? (
            <div className="text-center py-20 bg-card border border-border rounded-3xl">
              <Newspaper className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-foreground font-bold text-lg">
                {query ? "Tidak ada berita ditemukan" : "Belum ada berita lainnya"}
              </p>
              <p className="text-muted-foreground text-sm mt-1">
                {query ? "Coba ubah kata kunci pencarian" : "Semua berita sudah tampil di Berita Utama"}
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {beritaTampil.map((b) => <BeritaCard key={b.id} berita={b} />)}
              </div>
              {hasMoreBerita && (
                <div className="flex justify-center pt-8">
                  <button
                    type="button"
                    onClick={() => setShowAllOther(true)}
                    className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary-dark hover:shadow-primary/30"
                  >
                    Lihat Selengkapnya
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
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
