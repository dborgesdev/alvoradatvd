import { useEffect } from "react";

export function useSectionReveal(pathname: string) {
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("has-entered");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.06 },
    );
    document
      .querySelectorAll(
        "main > section, main > article, .about-section, .contact-cta",
      )
      .forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [pathname]);
}
