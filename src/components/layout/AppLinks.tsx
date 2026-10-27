import { Smartphone } from "lucide-react";
import { apps } from "../../data/content/services";

export function AppLinks() {
  if (!apps.android && !apps.ios) return null;
  return (
    <div className="utility-apps" aria-label="Aplicativos da Rede Alvorada">
      <span className="utility-app-caption utility-eyebrow">APLICATIVOS</span>
      {(
        [
          ["Android", apps.android],
          ["iOS", apps.ios],
        ] as const
      ).map(([label, url]) => {
        if (!url) return null;
        const contents = (
          <>
            {label === "Android" ? (
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="m6.2 6.5-1.7-3 .9-.5 1.7 3a10.7 10.7 0 0 1 9.8 0l1.7-3 .9.5-1.7 3A9.7 9.7 0 0 1 22 14H2a9.7 9.7 0 0 1 4.2-7.5ZM7.5 9a1 1 0 1 0 0 2 1 1 0 0 0 0-2Zm9 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2ZM3 16h18v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
              </svg>
            ) : (
              <Smartphone aria-hidden="true" />
            )}
            <span>{label}</span>
          </>
        );
        return (
          <a
            key={label}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Aplicativo ${label}`}
          >
            {contents}
          </a>
        );
      })}
    </div>
  );
}
