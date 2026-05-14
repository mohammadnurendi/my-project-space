import HeroSection from "@/components/HeroSection";
import OrgCard from "@/components/OrgCard";
import TeamCard from "@/components/TeamCard";
import { useEffect, useState } from "react";
import { useTimStore } from "@/data/profilStore";
import { profilApi } from "@/services/profilApi";
import heroBg from "@/assets/Gambar5.jpg";

const countTeamData = (data: ReturnType<typeof useTimStore>["data"]) =>
  data.levels.reduce((sum, level) => sum + level.members.length, 0) +
  data.pengelola.length +
  data.auditor.length;

const Tim = () => {
  const { data: fallbackData } = useTimStore();
  const [data, setData] = useState(fallbackData);

  useEffect(() => {
    profilApi.tim.get()
      .then((apiData) => {
        setData(countTeamData(fallbackData) > countTeamData(apiData) ? fallbackData : apiData);
      })
      .catch(() => setData(fallbackData));
  }, [fallbackData]);

  const [headLevel, ...subLevels] = data.levels;

  return (
    <div>
      <HeroSection
        titleBlack="TIM"
        titleOrange="LPM ITENAS"
        badge="Profil"
        subtitle="Struktur organisasi dan tim pengelola Lembaga Penjaminan Mutu Institut Teknologi Nasional Bandung"
        bgImage={heroBg}
      />

      {/* Struktur Organisasi */}
      <section className="py-16 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <span className="block text-primary text-xs font-bold uppercase tracking-[0.22em] mb-3">
              Struktur
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-foreground">
              Struktur Organisasi LPM ITENAS
            </h2>
          </div>

          <div className="overflow-x-auto pb-4 space-y-2">
            {headLevel && (
              <div className="flex justify-center flex-wrap gap-4">
                {headLevel.members.map((m) => (
                  <OrgCard key={m.id} name={m.name} role={m.role} isHead />
                ))}
              </div>
            )}

            {subLevels.map((lvl) => {
              const cols = Math.min(Math.max(lvl.members.length, 1), 4);
              const gridClass =
                cols === 1 ? "grid grid-cols-1 justify-items-center" :
                cols === 2 ? "grid grid-cols-1 sm:grid-cols-2" :
                cols === 3 ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" :
                "grid grid-cols-2 lg:grid-cols-4";

              return (
                <div key={lvl.id} className="space-y-2">
                  <div className="flex justify-center"><div className="w-px h-6 bg-border" /></div>
                  {lvl.members.length > 1 && (
                    <div className="flex justify-center"><div className="w-3/4 h-px bg-border" /></div>
                  )}
                  <div className={`${gridClass} gap-4`}>
                    {lvl.members.map((m) => (
                      <div key={m.id} className="flex flex-col items-center">
                        <OrgCard name={m.name} role={m.role} />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Tim Pengelola */}
      <section className="py-16 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <h2 className="text-2xl sm:text-3xl font-black text-foreground">
              Tim Pengelola LPM ITENAS
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {data.pengelola.map((m) => (
              <TeamCard key={m.id} name={m.name} role={m.role} photo={m.photo} />
            ))}
          </div>
        </div>
      </section>

      {/* Auditor */}
      <section className="py-16 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <h2 className="text-2xl sm:text-3xl font-black text-foreground">
              Tim Auditor Internal
            </h2>
          </div>

          <div className="bg-surface rounded-xl p-6 sm:p-8 border border-border">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {data.auditor.map((auditor, i) => (
                <div key={i} className="flex items-center gap-3 bg-card rounded-xl px-4 py-3 border border-border">
                  <div className="w-8 h-8 rounded-full bg-muted border border-border flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-bold text-xs">{i + 1}</span>
                  </div>
                  <span className="text-sm text-foreground font-medium">{auditor}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Tim;
