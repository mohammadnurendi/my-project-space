import { useEffect, useState } from "react";

interface ParallaxBgProps {
  src: string;
  /** strength of parallax, default 0.4 */
  speed?: number;
  /** opacity of the image, default 0.35 */
  opacity?: number;
  className?: string;
}

const ParallaxBg = ({ src, speed = 0.4, opacity = 0.35, className = "" }: ParallaxBgProps) => {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const onScroll = () => setOffset(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <img
      src={src}
      alt=""
      aria-hidden
      className={`absolute inset-0 w-full h-[130%] object-cover will-change-transform pointer-events-none ${className}`}
      style={{ transform: `translateY(${offset * speed}px) scale(1.05)`, opacity }}
    />
  );
};

export default ParallaxBg;
