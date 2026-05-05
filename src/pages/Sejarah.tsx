import HeroSection from "@/components/HeroSection";
import { Scale } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSejarahStore } from "@/data/profilStore";
import heroBg from "@/assets/Gambar2.jpg";

const Sejarah = () => {
  const { data } = useSejarahStore();
  const history = data.events;

  return (
    <div>
      <HeroSection
        titleBlack="SEJARAH"
        titleOrange="LPM ITENAS"
        badge="Profil"
        subtitle="Perjalanan panjang Lembaga Penjaminan Mutu Institut Teknologi Nasional Bandung"
        bgImage={heroBg}
      />

      <section className="py-20 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-up">
            <span className="inline-block bg-accent text-primary text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
              Sejarah
            </span>
            <h2 className="text-3xl font-black text-foreground">
              Sejarah <span className="text-primary">LPM Itenas</span>
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed max-w-2xl mx-auto whitespace-pre-line">
              {data.intro}
            </p>
          </div>

          <div className="space-y-8">
            {history.map((event, i) => (
              <div key={event.id} className="flex gap-6 animate-fade-up" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="flex-shrink-0 flex flex-col items-center">
                  <div className={cn(
                    "w-16 h-16 rounded-2xl flex items-center justify-center font-black text-sm leading-tight text-center",
                    i % 2 === 0 ? "bg-primary text-primary-foreground" : "bg-accent text-primary border-2 border-primary/20"
                  )}>
                    {event.year}
                  </div>
                  {i < history.length - 1 && <div className="w-0.5 flex-1 bg-primary/10 mt-3 min-h-8" />}
                </div>
                <div className="flex-1 pb-8">
                  <div className="bg-card rounded-2xl p-6 shadow-sm border border-border hover:shadow-md hover:border-primary/20 transition-all duration-300">
                    <h3 className="font-bold text-foreground mb-2">{event.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-line">{event.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-accent border border-primary/10 rounded-2xl p-8">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Scale className="text-primary w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-foreground mb-3">{data.legalTitle}</h3>
                <p className="text-sm text-muted-foreground mb-4 whitespace-pre-line">{data.legalIntro}</p>
                <ol className="space-y-2">
                  {data.legalTasks.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-foreground/80">
                      <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ol>
                <p className="mt-4 text-xs text-muted-foreground italic">{data.legalFooter}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Sejarah;
