import { useState } from "react";
import { ArrowUpRight, Images } from "lucide-react";
import { albumsResource } from "../../lib/content/resources";
import { useService } from "../../hooks/useService";
import { EditorialState } from "../ui/EditorialState";
import { EditorialImage } from "../ui/EditorialImage";
import type { GalleryAlbum } from "../../types/collections";
import { GalleryLightbox } from "../ui/GalleryLightbox";
import "./gallery.css";
export function GallerySection() {
  const [selected, setSelected] = useState<GalleryAlbum | null>(null);
  const state = useService(albumsResource);
  const albums = state.result?.data || [];
  return (
    <section className="section container gallery-section">
      <div className="gallery-intro">
        <div>
          <p className="eyebrow">UM OLHAR, MUITAS POSSIBILIDADES</p>
          <h2>Histórias também se contam em imagens.</h2>
        </div>
        <p>
          Explore os álbuns publicados pela Rede Alvorada e veja cada história pelos seus registros.
        </p>
      </div>
      <EditorialState {...state} emptyMessage="Nenhum álbum publicado no momento." />
      <div className="gallery-grid">
        {albums.map((album) => (
          <article className="album-card" key={album.id}>
            <button
              type="button"
              aria-label={`Abrir álbum ${album.title}`}
              disabled={!album.photos.length}
              onClick={() => setSelected(album)}
            >
              <div className="album-cover">
                {album.coverImage && <EditorialImage image={album.coverImage} />}
                {album.category && <span className="album-demo">{album.category}</span>}
                {album.photos.length > 0 && <span className="album-open">
                  <ArrowUpRight aria-hidden="true" />
                </span>}
              </div>
              <div className="album-copy">
                {album.category && <p className="eyebrow">{album.category}</p>}
                <h3>{album.title}</h3>
                {album.description && <p>{album.description}</p>}
                {(album.date || album.location) && <p className="album-details">
                  {album.date && <time dateTime={album.date}>{new Intl.DateTimeFormat("pt-BR", { timeZone: "America/Sao_Paulo" }).format(new Date(`${album.date}T12:00:00Z`))}</time>}
                  {album.date && album.location ? " · " : ""}{album.location}
                </p>}
                <span className="album-count">
                  <Images size={17} aria-hidden="true" />
                  {album.photos.length} {album.photos.length === 1 ? "fotografia" : "fotografias"}{album.photos.length ? " · Explorar álbum" : " · Sem fotografias"}
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
