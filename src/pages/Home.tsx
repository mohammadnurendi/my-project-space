import { Link, useNavigate } from "react-router-dom";
import type { ElementType } from "react";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  FileText,
  Files,
  BookOpen,
  ClipboardList,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  Award,
  Target,
  Users,
  Sparkles,
} from "lucide-react";
import FaqAccordion, { FaqItem } from "@/components/FaqAccordion";
import ParallaxBg from "@/components/ParallaxBg";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { dokumenApi, kategoriApi, type ApiDokumen, type ApiKategori } from "@/services/dokumenApi";
import { beritaApi, type ApiBerita } from "@/services/beritaApi";
import { profilApi } from "@/services/profilApi";
import { BERANDA_DEFAULT, type BerandaData, type HomeContactType } from "@/data/berandaContent";
import heroBg from "@/assets/Gambar1.jpg";

const docIcons = [FileText, Files, ClipboardList, BookOpen];
const docStyles = [
  "from-primary/95 via-primary/70 to-foreground/95",
  "from-foreground/95 via-foreground/75 to-primary/80",
  "from-emerald-700/95 via-primary/70 to-foreground/90",
  "from-sky-800/95 via-primary/65 to-foreground/90",
];

const features = [
  {
    Icon: ShieldCheck,
    title: "Penjaminan Mutu",
    desc: "Standar kualitas pendidikan yang konsisten dan berkesinambungan.",
  },
  {
    Icon: Award,
    title: "Akreditasi Terjamin",
    desc: "Memenuhi standar nasional Dikti dan ketentuan otoritas pendidikan.",
  },
  {
    Icon: Target,
    title: "Sasaran Mutu Jelas",
    desc: "Audit Mutu Internal berkala pada seluruh unit kerja Itenas.",
  },
  {
    Icon: Users,
    title: "Tim Profesional",
    desc: "Dikelola tim auditor internal dan pengelola yang berpengalaman.",
  },
];

const contactIcons: Record<HomeContactType, ElementType> = {
  address: MapPin,
  phone: Phone,
  email: Mail,
};

