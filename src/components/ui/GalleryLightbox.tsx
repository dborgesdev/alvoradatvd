import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { GalleryAlbum } from "../../types/collections";
import "./gallery-lightbox.css";
export function GalleryLightbox({
  album,
  onClose,
}: {
  album: GalleryAlbum;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState(0);
  const photo = album.photos[index];
  const previous = () =>
    setIndex(
      (current) => (current - 1 + album.photos.length) % album.photos.length,
    );
  const next = () => setIndex((current) => (current + 1) % album.photos.length);
  useEffect(() => {
    const dialog = ref.current;
    const opener =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const overflow = document.body.style.overflow;
    dialog?.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      dialog?.close();
      document.body.style.overflow = overflow;
      opener?.focus({ preventScroll: true });
    };
  }, []);
  if (!photo) return null;
  return (
    <dialog
      ref={ref}
      className="gallery-lightbox"
      aria-labelledby="lightbox-title"
      aria-describedby="lightbox-caption"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      onKeyDown={(event) => {
        if (event.key === "Tab") {
          const buttons = event.currentTarget.querySelectorAll<HTMLElement>(
            "button:not(:disabled), a[href]",
          );
          const first = buttons[0];
          const last = buttons[buttons.length - 1];
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last?.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first?.focus();
          }
        }
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          previous();
        }
        if (event.key === "ArrowRight") {
          event.preventDefault();
          next();
        }
      }}
    >
      <div className="lightbox-inner">
        <header>
          <div>
            <p className="eyebrow">ÁLBUM DEMONSTRATIVO</p>
            <h2 id="lightbox-title">{album.title}</h2>
          </div>
          <button
            autoFocus
            type="button"
            aria-label="Fechar galeria ampliada"
            onClick={onClose}
          >
            <X />
          </button>
        </header>
        <figure>
          <img
            key={photo.id}
            src={photo.src}
            alt={photo.alt}
            width="1200"
            height="800"
          />
          <figcaption id="lightbox-caption">
            {photo.caption}
            {photo.sourceUrl && (
              <>
                {" "}
                <a
                  href={photo.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Fonte e licença ↗
                </a>
              </>
            )}
          </figcaption>
        </figure>
        <footer>
          <button
            type="button"
            aria-label="Fotografia anterior"
            disabled={album.photos.length < 2}
            onClick={previous}
          >
            <ChevronLeft />
            Anterior
          </button>
          <span role="status" aria-live="polite">
            {index + 1} de {album.photos.length}
          </span>
          <button
            type="button"
            aria-label="Próxima fotografia"
            disabled={album.photos.length < 2}
            onClick={next}
          >
            Próxima
            <ChevronRight />
          </button>
        </footer>
      </div>
    </dialog>
  );
}
