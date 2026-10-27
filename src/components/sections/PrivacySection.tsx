import { Link } from "react-router-dom";
import { ShieldCheck, ArrowUpRight } from "lucide-react";
import { privacySections } from "../../data/content/privacy";
import "./privacy.css";
export function PrivacySection() {
  return (
    <section className="section container privacy-layout">
      <aside className="privacy-nav">
        <ShieldCheck size={28} aria-hidden="true" />
        <p className="eyebrow">TRANSPARÊNCIA</p>
        <nav aria-label="Nesta política">
          {privacySections.map((section) => (
            <a key={section.id} href={`#${section.id}`}>
              {section.title}
            </a>
          ))}
        </nav>
        <Link className="text-link" to="/contato">
          Canais de contato <ArrowUpRight size={16} />
        </Link>
      </aside>
      <div>
        <div className="privacy-draft">
          <strong>Minuta para validação</strong>
          <p>
            Documento baseado nos recursos atuais do portal. Identificação do
            controlador, canal de privacidade e demais campos indicados devem
            ser confirmados antes da publicação definitiva.
          </p>
        </div>
        {privacySections.map((section) => (
          <article className="privacy-article" id={section.id} key={section.id}>
            <h2>{section.title}</h2>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </article>
        ))}
        <p className="privacy-law">
          Referência:{" "}
          <a
            href="https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709compilado.htm"
            target="_blank"
            rel="noopener noreferrer"
          >
            Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018) ↗
          </a>
        </p>
      </div>
    </section>
  );
}
