import { Link } from "react-router-dom";
import { content } from "../../lib/content";
import { DocumentSections } from "../ui/DocumentSections";
export function InstitutionalSection() {
  const sections = content.getInstitutionalSections();
  return (
    <section className="section container institutional-grid">
      <aside className="institutional-nav">
        <p className="eyebrow">NOSSA ESSÊNCIA</p>
        {sections.map((section) => (
          <a href={`#${section.id}`} key={section.id}>
            {section.title} ↗
          </a>
        ))}
        <Link to="/historia-do-radio">História do Rádio ↗</Link>
      </aside>
      <div>
        <p className="document-source">
          Transcrição integral do material institucional fornecido pela
          emissora. Contatos atualizados e localização confirmada devem ser
          consultados na <Link to="/contato">página de contato</Link>.
        </p>
        <DocumentSections sections={sections} />
      </div>
    </section>
  );
}
