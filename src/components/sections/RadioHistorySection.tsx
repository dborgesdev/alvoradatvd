import { Radio, Waves } from "lucide-react";
import { content } from "../../lib/content";
import { DocumentSections } from "../ui/DocumentSections";
export function RadioHistorySection() {
  const image = content.radioArchiveImage;
  return (
    <section className="section container history-grid">
      <aside className="history-art">
        <div className="vintage-radio" aria-hidden="true">
          <div className="radio-speaker">
            <Waves size={70} />
          </div>
          <div className="radio-dial">
            <i />
            <i />
            <i />
            <i />
            <i />
            <i />
            <i />
          </div>
          <div className="radio-knobs">
            <span />
            <Radio size={26} />
            <span />
          </div>
        </div>
        <p>Da voz às conexões digitais.</p>
        <span>Ilustração gráfica · não é um registro histórico</span>
        <nav aria-label="Capítulos da história do rádio">
          {content.getRadioHistorySections().map((section) => (
            <a key={section.id} href={`#${section.id}`}>
              {section.title} ↗
            </a>
          ))}
        </nav>
      </aside>
      <div>
        <p className="document-source">
          Texto integral do material institucional fornecido pela Rede Alvorada.
          Datas e atribuições históricas são reproduzidas conforme a fonte.
        </p>
        <figure className="history-archive">
          <img src={image.src} alt={image.alt} loading="lazy" />
          <figcaption>
            {image.caption}
            <br />
            <a href={image.source} target="_blank" rel="noopener noreferrer">
              {image.credit}
            </a>
          </figcaption>
        </figure>
        <DocumentSections sections={content.getRadioHistorySections()} />
      </div>
    </section>
  );
}
