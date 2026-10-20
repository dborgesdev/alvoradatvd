import { Play, ArrowUpRight } from "lucide-react";
import { content } from "../../lib/content";
import { SectionHeading } from "../ui/SectionHeading";
import "./programs.css";
export function ProgramsSection({ full = false }: { full?: boolean }) {
  return (
    <section
      className={`section container programs-section ${full ? "programs-full" : ""}`}
    >
      <SectionHeading
        eyebrow="PLAY NA CONEXÃO"
        title="A Alvorada no seu tempo."
        to={full ? undefined : "/programas"}
        linkLabel="Programas e vídeos"
      />
      <div className="program-grid grid gap-6 lg:grid-cols-[1.7fr_1fr]">
        {content.getPrograms().map((program) => (
          <article className="program-feature" key={program.id}>
            <img
              src={program.thumbnail}
              alt="Conceito visual de produção de programas"
              loading="lazy"
            />
            <div className="program-overlay">
              <span className="demo-badge">Conteúdo demonstrativo</span>
              <h3>{program.title}</h3>
              <p>{program.description}</p>
              {program.youtubeVideoId && (
                <iframe
                  loading="lazy"
                  title={program.title}
                  src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(program.youtubeVideoId)}`}
                  allowFullScreen
                />
              )}
              <span className="image-caption">Imagem conceitual</span>
            </div>
          </article>
        ))}
        <aside className="youtube-panel">
          <Play size={40} />
          <p className="eyebrow">CANAL OFICIAL</p>
          <h3>
            Boas conversas. <br />
            Novas perspectivas. <br />
            Aperte o play.
          </h3>
          <p>Acompanhe os conteúdos publicados pela emissora no YouTube.</p>
          <a
            className="button blue"
            href={content.site.social.youtube}
            target="_blank"
            rel="noopener noreferrer"
          >
            Acessar canal <ArrowUpRight size={18} />
          </a>
          {full && (
            <p className="section-note">
              A grade, os horários e os vídeos individuais serão exibidos após
              confirmação da emissora.
            </p>
          )}
        </aside>
      </div>
    </section>
  );
}
