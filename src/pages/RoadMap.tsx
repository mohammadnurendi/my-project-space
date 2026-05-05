import HeroSection from "@/components/HeroSection";
import Timeline, { TimelineItem } from "@/components/Timeline";
import { ChevronRight, Ruler, Settings, BarChart3, Search, CheckCircle2, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRoadMapStore } from "@/data/profilStore";
import heroBg from "@/assets/Gambar4.jpg";

const ICONS: Record<string, React.ElementType> = {
  Standar: Ruler, Pelaksanaan: Settings, Monitoring: BarChart3,
  Evaluasi: Search, "Audit Internal": CheckCircle2, "Peningkatan Mutu": TrendingUp,
};

const RoadMap = () => {
  const { data } = useRoadMapStore();
  const roadmapItems: TimelineItem[] = data.items.map((it) => ({
    period: it.period, title: it.title, description: it.description, active: it.active,
  }));

  return (
    <div>
      <HeroSection
        titleBlack="ROAD MAP"
        titleOrange="LPM ITENAS"
        badge="Profil"
        subtitle="Rencana pengembangan dan tahapan pencapaian sistem penjaminan mutu Itenas"
        bgImage={heroBg}
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
          </div>

          <div className="animate-fade-up" style={{ animationDelay: "100ms" }}>
            <Timeline items={roadmapItems} />
          </div>

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
              {data.ppepp.map((label, i) => {
                const Icon = ICONS[label] ?? CheckCircle2;
                return (
                  <div key={i} className="flex items-center gap-2">
                    <div className="relative group">
                      <div className={cn(
                        "w-24 h-24 sm:w-28 sm:h-28 rounded-2xl flex flex-col items-center justify-center text-center p-2 cursor-default transition-all duration-300 hover:scale-110 hover:shadow-xl",
                        i % 2 === 0
                          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                          : "bg-card border-2 border-primary text-primary"
                      )}>
                        <Icon className="w-6 h-6 mb-1" />
                        <span className="text-xs font-bold leading-tight">{label}</span>
                      </div>
                    </div>
                    {i < data.ppepp.length - 1 && (
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
