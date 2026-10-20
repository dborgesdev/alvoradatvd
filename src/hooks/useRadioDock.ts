import { useEffect, useState } from "react";
export function useRadioDock(pathname: string) {
  const [position, setPosition] = useState<{
    slot: HTMLElement | null;
    floating: boolean;
    headerOffset: number;
  }>({ slot: null, floating: false, headerOffset: 0 });
  useEffect(() => {
    const slot = document.getElementById("radio-slot");
    const region = document.getElementById("broadcast-region");
    if (!slot || !region || pathname !== "/") return;
    const header = document.querySelector<HTMLElement>(".site-header");
    const getHeaderOffset = () =>
      header && ["fixed", "sticky"].includes(getComputedStyle(header).position)
        ? Math.max(0, header.getBoundingClientRect().bottom)
        : 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setPosition({
          slot,
          floating:
            !entry.isIntersecting && entry.boundingClientRect.bottom <= 0,
          headerOffset: getHeaderOffset(),
        });
      },
      { threshold: 0 },
    );
    // A região cruza a viewport mesmo quando uma rolagem salta toda a barra.
    observer.observe(region);
    const headerResize = new ResizeObserver(() =>
      setPosition((previous) => ({
        ...previous,
        headerOffset: getHeaderOffset(),
      })),
    );
    if (header) headerResize.observe(header);
    return () => {
      observer.disconnect();
      headerResize.disconnect();
    };
  }, [pathname]);
  return {
    slot: pathname === "/" ? position.slot : null,
    floating: pathname !== "/" || position.floating,
    headerOffset: position.headerOffset,
  };
}
