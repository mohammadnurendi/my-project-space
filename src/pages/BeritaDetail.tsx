import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  ArrowLeft, Calendar, User, Tag,
  ChevronRight, Newspaper, TrendingUp, BookOpen, Megaphone,
  Loader2,
} from "lucide-react";
import { beritaApi, type ApiBerita } from "@/services/beritaApi";

/* ─── Local BeritaItem type ────────────────────────────────── */
type BeritaItem = {
  id: string; judul: string; kategori: string; ringkasan: string;
  isi: string; penulis: string; tanggal: string; gambar: string;
  gambarUrls: string[]; gambarLainUrls: string[]; featured: boolean; tags: string[];
};

function toItem(b: ApiBerita): BeritaItem {
  return {
    id: String(b.id), judul: b.judul, kategori: b.kategori,
    ringkasan: b.ringkasan, isi: b.isi, penulis: b.penulis,
    tanggal: b.tanggal, gambar: b.gambar_url ?? "",
    gambarUrls: b.gambar_urls ?? (b.gambar_url ? [b.gambar_url] : []),
    gambarLainUrls: b.gambar_lain_urls ?? b.gambar_urls?.slice(1) ?? [],
    featured: b.featured, tags: b.tags ?? [],
  };
}

/* ─── Helpers ─────────────────────────────────────────────── */
const formatTanggal = (iso: string) =>
  new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });

const estimasiWaktuBaca = (isi: string) => {
  const words = isi.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
};

const kategoriColor = "bg-primary/10 text-primary ring-1 ring-primary/20";

const kategoriIcon = (k: string) =>
  ({
    Audit: TrendingUp,
    Kegiatan: BookOpen,
    Prestasi: Newspaper,
    Pengumuman: Megaphone,
  } as Record<string, React.ElementType>)[k] ?? Newspaper;

/* ─── Render isi dengan markdown sederhana ─────────────── */
function ArticleImage({ src, index, variant }: { src: string; index: number; variant: "wide" | "cinema" | "portrait" }) {
  const ratioClass = {
    wide: "aspect-[16/9]",
    cinema: "aspect-[21/9]",
    portrait: "aspect-[16/10]",
  }[variant];

  return (
    <figure className="my-8 w-full overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <img
        src={src}
        alt={`Foto isi berita ${index + 1}`}
        className={`w-full ${ratioClass} object-cover`}
      />
    </figure>
  );
}

