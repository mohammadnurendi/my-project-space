import HeroSection from "@/components/HeroSection";
import Timeline, { TimelineItem } from "@/components/Timeline";
import { Ruler, Settings, BarChart3, Search, CheckCircle2, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { useRoadMapStore } from "@/data/profilStore";
import { profilApi } from "@/services/profilApi";
import heroBg from "@/assets/Gambar4.jpg";

const ICONS: Record<string, React.ElementType> = {
  Standar: Ruler, Pelaksanaan: Settings, Monitoring: BarChart3,
  Evaluasi: Search, "Audit Internal": CheckCircle2, "Peningkatan Mutu": TrendingUp,
};

const RoadMap = () => {
  const { data: fallbackData } = useRoadMapStore();
  const [data, setData] = useState(fallbackData);

  useEffect(() => {
    profilApi.roadmap.get()
      .then(setData)
      .catch(() => setData(fallbackData));
  }, [fallbackData]);

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

      <section className="py-16 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <span className="block text-primary text-xs font-bold uppercase tracking-[0.22em] mb-3">
              Road Map
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-foreground">
              Road Map LPM Itenas
            </h2>
          </div>

          <div>
            <Timeline items={roadmapItems} />
          </div>

          <div className="mt-16">
            <div className="mb-8">
              <h3 className="text-2xl font-black text-foreground">
                Siklus PPEPP
              </h3>
              <p className="text-muted-foreground mt-2 text-sm">
                Mekanisme pelaksanaan dan pengendalian penjaminan mutu
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {data.ppepp.map((label, i) => {
                const Icon = ICONS[label] ?? CheckCircle2;
                return (
                  <div key={i} className="rounded-xl border border-border bg-card p-5">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-bold leading-tight text-foreground">{label}</span>
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