const Home = () => {
  const { isAuthenticated, userRole } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<ApiKategori[]>([]);
  const [documents, setDocuments] = useState<ApiDokumen[]>([]);
  const [beritaList, setBeritaList] = useState<ApiBerita[]>([]);
  const [beranda, setBeranda] = useState<BerandaData>(BERANDA_DEFAULT);

  useEffect(() => {
    Promise.all([kategoriApi.list(), dokumenApi.list(), beritaApi.list(), profilApi.beranda.get()])
      .then(([kategoriData, dokumenData, beritaData, berandaData]) => {
        setCategories(kategoriData);
        setDocuments(dokumenData);
        setBeritaList(beritaData);
        setBeranda({ ...BERANDA_DEFAULT, ...berandaData });
      })
      .catch(() => {
        setCategories([]);
        setDocuments([]);
        setBeritaList([]);
        setBeranda(BERANDA_DEFAULT);
      });
  }, []);

  const documentCards = useMemo(() => {
    return categories.slice(0, 4).map((category, index) => {
      const count = documents.filter((doc) => doc.kategori_id === category.id).length;
      return {
        ...category,
        count,
        Icon: docIcons[index % docIcons.length],
        bg: docStyles[index % docStyles.length],
      };
    });
  }, [categories, documents]);

  const goToDokumen = () => {
    if (!isAuthenticated) navigate("/login");
    else if (userRole === "admin") navigate("/admin");
    else navigate("/dokumen");
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden pt-16 bg-foreground min-h-[92vh] flex items-center">
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.5) 1px, transparent 0)",
              backgroundSize: "32px 32px",
            }}
          />
          <ParallaxBg src={heroBg} speed={0.35} opacity={0.35} />
          <div className="absolute inset-0 bg-gradient-to-br from-foreground/85 via-foreground/80 to-primary/40" />
          {/* Animated blobs */}
          <div className="absolute -top-20 -right-20 w-[28rem] h-[28rem] bg-primary/20 rounded-full blur-3xl animate-pulse" />
          <div
            className="absolute bottom-0 -left-20 w-80 h-80 bg-primary-light/15 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1.5s" }}
          />
          <div className="absolute top-1/3 left-1/2 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 w-full">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-8 animate-fade-up">
              <div className="inline-flex items-center gap-2 bg-primary/15 border border-primary/30 text-primary rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-widest mb-6 sm:mb-8">
                <Sparkles className="w-3.5 h-3.5" />
                Institut Teknologi Nasional Bandung
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-background leading-[1.05] tracking-tight">
                SELAMAT DATANG DI<br />
                <span className="bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
                  LEMBAGA
                </span>
                <br />
                <span className="text-background">PENJAMINAN MUTU</span>
              </h1>
              <p className="mt-5 sm:mt-6 text-background/70 text-base sm:text-lg leading-relaxed max-w-xl">
                Memastikan kualitas pendidikan yang terjaga dan memenuhi standar otoritas pendidikan
                nasional maupun kebutuhan masyarakat.
              </p>
              <div className="mt-8 flex items-center gap-3 sm:gap-4 flex-wrap">
                <button
                  onClick={goToDokumen}
                  className="bg-primary hover:bg-primary-dark text-primary-foreground px-6 py-3 rounded-full font-semibold text-sm transition-all duration-200 hover:shadow-xl hover:shadow-primary/40 active:scale-95 flex items-center gap-2"
                >
                  Akses Dokumen
                  <ArrowRight className="w-4 h-4" />
                </button>
                <Link
                  to="/sejarah"
                  className="text-background/70 hover:text-background px-6 py-3 rounded-full font-semibold text-sm border border-background/20 hover:border-background/40 hover:bg-background/5 transition-all duration-200 flex items-center gap-2"
                >
                  Pelajari Lebih Lanjut
                </Link>
              </div>
            </div>

            {/* Stats card on the side (desktop) / stacked (mobile) */}
            <div className="lg:col-span-4 animate-fade-up" style={{ animationDelay: "200ms" }}>
              <div className="bg-background/5 backdrop-blur-sm border border-background/10 rounded-3xl p-6 sm:p-7">
                <p className="text-[10px] uppercase tracking-[0.25em] text-primary font-bold mb-5">
                  {beranda.statsTitle}
                </p>
                <div className="grid grid-cols-2 gap-5">
                  {beranda.stats.map((s) => (
                    <div key={s.id}>
                      <p className="text-3xl sm:text-4xl font-black text-background">{s.value}</p>
                      <p className="text-[11px] text-background/60 mt-1 font-medium leading-tight">
                        {s.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent pointer-events-none" />
      </section>

      {/* Features */}
      <section className="py-16 sm:py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-14 animate-fade-up">
            <span className="inline-block bg-accent text-primary text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
              Keunggulan
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-foreground">
              Mengapa <span className="text-primary">LPM Itenas</span>
            </h2>
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto text-sm sm:text-base">
              Komitmen kami untuk memastikan kualitas pendidikan tinggi yang terjaga dan terstandar.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f, i) => {
              const { Icon } = f;
              return (
                <div
                  key={f.title}
                  className="group relative bg-card rounded-2xl p-6 border border-border hover:border-primary/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-fade-up overflow-hidden"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-foreground text-base mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Document Cards */}
      <section className="py-16 sm:py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-12 animate-fade-up">
            <span className="inline-block bg-accent text-primary text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
              Dokumen Kami
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-foreground">
              Dokumen <span className="text-primary">LPM Itenas</span>
            </h2>
            <p className="text-muted-foreground mt-3 max-w-md mx-auto text-sm sm:text-base">
              Akses semua dokumen resmi Sistem Penjaminan Mutu Internal Itenas
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
            {documentCards.map((doc, i) => {
              const { Icon } = doc;
              return (
                <button
                  key={doc.id}
                  onClick={goToDokumen}
                  className={cn(
                    "group cursor-pointer relative rounded-2xl overflow-hidden aspect-[3/4] shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 text-left animate-fade-up bg-foreground"
                  )}
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  {doc.image_url && (
                    <img
                      src={doc.image_url}
                      alt={doc.title}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  )}
                  <div className={cn("absolute inset-0 bg-gradient-to-t opacity-90 z-10", doc.bg)} />
                  <div
                    className="absolute inset-0 opacity-10"
                    style={{
                      backgroundImage:
                        "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)",
                      backgroundSize: "20px 20px",
                    }}
                  />
                  <div className="absolute top-3 right-3 sm:top-4 sm:right-4 w-9 h-9 sm:w-10 sm:h-10 bg-background/20 backdrop-blur-sm rounded-xl flex items-center justify-center z-20 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500">
                    <Icon className="text-background w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 z-20">
                    <h3 className="text-background font-bold text-sm leading-tight">{doc.title}</h3>
                    <p className="text-background/70 text-xs mt-1 line-clamp-2">{doc.description}</p>
                    <p className="mt-3 inline-flex items-center rounded-full bg-background/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-background/90">
                      {doc.count} Dokumen
                    </p>
                  </div>
                  <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
                </button>
              );
            })}
          </div>
          {documentCards.length === 0 && (
            <div className="rounded-3xl border border-dashed border-border bg-card p-10 text-center text-sm text-muted-foreground">
              Kategori dokumen belum tersedia.
            </div>
          )}
          {categories.length > 4 && (
            <div className="mt-8 flex justify-center">
              <button
                onClick={goToDokumen}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary-dark hover:shadow-primary/35 active:scale-95"
              >
                Lihat Selengkapnya
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Berita Terbaru */}
      {beritaList.length > 0 && (
        <section className="py-16 sm:py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-10 sm:mb-12 animate-fade-up">
              <div className="text-center w-full">
                <span className="inline-block bg-accent text-primary text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
                  Berita
                </span>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-foreground">
                  Berita <span className="text-primary">Terkini</span>
                </h2>
                <p className="text-muted-foreground mt-3 max-w-md mx-auto text-sm sm:text-base">
                  Ikuti perkembangan terbaru kegiatan LPM Itenas
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {beritaList.slice(0, 3).map((b) => {
                const image = b.gambar_urls?.[0] ?? b.gambar_url;
                const formattedDate = new Date(b.tanggal).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
                return (
                  <Link
                    key={b.id}
                    to={`/berita/${b.id}`}
                    className="group bg-card border border-border rounded-3xl overflow-hidden hover:shadow-xl hover:shadow-foreground/5 hover:-translate-y-1 transition-all duration-300 flex flex-col"
                  >
                    <div className="relative overflow-hidden aspect-[16/9]">
                      {image ? (
                        <img src={image} alt={b.judul} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                          <FileText className="w-8 h-8 text-muted-foreground/40" />
                        </div>
                      )}
                      {b.featured && (
                        <div className="absolute top-3 left-3 bg-primary text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                          Unggulan
                        </div>
                      )}
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <p className="text-[11px] text-muted-foreground mb-2">{formattedDate}</p>
                      <h3 className="font-bold text-foreground text-[15px] leading-snug mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {b.judul}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 flex-1">
                        {b.ringkasan}
                      </p>
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                        <span className="text-[12px] text-muted-foreground font-medium">{b.penulis}</span>
                        <span className="flex items-center gap-1 text-primary text-[12px] font-bold group-hover:gap-2 transition-all">
                          Baca <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {beritaList.length > 3 && (
              <div className="mt-8 flex justify-center">
                <Link
                  to="/berita"
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary-dark hover:shadow-primary/35 active:scale-95"
                >
                  Lihat Semua Berita
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            )}
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="py-16 sm:py-20 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-12 animate-fade-up">
            <span className="inline-block bg-accent text-primary text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
              {beranda.faqEyebrow}
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-foreground">
              {beranda.faqTitle}
            </h2>
          </div>

          <div className="bg-card rounded-3xl shadow-sm border border-border overflow-hidden animate-fade-up">
            <FaqAccordion items={beranda.faqs as FaqItem[]} />
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="py-16 sm:py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-12 animate-fade-up">
            <span className="inline-block bg-accent text-primary text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
              {beranda.locationEyebrow}
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-foreground">{beranda.locationTitle}</h2>
          </div>

          <a
            href="https://maps.app.goo.gl/CGywft5hbDRHc4y2A"
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-3xl overflow-hidden shadow-xl border border-border animate-fade-up group relative"
            aria-label="Buka lokasi Itenas di Google Maps"
          >
            <iframe
              title="Lokasi LPM Itenas"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3961.196843706265!2d107.63271731477248!3d-6.919249695003085!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68e763c5d72989%3A0x1235c16ec0af5ef1!2sInstitut%20Teknologi%20Nasional%20Bandung!5e0!3m2!1sid!2sid!4v1680000000000!5m2!1sid!2sid"
              width="100%"
              height={420}
              style={{ border: 0, pointerEvents: "none" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-[280px] sm:h-[420px]"
            />
            <span className="absolute bottom-4 right-4 inline-flex items-center gap-2 bg-primary text-primary-foreground rounded-full px-4 py-2 text-xs font-bold shadow-lg group-hover:scale-105 transition-transform">
              <MapPin className="w-3.5 h-3.5" /> Buka di Google Maps
            </span>
          </a>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {beranda.contactCards.map((info, i) => {
              const Icon = contactIcons[info.type] ?? MapPin;
              return (
                <div
                  key={info.id}
                  className="flex items-start gap-3 bg-card border border-border rounded-2xl p-4 sm:p-5 hover:border-primary/30 hover:shadow-md transition-all duration-300 animate-fade-up"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      {info.label}
                    </p>
                    <p className="text-sm text-foreground font-medium mt-0.5 break-words">
                      {info.value}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
