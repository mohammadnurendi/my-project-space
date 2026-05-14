import HeroSection from "@/components/HeroSection";
import { Eye, ClipboardList, Check, BarChart3 } from "lucide-react";
import { useEffect, useState } from "react";
import { useVisiMisiStore } from "@/data/profilStore";
import { profilApi } from "@/services/profilApi";
import heroBg from "@/assets/Gambar3.jpg";

const VisiMisi = () => {
  const { data: fallbackData } = useVisiMisiStore();
  const [data, setData] = useState(fallbackData);

  useEffect(() => {
    profilApi.visiMisi.get()
      .then(setData)
      .catch(() => setData(fallbackData));
  }, [fallbackData]);

  return (
    <div>
      <HeroSection
        titleBlack="VISI & MISI"
        titleOrange="LPM ITENAS"
        badge="Profil"
        subtitle="Komitmen kami dalam membangun sistem penjaminan mutu yang profesional dan berkesinambungan"
        bgImage={heroBg}
      />

      <section className="py-16 bg-background">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <span className="block text-primary text-xs font-bold uppercase tracking-[0.22em] mb-3">
              Visi & Misi
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-foreground">
              Visi & Misi LPM Itenas
            </h2>
          </div>

          <div className="mb-6 rounded-xl bg-card border border-border p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <Eye className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-black text-foreground">Visi</h3>
              </div>
              <p className="text-foreground/80 leading-relaxed text-base font-medium whitespace-pre-line">{data.visi}</p>
          </div>

          <div className="mb-8 bg-surface rounded-xl p-6 sm:p-8 border border-border">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-card border border-border text-primary flex items-center justify-center">
                <ClipboardList className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-black text-foreground">Misi</h3>
            </div>
            <div className="space-y-4">
              {data.misi.map((misi, i) => (
                <div key={i} className="flex items-start gap-4 bg-card rounded-xl p-4 border border-border">
                  <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-primary" strokeWidth={2.5} />
                  </div>
                  <p className="text-foreground/80 text-sm leading-relaxed font-medium">{misi}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Sasaran */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-xl font-black text-foreground">Sasaran Mutu</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {data.sasaran.map((s, i) => (
                <div key={i} className="relative bg-card rounded-xl p-6 border border-border overflow-hidden">
                  <div className="text-3xl font-black text-primary/15 mb-2 leading-none">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <p className="text-foreground font-semibold text-sm leading-relaxed">{s}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default VisiMisi;
