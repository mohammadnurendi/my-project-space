import { useEffect, useState } from "react";

interface HeroSectionProps {
  titleBlack: string;
  titleOrange?: string;
  subtitle?: string;
  badge?: string;
  bgImage?: string;
}

const HeroSection = ({ titleBlack, titleOrange, subtitle, badge, bgImage }: HeroSectionProps) => {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const onScroll = () => setOffset(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="relative overflow-hidden pt-16">
      {/* Parallax Background */}
      <div className="absolute inset-0 bg-foreground">
        {bgImage && (
          <img
            src={bgImage}
            alt=""
            className="absolute inset-0 w-full h-[120%] object-cover opacity-40 will-change-transform"
            style={{ transform: `translateY(${offset * 0.4}px) scale(1.05)` }}
          />
        )}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-foreground/85 via-foreground/75 to-primary/40" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        <div className="animate-fade-up">
          {badge && (
            <div className="inline-flex items-center gap-2 bg-primary/20 border border-primary/30 text-primary rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-widest mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              {badge}
            </div>
          )}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-background leading-tight tracking-tight">
            <span className="text-background">{titleBlack}</span>
            {titleOrange && <span className="text-primary"> {titleOrange}</span>}
          </h1>
          {subtitle && (
            <p
              className="mt-4 text-background/70 text-lg max-w-xl animate-fade-up"
              style={{ animationDelay: "200ms" }}
            >
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default HeroSection;
