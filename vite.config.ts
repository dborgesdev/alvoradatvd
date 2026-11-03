import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import socialImage from "./src/data/content/social-image.json" with { type: "json" };
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".", "VITE_");
  const imageUrl = new URL(
    socialImage.path,
    env.VITE_PUBLIC_SITE_URL || socialImage.previewOrigin,
  ).href;
  const metadata = {
    "og:type": "website",
    "og:image": imageUrl,
    "og:image:width": String(socialImage.width),
    "og:image:height": String(socialImage.height),
    "og:image:type": socialImage.mimeType,
    "twitter:card": "summary_large_image",
    "twitter:image": imageUrl,
  };
  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: "social-image-html",
        transformIndexHtml() {
          return Object.entries(metadata).map(([key, content]) => ({
            tag: "meta",
            attrs: {
              [key.startsWith("og:") ? "property" : "name"]: key,
              content,
            },
            injectTo: "head" as const,
          }));
        },
      },
    ],
    build: { chunkSizeWarningLimit: 650 },
    server: { proxy: { "/api": "http://127.0.0.1:8787" } },
  };
});
