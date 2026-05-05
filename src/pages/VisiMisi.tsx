import HeroSection from "@/components/HeroSection";
import { Eye, ClipboardList, Check, BarChart3 } from "lucide-react";
import { useVisiMisiStore } from "@/data/profilStore";
import heroBg from "@/assets/Gambar3.jpg";

const VisiMisi = () => {
  const { data } = useVisiMisiStore();

  return (
    <div>
      <HeroSection
        titleBlack="VISI & MISI"
        titleOrange="LPM ITENAS"
        badge="Profil"
        subtitle="Komitmen kami dalam membangun sistem penjaminan mutu yang profesional dan berkesinambungan"
        bgImage={heroBg}
      />

      <section className="py-20 bg-background">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 animate-fade-up">
            <span className="inline-block bg-accent text-primary text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
              Visi & Misi
            </span>
            <h2 className="text-3xl font-black text-foreground">
              Visi & Misi <span className="text-primary">LPM Itenas</span>
            </h2>
          </div>

          {/* Visi */}
          <div className="mb-8 animate-fade-up relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-primary-light p-1 shadow-xl shadow-primary/20">
            <div className="bg-card rounded-[20px] p-8">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center">
                  <Eye className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-black text-foreground">Visi</h3>
              </div>
              <p className="text-foreground/80 leading-relaxed text-base font-medium whitespace-pre-line">{data.visi}</p>
            </div>
          </div>

          {/* Misi */}
          <div className="mb-8 bg-surface rounded-3xl p-8 border border-border animate-fade-up" style={{ animationDelay: "100ms" }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-foreground text-background flex items-center justify-center">
                <ClipboardList className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-black text-foreground">Misi</h3>
            </div>
            <div className="space-y-4">
              {data.misi.map((misi, i) => (
                <div key={i} className="flex items-start gap-4 bg-card rounded-2xl p-4 shadow-sm border border-border hover:border-primary/20 hover:shadow-md transition-all duration-200">
                  <div className="w-8 h-8 rounded-xl bg-accent flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-primary" strokeWidth={2.5} />
                  </div>
                  <p className="text-foreground/80 text-sm leading-relaxed font-medium">{misi}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Sasaran */}
          <div className="animate-fade-up" style={{ animationDelay: "200ms" }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-xl font-black text-foreground">Sasaran Mutu</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {data.sasaran.map((s, i) => (
                <div key={i} className="relative bg-card rounded-2xl p-6 border border-border shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-primary rounded-t-2xl" />
                  <div className="text-4xl font-black text-primary/10 mb-2 leading-none">
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
