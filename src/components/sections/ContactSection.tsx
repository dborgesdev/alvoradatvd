import { MessageCircle, Mail, MapPin, ArrowUpRight } from "lucide-react";
import { content, whatsappUrl } from "../../lib/content";
export function ContactSection() {
  const { site } = content;
  return (
    <section className="section container">
      <div className="contact-grid">
        {[
          {
            title: "Jornalismo",
            subtitle: "A sua história tem espaço aqui.",
            description:
              "Envie sugestões de pauta e informações da comunidade.",
            phone: site.phoneJournalism,
            label: "(19) 97129-5550",
          },
          {
            title: "Administração & comercial",
            subtitle: "Vamos construir conexões.",
            description:
              "Fale sobre parcerias, publicidade e assuntos administrativos.",
            phone: site.phoneAdministration,
            label: "(19) 99687-9753",
          },
        ].map((item) => (
          <article className="contact-card" key={item.phone}>
            <MessageCircle size={30} />
            <p className="eyebrow">{item.title}</p>
            <h2>{item.subtitle}</h2>
            <p>{item.description}</p>
            <a
              href={whatsappUrl(item.phone)}
              className="button blue"
              target="_blank"
              rel="noopener noreferrer"
            >
              {item.label}
              <ArrowUpRight size={18} />
            </a>
          </article>
        ))}
      </div>
      <div className="contact-details">
        <div>
          <Mail />
          <h3>Prefere escrever?</h3>
          <a href={`mailto:${site.email}`}>{site.email}</a>
        </div>
        <div>
          <MapPin />
          <h3>{site.location}</h3>
          <p>Endereço e rota GPS aguardam confirmação da emissora.</p>
        </div>
        <div>
          <h3>Acompanhe nas redes</h3>
          {Object.entries(site.social).map(([name, url]) => (
            <a key={name} href={url} target="_blank" rel="noopener noreferrer">
              {name} ↗
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
