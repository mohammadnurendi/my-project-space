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
      <div className="absolute inset-0 bg-foreground">
        {bgImage && (
          <img
            src={bgImage}
            alt=""
            className="absolute inset-0 w-full h-[120%] object-cover opacity-40 will-change-transform"
            style={{ transform: `translateY(${offset * 0.35}px) scale(1.04)` }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-br from-foreground/90 via-foreground/78 to-primary/38" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        <div className="max-w-3xl">
          {badge && (
            <div className="mb-5 text-xs font-bold uppercase tracking-[0.22em] text-primary">
              {badge}
            </div>
          )}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-background leading-tight tracking-tight">
            <span className="text-background">{titleBlack}</span>
            {titleOrange && <span className="text-primary"> {titleOrange}</span>}
          </h1>
          {subtitle && (
            <p className="mt-4 text-background/70 text-base sm:text-lg max-w-2xl leading-relaxed">
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
