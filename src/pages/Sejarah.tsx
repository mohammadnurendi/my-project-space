import HeroSection from "@/components/HeroSection";
import { Scale } from "lucide-react";
import { useEffect, useState } from "react";
import { useSejarahStore } from "@/data/profilStore";
import { profilApi } from "@/services/profilApi";
import heroBg from "@/assets/Gambar2.jpg";

const Sejarah = () => {
  const { data: fallbackData } = useSejarahStore();
  const [data, setData] = useState(fallbackData);

  useEffect(() => {
    profilApi.sejarah.get()
      .then(setData)
      .catch(() => setData(fallbackData));
  }, [fallbackData]);

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

      <section className="py-16 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <span className="block text-primary text-xs font-bold uppercase tracking-[0.22em] mb-3">
              Sejarah
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-foreground">
              Sejarah LPM Itenas
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed max-w-3xl whitespace-pre-line">
              {data.intro}
            </p>
          </div>

          <div className="space-y-6">
            {history.map((event, i) => (
              <div key={event.id} className="flex gap-5">
                <div className="flex-shrink-0 flex flex-col items-center">
                  <div className="w-16 h-12 rounded-xl border border-border bg-card flex items-center justify-center font-black text-sm leading-tight text-center text-primary">
                    {event.year}
                  </div>
                  {i < history.length - 1 && <div className="w-px flex-1 bg-border mt-3 min-h-8" />}
                </div>
                <div className="flex-1 pb-6">
                  <div className="bg-card rounded-xl p-6 border border-border">
                    <h3 className="font-bold text-foreground mb-2">{event.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-line">{event.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 bg-surface border border-border rounded-xl p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-card border border-border flex items-center justify-center flex-shrink-0 mt-0.5">
                <Scale className="text-primary w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-foreground mb-3">{data.legalTitle}</h3>
                <p className="text-sm text-muted-foreground mb-4 whitespace-pre-line">{data.legalIntro}</p>
                <ol className="space-y-2">
                  {data.legalTasks.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-foreground/80">
                      <span className="w-6 h-6 rounded-full bg-card border border-border text-primary font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
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
