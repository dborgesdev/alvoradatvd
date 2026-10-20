import { useEffect } from "react";
export function usePageMeta(title: string, description: string) {
  useEffect(() => {
    document.title = `${title} | Rede Alvorada`;
    const setMeta = (key: string, value: string, property = false) => {
      let element = document.head.querySelector<HTMLMetaElement>(
        `meta[${property ? "property" : "name"}="${key}"]`,
      );
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(property ? "property" : "name", key);
        document.head.appendChild(element);
      }
      element.content = value;
    };
    const origin = import.meta.env.VITE_PUBLIC_SITE_URL;
    const indexable =
      origin &&
      ["/", "/tv", "/institucional", "/historia-do-radio", "/contato"].includes(
        window.location.pathname,
      );
    setMeta("description", description);
    setMeta("og:title", document.title, true);
    setMeta("og:description", description, true);
    setMeta("og:type", "website", true);
    setMeta("robots", indexable ? "index,follow" : "noindex,nofollow");
    document.head.querySelector('link[rel="canonical"]')?.remove();
    if (origin) {
      const canonical = document.createElement("link");
      canonical.rel = "canonical";
      canonical.href = new URL(window.location.pathname, origin).href;
      document.head.appendChild(canonical);
      setMeta("og:url", canonical.href, true);
    }
  }, [title, description]);
}
