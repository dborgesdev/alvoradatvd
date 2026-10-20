import { Link } from "react-router-dom";
import { ArrowUpRight, MessageCircle, Play, Camera, Users } from "lucide-react";
import { content, whatsappUrl } from "../../lib/content";
import { Brand } from "./Brand";
export function Footer() {
  const { site } = content;
  return (
    <>
      <footer className="site-footer">
        <div className="container footer-top">
          <Brand lazy />
          <div className="footer-message">
            <h2>
              Uma rede.
              <br />
              Muitas conexões.
            </h2>
            <p>{site.tagline}</p>
          </div>
          <div>
            <p className="eyebrow">ACOMPANHE A ALVORADA</p>
            <div className="social-links">
              {[
                { url: site.social.youtube, Icon: Play, label: "YouTube" },
                { url: site.social.instagram, Icon: Camera, label: "Instagram" },
                { url: site.social.facebook, Icon: Users, label: "Facebook" },
              ].map(({url, Icon, label}) => {
                return (
                  <a
                    key={url}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                  >
                    <Icon size={21} />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
        <div className="container footer-nav">
          {[
            ["/institucional", "Institucional"],
            ["/historia-do-radio", "História do Rádio"],
            ["/equipe", "Equipe"],
            ["/promocoes", "Promoções"],
            ["/contato", "Contato"],
          ].map(([url, label]) => (
            <Link key={url} to={url}>
              {label}
            </Link>
          ))}
          <span>Prévia V1 · Conteúdo editorial demonstrativo</span>
        </div>
        <div className="container footer-bottom">
          <span>
            © {new Date().getFullYear()} Rede Alvorada de Rádio e Televisão
            Digital
          </span>
          <a
            href="https://smartlocal.com.br"
            target="_blank"
            rel="noopener noreferrer"
          >
            Desenvolvido por Douglas Borges - Smart Local{" "}
            <ArrowUpRight size={13} />
          </a>
        </div>
      </footer>
      <a
        className="whatsapp"
        href={whatsappUrl(site.phoneAdministration)}
        aria-label="Falar com a administração pelo WhatsApp"
        target="_blank"
        rel="noopener noreferrer"
      >
        <MessageCircle size={25} />
      </a>
    </>
  );
}
