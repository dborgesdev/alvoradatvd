import { Play, ArrowUpRight } from "lucide-react";
import { content } from "../../lib/content";
import { programsResource } from "../../lib/content/resources";
import { useService } from "../../hooks/useService";
import { SectionHeading } from "../ui/SectionHeading";
import { EditorialState } from "../ui/EditorialState";
import { EditorialImage } from "../ui/EditorialImage";
import "./programs.css";
export function ProgramsSection({ full = false }: { full?: boolean }) {
  const state = useService(programsResource);
  const programs = state.result?.data || [];
  return (
    <section className={`section container programs-section ${full ? "programs-full" : ""}`}>
      <SectionHeading eyebrow="PLAY NA CONEXÃO" title="A Alvorada no seu tempo." to={full ? undefined : "/programas"} linkLabel="Programas e vídeos" />
      <EditorialState {...state} emptyMessage="Nenhum programa publicado no momento." />
      <div className="program-grid">
        <div className="program-list">
          {(full ? programs : programs.slice(0, 2)).map(program => (
            <article className="program-feature" key={program.id}>
              {program.image && <EditorialImage image={program.image} sizes="(max-width: 650px) 100vw, 55vw" />}
              <div className="program-overlay">
                {program.category && <span className="eyebrow">{program.category}</span>}
                <h3>{program.title}</h3>
                {program.subtitle && <p className="program-subtitle">{program.subtitle}</p>}
                {program.description && <p className="program-description">{program.description}</p>}
                {program.presenters.length > 0 && <p className="program-presenters">Apresentação: {program.presenters.map(person => person.name).join(", ")}</p>}
                {full && program.youtubeVideoId && <iframe loading="lazy" title={`Vídeo de ${program.title}`} src={`https://www.youtube-nocookie.com/embed/${program.youtubeVideoId}`} referrerPolicy="strict-origin-when-cross-origin" allow="encrypted-media; picture-in-picture; fullscreen" allowFullScreen />}
                {full && program.youtubePlaylistId && <iframe loading="lazy" title={`Playlist de ${program.title}`} src={`https://www.youtube-nocookie.com/embed/videoseries?list=${program.youtubePlaylistId}`} referrerPolicy="strict-origin-when-cross-origin" allow="encrypted-media; picture-in-picture; fullscreen" allowFullScreen />}
                {(program.videoUrl || program.playlistUrl) && <div className="program-links">
                  {program.videoUrl && <a href={program.videoUrl} target="_blank" rel="noopener noreferrer">Assistir ao vídeo <ArrowUpRight size={16} /></a>}
                  {program.playlistUrl && <a href={program.playlistUrl} target="_blank" rel="noopener noreferrer">Acessar playlist <ArrowUpRight size={16} /></a>}
                </div>}
              </div>
            </article>
          ))}
        </div>
        <aside className="youtube-panel">
          <Play size={40} />
          <p className="eyebrow">CANAL OFICIAL</p>
          <h3>Boas conversas. <br />Novas perspectivas. <br />Aperte o play.</h3>
          <p>Acompanhe os conteúdos publicados pela emissora no YouTube.</p>
          <a className="button blue" href={content.site.social.youtube} target="_blank" rel="noopener noreferrer">Acessar canal <ArrowUpRight size={18} /></a>
        </aside>
      </div>
    </section>
  );
}
