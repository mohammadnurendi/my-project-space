import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const SECTION_REVEAL_SELECTOR = "main section:not(:first-child) > div";

const ScrollReveal = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const timers: number[] = [];
    const observers: IntersectionObserver[] = [];
    let mutationObserver: MutationObserver | null = null;
    let observer: IntersectionObserver | null = null;

    const setup = () => {
      if (!observer) {
        observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                observer?.unobserve(entry.target);
              }
            });
          },
          { threshold: 0.16, rootMargin: "0px 0px -8% 0px" },
        );
        observers.push(observer);
      }

      const elements = Array.from(document.querySelectorAll<HTMLElement>(SECTION_REVEAL_SELECTOR))
        .filter((element) => {
          if (element.closest("[data-no-scroll-reveal]")) return false;
          if (element.classList.contains("scroll-reveal")) return false;
          if (element.offsetHeight < 16) return false;
          return true;
        });

      elements.forEach((element, index) => {
        const variant = "reveal-right";
        element.classList.add("scroll-reveal", variant);
        element.style.setProperty("--reveal-delay", "0ms");
      });

      document.querySelectorAll<HTMLElement>(".scroll-reveal:not(.is-visible)").forEach((element) => {
        observer?.observe(element);
      });
    };

    timers.push(window.setTimeout(setup, 80));
    timers.push(window.setTimeout(setup, 400));

    mutationObserver = new MutationObserver(() => {
      timers.push(window.setTimeout(setup, 120));
    });
    mutationObserver.observe(document.querySelector("main") ?? document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
      observers.forEach((observer) => observer.disconnect());
      mutationObserver?.disconnect();
    };
  }, [pathname]);

  return null;
};

export default ScrollReveal;
