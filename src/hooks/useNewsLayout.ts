import { useLayoutEffect, useRef, useState } from "react";

export type NewsLayout = "wide" | "grid" | "compact";
// 640px comportam dois cards de 308px; 1120px permitem a coluna editorial lateral.
export function newsLayoutForWidth(width: number): NewsLayout {
  return width >= 1120 ? "wide" : width >= 640 ? "grid" : "compact";
}
export function useNewsLayout() {
  const ref = useRef<HTMLDivElement>(null);
  const [layout, setLayout] = useState<NewsLayout>("compact");
  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    const update = (width: number) => setLayout(newsLayoutForWidth(width));
    update(element.getBoundingClientRect().width);
    const observer = new ResizeObserver(([entry]) =>
      update(entry.contentRect.width),
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return { ref, layout };
}