function RenderIsi({ isi, images = [] }: { isi: string; images?: string[] }) {
  // Normalize: pastikan heading dan blockquote selalu mulai di blok baru
  const normalized = isi
    .replace(/\r\n/g, "\n")
    .replace(/([^\n])\n(#{1,3} )/g, "$1\n\n$2")
    .replace(/([^\n])\n(> )/g, "$1\n\n$2");

  const blocks = normalized.trim().split(/\n\n+/);
  const imageVariants: Array<"wide" | "cinema" | "portrait"> = ["wide", "cinema", "portrait"];
  const imageSlots = new Map<number, { src: string; variant: "wide" | "cinema" | "portrait"; index: number }>();

  images.slice(0, 3).forEach((src, imageIndex) => {
    if (!blocks.length) return;
    const slot = Math.min(blocks.length - 1, Math.max(0, Math.floor(((imageIndex + 1) * blocks.length) / 4)));
    imageSlots.set(slot, { src, variant: imageVariants[imageIndex], index: imageIndex });
  });

  const renderInline = (text: string) => {
    const parts = text.split(/(\*\*.+?\*\*|\*.+?\*)/g);
    return parts.map((part, index) => {
      const bold = part.match(/^\*\*(.+?)\*\*$/);
      if (bold) return <strong key={index} className="font-bold text-foreground">{bold[1]}</strong>;

      const italic = part.match(/^\*(.+?)\*$/);
      if (italic) return <em key={index} className="italic">{italic[1]}</em>;

      return <span key={index}>{part}</span>;
    });
  };

  const renderBlock = (block: string, index: number) => {
        const trimmed = block.trim();

        if (trimmed.startsWith("### ")) {
          return (
            <h3 key={index} className="text-lg font-black text-foreground mt-8 mb-2 first:mt-0 border-l-4 border-primary pl-4">
              {renderInline(trimmed.replace(/^###\s+/, ""))}
            </h3>
          );
        }

        if (trimmed.startsWith("## ")) {
          return (
            <h2 key={index} className="text-xl md:text-2xl font-black text-foreground mt-9 mb-3 first:mt-0">
              {renderInline(trimmed.replace(/^##\s+/, ""))}
            </h2>
          );
        }

        if (trimmed.startsWith("# ")) {
          return (
            <h1 key={index} className="text-2xl font-black text-foreground mt-9 mb-3 first:mt-0">
              {renderInline(trimmed.replace(/^#\s+/, ""))}
            </h1>
          );
        }

        if (trimmed.startsWith("> ")) {
          return (
            <blockquote key={index} className="border-l-4 border-primary bg-primary/5 rounded-r-2xl px-5 py-4 font-medium text-foreground/90 italic">
              {renderInline(trimmed.replace(/^>\s+/, ""))}
            </blockquote>
          );
        }

        const lines = trimmed.split("\n");
        const isList = lines.length > 0 && lines.every((line) => /^[-*]\s+/.test(line.trim()));
        if (isList) {
          return (
            <ul key={index} className="space-y-2 pl-5 list-disc marker:text-primary">
              {lines.map((line, lineIndex) => (
                <li key={lineIndex}>{renderInline(line.replace(/^[-*]\s+/, ""))}</li>
              ))}
            </ul>
          );
        }

        // Paragraph biasa — pisahkan per baris jika ada newline tunggal
        const paragraphLines = trimmed.split("\n");
        if (paragraphLines.length > 1) {
          return (
            <p key={index}>
              {paragraphLines.map((line, li) => (
                <span key={li}>{renderInline(line)}{li < paragraphLines.length - 1 && <br />}</span>
              ))}
            </p>
          );
        }

        return <p key={index}>{renderInline(trimmed)}</p>;
  };

  return (
    <div className="space-y-5 text-[15px] text-foreground/80 leading-relaxed">
      {blocks.map((block, index) => {
        const image = imageSlots.get(index);

        return (
          <div key={index} className="contents">
            {renderBlock(block, index)}
            {image && <ArticleImage src={image.src} variant={image.variant} index={image.index} />}
          </div>
        );
      })}
    </div>
  );
}

/* ─── Related card ─────────────────────────────────────────── */
function RelatedCard({ berita }: { berita: BeritaItem }) {
  const KatIcon = kategoriIcon(berita.kategori);
  const image = berita.gambarUrls[0] ?? berita.gambar;
  return (
    <Link
      to={`/berita/${berita.id}`}
      className="group flex gap-3 items-start p-3 rounded-2xl hover:bg-muted/60 transition-colors"
    >
      <div className="w-20 h-14 rounded-xl overflow-hidden shrink-0 bg-muted">
        {image && (
          <img src={image} alt={berita.judul} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full mb-1.5 ${kategoriColor}`}>
          <KatIcon className="w-2.5 h-2.5" />{berita.kategori}
        </span>
        <p className="text-[13px] font-semibold text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors">
          {berita.judul}
        </p>
        <p className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1">
          <Calendar className="w-3 h-3" />{formatTanggal(berita.tanggal)}
        </p>
      </div>
    </Link>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════ */
const BeritaDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [berita, setBerita] = useState<BeritaItem | null>(null);
  const [related, setRelated] = useState<BeritaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) { setNotFound(true); setLoading(false); return; }
    const numId = Number(id);
    if (isNaN(numId)) { setNotFound(true); setLoading(false); return; }

    setLoading(true);
    Promise.all([
      beritaApi.show(numId),
      beritaApi.list(),
    ])
      .then(([detail, all]) => {
        setBerita(toItem(detail));
        setRelated(all.filter((b) => b.id !== numId).slice(0, 4).map(toItem));
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  /* ── Loading state ── */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  /* ── Not found ── */
  if (notFound || !berita) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center pt-16">
        <div className="text-center px-4">
          <Newspaper className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <h1 className="text-2xl font-black text-foreground mb-2">Berita tidak ditemukan</h1>
          <p className="text-muted-foreground mb-6">Berita yang kamu cari mungkin sudah dihapus atau tidak tersedia.</p>
          <Link
            to="/berita"
            className="inline-flex items-center gap-2 bg-primary text-white font-semibold px-6 py-3 rounded-full hover:bg-primary-dark transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali ke Berita
          </Link>
        </div>
      </div>
    );
  }

  const waktuBaca = estimasiWaktuBaca(berita.isi);
  const KatIcon = kategoriIcon(berita.kategori);
  const heroImage = berita.gambar || berita.gambarUrls[0];
  const contentImages = berita.gambarLainUrls;

  return (
    <div className="min-h-screen bg-surface">

      {/* ── Hero image ── */}
      <div className="relative w-full h-[320px] md:h-[480px] lg:h-[540px] bg-foreground overflow-hidden">
        {heroImage && (
          <img
            src={heroImage}
            alt={berita.judul}
            className="w-full h-full object-cover opacity-70"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />

        {/* Breadcrumb */}
        <div className="absolute top-0 left-0 right-0 pt-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <nav className="flex items-center gap-2 text-[12px] text-white/60 font-medium">
              <Link to="/" className="hover:text-white transition-colors">Beranda</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <Link to="/berita" className="hover:text-white transition-colors">Berita</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-white/40 truncate max-w-[200px]">{berita.judul}</span>
            </nav>
          </div>
        </div>

        {/* Judul */}
        <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-6 lg:px-8 pb-8 md:pb-12">
          <div className="max-w-5xl mx-auto">
            <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-full mb-4 ${kategoriColor}`}>
              <KatIcon className="w-3 h-3" />{berita.kategori}
            </span>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-white leading-tight max-w-3xl">
              {berita.judul}
            </h1>
          </div>
        </div>
      </div>

      {/* ── Content area ── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-14">

          {/* ── Main article ── */}
          <article className="flex-1 min-w-0">

            {/* Meta info */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground mb-6 pb-6 border-b border-border">
              <span className="flex items-center gap-1.5 font-medium">
                <User className="w-4 h-4 text-primary" />
                {berita.penulis}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-primary" />
                {formatTanggal(berita.tanggal)}
              </span>
            </div>

            {/* Ringkasan / lead */}
            <div className="bg-primary/5 border-l-4 border-primary rounded-r-2xl px-5 py-4 mb-8">
              <p className="text-[15px] font-semibold text-foreground/90 leading-relaxed italic">
                {berita.ringkasan}
              </p>
            </div>

            {/* Isi artikel */}
            <RenderIsi isi={berita.isi} images={contentImages} />

            {/* Tags */}
            {berita.tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mt-10 pt-8 border-t border-border">
                <Tag className="w-4 h-4 text-muted-foreground shrink-0" />
                {berita.tags.map((t) => (
                  <span key={t} className="inline-flex items-center bg-muted hover:bg-primary/10 hover:text-primary text-muted-foreground text-[12px] font-semibold px-3 py-1.5 rounded-full cursor-pointer transition-colors">
                    #{t}
                  </span>
                ))}
              </div>
            )}

            {/* Back button */}
            <div className="mt-10">
              <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Kembali ke halaman sebelumnya
              </button>
            </div>
          </article>

          {/* ── Sidebar ── */}
          <aside className="w-full lg:w-80 shrink-0 space-y-6">

            {/* Tentang LPM */}
            <div className="bg-card border border-border rounded-3xl p-5">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                <Newspaper className="w-6 h-6" />
              </div>
              <h3 className="font-black text-foreground text-base mb-2">LPM Itenas</h3>
              <p className="text-[13px] text-muted-foreground leading-relaxed mb-4">
                Lembaga Penjaminan Mutu Institut Teknologi Nasional Bandung berkomitmen untuk menjaga dan meningkatkan kualitas pendidikan secara berkelanjutan.
              </p>
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 text-[13px] font-bold text-primary hover:gap-2.5 transition-all"
              >
                Pelajari lebih lanjut <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Kategori */}
            <div className="bg-card border border-border rounded-3xl p-5">
              <h3 className="font-black text-foreground text-base mb-4">Kategori Berita</h3>
              <div className="space-y-1">
                {["Audit", "Kegiatan", "Prestasi", "Pengumuman"].map((k) => {
                  const KatIcon2 = kategoriIcon(k);
                  const count = related.filter((b) => b.kategori === k).length;
                  return (
                    <Link
                      key={k}
                      to="/berita"
                      className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-muted group transition-colors"
                    >
                      <span className="flex items-center gap-2 text-[13px] font-semibold text-muted-foreground group-hover:text-primary transition-colors">
                        <KatIcon2 className="w-4 h-4" />{k}
                      </span>
                      <span className="text-[11px] font-bold text-muted-foreground/60 bg-muted px-2 py-0.5 rounded-full">{count}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Berita terkait */}
            {related.length > 0 && (
              <div className="bg-card border border-border rounded-3xl p-5">
                <h3 className="font-black text-foreground text-base mb-4">Berita Terkait</h3>
                <div className="space-y-1 -mx-2">
                  {related.map((b) => (
                    <RelatedCard key={b.id} berita={b} />
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-border">
                  <Link
                    to="/berita"
                    className="flex items-center justify-center gap-1.5 text-[13px] font-bold text-primary hover:gap-3 transition-all w-full py-2.5 rounded-xl hover:bg-primary/5"
                  >
                    Lihat semua berita <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )}

          </aside>
        </div>
      </div>
    </div>
  );
};

export default BeritaDetail;
