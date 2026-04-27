import HeroSection from "@/components/HeroSection";
import Timeline, { TimelineItem } from "@/components/Timeline";
import { ChevronRight, Ruler, Settings, BarChart3, Search, CheckCircle2, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

const roadmapItems: TimelineItem[] = [
  {
    period: "2014 – 2020",
    title: "Tahap Pengembangan Sistem Manajemen Mutu",
    description:
      "Pada tahap ini diawali dengan koordinasi untuk membentuk struktur organisasi yang kuat dengan didukung dengan personalia yang mumpuni serta menyusun rencana kerja yang akan dilaksanakan. Pengembangan Sistem Penjaminan Mutu, pengembangan perangkat dan panduan pelaksanaan penjaminan mutu secara bertahap, konsisten dan berkesinambungan.",
    active: false,
  },
  {
    period: "2021 – 2025",
    title: "Tahap Memantapkan Sistem Penjaminan Mutu",
    description:
      "Pada tahap ini pelaksanaan SPMI pada semua unit kerja secara keseluruhan sudah berjalan dengan baik. Fokus pengembangan yaitu penguatan Sistem Penjaminan Mutu yang berhubungan dengan riset. SPMI yang dikembangkan sudah tidak hanya mengacu pada standar nasional dari Dikti, juga sudah mengacu kepada standar internasional.",
    active: true,
  },
  {
    period: "2026 – 2030",
    title: "Tahap Pencapaian Keunggulan Mutu Itenas",
    description:
      "Pada tahap ini Sistem Penjaminan Mutu sudah berjalan dengan baik sesuai dengan falsafah, visi, misi, dan tujuan pendidikan Itenas serta ketentuan yang ditetapkan oleh Ristekdikti. Untuk riset sudah siap menggunakan standar mutu internasional.",
    active: false,
  },
];

const ppepp = [
  { label: "Standar", Icon: Ruler },
  { label: "Pelaksanaan", Icon: Settings },
  { label: "Monitoring", Icon: BarChart3 },
  { label: "Evaluasi", Icon: Search },
  { label: "Audit Internal", Icon: CheckCircle2 },
  { label: "Peningkatan Mutu", Icon: TrendingUp },
];

const RoadMap = () => {
  return (
    <div>
      <HeroSection
        titleBlack="ROAD MAP"
        titleOrange="LPM ITENAS"
        badge="Profil"
        subtitle="Rencana pengembangan dan tahapan pencapaian sistem penjaminan mutu Itenas"
      />

      <section className="py-20 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 animate-fade-up">
            <span className="inline-block bg-accent text-primary text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
              Road Map
            </span>
            <h2 className="text-3xl font-black text-foreground">
              Road Map <span className="text-primary">LPM Itenas</span>
            </h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto text-sm leading-relaxed">
              Keberadaan Lembaga Penjaminan Mutu (LPM) dalam struktur organisasi Itenas telah ditetapkan sejak tahun 2003 dalam Statuta Itenas, sebagai tindak lanjut dari keberhasilan empat jurusan yaitu jurusan Teknik Industri, Teknik Sipil, Teknik Mesin dan Teknik Kimia dalam memperoleh hibah Technological and Professional Skills Development Sector Project (TPSDP) dari Dikti pada tahun 2002 dan 2003.
            </p>
          </div>

          <div className="animate-fade-up" style={{ animationDelay: "100ms" }}>
            <Timeline items={roadmapItems} />
          </div>

          {/* PPEPP cycle */}
          <div className="mt-20 animate-fade-up" style={{ animationDelay: "200ms" }}>
            <div className="text-center mb-10">
              <h3 className="text-2xl font-black text-foreground">
                Siklus <span className="text-primary">PPEPP</span>
              </h3>
              <p className="text-muted-foreground mt-2 text-sm">
                Mekanisme pelaksanaan dan pengendalian penjaminan mutu
              </p>
            </div>

            <div className="relative flex flex-wrap justify-center items-center gap-2 sm:gap-4">
              {ppepp.map((step, i) => {
                const { Icon } = step;
                return (
                  <div key={i} className="flex items-center gap-2">
                    <div className="relative group">
                      <div
                        className={cn(
                          "w-24 h-24 sm:w-28 sm:h-28 rounded-2xl flex flex-col items-center justify-center text-center p-2 cursor-default transition-all duration-300 hover:scale-110 hover:shadow-xl",
                          i % 2 === 0
                            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                            : "bg-card border-2 border-primary text-primary"
                        )}
                      >
                        <Icon className="w-6 h-6 mb-1" />
                        <span className="text-xs font-bold leading-tight">{step.label}</span>
                      </div>
                    </div>
                    {i < ppepp.length - 1 && (
                      <ChevronRight className="w-4 h-4 text-primary flex-shrink-0 hidden sm:block" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RoadMap;
