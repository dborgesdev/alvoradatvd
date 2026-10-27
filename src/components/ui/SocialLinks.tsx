import { content } from "../../lib/content";
export function SocialLinks() {
  return (
    <div className="utility-social" aria-label="Redes sociais">
      <a
        href={content.site.social.instagram}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Instagram da Rede Alvorada"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          aria-hidden="true"
        >
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r=".7" fill="currentColor" />
        </svg>
      </a>
      <a
        href={content.site.social.facebook}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Facebook da Rede Alvorada"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M14 22v-9h3l.5-4H14V7c0-1.2.5-2 2-2h2V1.5C17 1.2 16 1 15 1c-3.3 0-5 2-5 5v3H7v4h3v9z" />
        </svg>
      </a>
      <a
        href={content.site.social.youtube}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="YouTube da Rede Alvorada"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <rect x="1" y="4" width="22" height="16" rx="5" />
          <path d="m10 8 6 4-6 4z" fill="var(--navy)" />
        </svg>
      </a>
    </div>
  );
}
