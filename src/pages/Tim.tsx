import HeroSection from "@/components/HeroSection";
import OrgCard from "@/components/OrgCard";
import TeamCard from "@/components/TeamCard";
import { useTimStore } from "@/data/profilStore";
import heroBg from "@/assets/Gambar5.jpg";

const Tim = () => {
  const { data } = useTimStore();
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
      <section className="py-20 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 animate-fade-up">
            <span className="inline-block bg-accent text-primary text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
              Struktur
            </span>
            <h2 className="text-3xl font-black text-foreground">
              Struktur Organisasi <span className="text-primary">LPM ITENAS</span>
            </h2>
            <p className="text-muted-foreground mt-2 text-sm">Berikut ini adalah tim pengelola</p>
          </div>

          <div className="animate-fade-up overflow-x-auto pb-4 space-y-2">
            {/* Head level (kartu tunggal di tengah) */}
            {headLevel && (
              <>
                <div className="flex justify-center flex-wrap gap-4">
                  {headLevel.members.map((m) => (
                    <OrgCard key={m.id} name={m.name} role={m.role} isHead />
                  ))}
                </div>
              </>
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
                  <div className="flex justify-center"><div className="w-0.5 h-6 bg-primary/20" /></div>
                  {lvl.members.length > 1 && (
                    <div className="flex justify-center"><div className="w-3/4 h-0.5 bg-primary/20" /></div>
                  )}
                  {lvl.label && (
                    <p className="text-center text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-2">
                      {lvl.label}
                    </p>
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
      <section className="py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-fade-up">
            <span className="inline-block bg-accent text-primary text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
              Tim Pengelola
            </span>
            <h2 className="text-3xl font-black text-foreground">
              Tim Pengelola <span className="text-primary">LPM ITENAS</span>
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
      <section className="py-20 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-fade-up">
            <h2 className="text-3xl font-black text-foreground">
              Tim Auditor <span className="text-primary">Internal</span>
            </h2>
          </div>

          <div className="bg-surface rounded-3xl p-8 border border-border animate-fade-up">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {data.auditor.map((auditor, i) => (
                <div key={i} className="flex items-center gap-3 bg-card rounded-xl px-4 py-3 shadow-sm border border-border hover:border-primary/20 hover:shadow-md transition-all duration-200">
                  <div className="w-8 h-8 rounded-full bg-accent border border-primary/10 flex items-center justify-center flex-shrink-0">
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
