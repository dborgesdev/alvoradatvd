import { useState } from "react";
import { ArrowUpRight, Images } from "lucide-react";
import { collections } from "../../lib/content/collections";
import type { GalleryAlbum } from "../../types/collections";
import { GalleryLightbox } from "../ui/GalleryLightbox";
import "./gallery.css";
export function GallerySection() {
  const [selected, setSelected] = useState<GalleryAlbum | null>(null);
  const albums = collections.getAlbums();
  return (
    <section className="section container gallery-section">
      <div className="gallery-intro">
        <div>
          <p className="eyebrow">UM OLHAR, MUITAS POSSIBILIDADES</p>
          <h2>Histórias também se contam em imagens.</h2>
        </div>
        <p>
          Esta é uma galeria de exemplos visuais. As imagens incluem estudos
          conceituais e uma fotografia histórica de uso livre. Não retratam a
          equipe, instalações ou eventos da emissora. Os álbuns oficiais serão
          adicionados após confirmação e autorização.
        </p>
      </div>
      <div className="gallery-grid">
        {albums.map((album) => (
          <article className="album-card" key={album.id}>
            <button
              type="button"
              aria-label={`Abrir álbum ${album.title}`}
              onClick={() => setSelected(album)}
            >
              <div className="album-cover">
                <img
                  src={album.cover}
                  alt=""
                  loading="lazy"
                  width="800"
                  height="600"
                />
                <span className="album-demo">
                  {album.isDemo ? "Álbum demonstrativo" : album.category}
                </span>
                <span className="album-open">
                  <ArrowUpRight aria-hidden="true" />
                </span>
              </div>
              <div className="album-copy">
                <p className="eyebrow">{album.category}</p>
                <h3>{album.title}</h3>
                <p>{album.description}</p>
                <span className="album-count">
                  <Images size={17} aria-hidden="true" />
                  {album.photos.length} {album.photos.length === 1 ? "imagem" : "imagens"} · Explorar álbum
                </span>
              </div>
            </button>
          </article>
        ))}
      </div>
      {selected && (
        <GalleryLightbox
          key={selected.id}
          album={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </section>
  );
}
