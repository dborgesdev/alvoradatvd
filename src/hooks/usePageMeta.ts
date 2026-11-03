import { useEffect } from "react";
import routePolicy from "../data/content/route-policy.json";
import socialImage from "../data/content/social-image.json";
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
      Boolean(origin) &&
      routePolicy.indexable.includes(window.location.pathname);
    setMeta("description", description);
    setMeta("og:title", document.title, true);
    setMeta("og:description", description, true);
    setMeta("og:type", "website", true);
    setMeta(
      "og:image",
      new URL(socialImage.path, origin || socialImage.previewOrigin).href,
      true,
    );
    setMeta("og:image:width", String(socialImage.width), true);
    setMeta("og:image:height", String(socialImage.height), true);
    setMeta("og:image:type", socialImage.mimeType, true);
    setMeta("twitter:card", "summary_large_image");
    setMeta(
      "twitter:image",
      new URL(socialImage.path, origin || socialImage.previewOrigin).href,
    );
    setMeta("twitter:title", document.title);
    setMeta("twitter:description", description);
    setMeta("robots", indexable ? "index,follow" : "noindex,nofollow");
    document.head.querySelector('link[rel="canonical"]')?.remove();
    {
      const canonical = document.createElement("link");
      canonical.rel = "canonical";
      canonical.href = new URL(
        window.location.pathname,
        origin || window.location.origin,
      ).href;
      document.head.appendChild(canonical);
      setMeta("og:url", canonical.href, true);
    }
  }, [title, description]);
}
