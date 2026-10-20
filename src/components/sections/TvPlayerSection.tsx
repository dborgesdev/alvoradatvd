import { content } from "../../lib/content";
import { TvPlayer } from "../ui/TvPlayer";
export function TvPlayerSection() {
  return (
    <section className="section container player-layout">
      <TvPlayer />{" "}
      <aside className="player-info">
        <p className="eyebrow">TV DIGITAL</p>
        <h2>
          Em todas
          <br />
          as suas telas.
        </h2>
        <p>
          Acompanhe com os controles do player. O áudio começa apenas quando
          você inicia a reprodução.
        </p>
        <p className="section-note">
          A disponibilidade depende do serviço de transmissão da Taaqui. Se o
          sinal não carregar, entre em contato com a emissora.
        </p>
        <a
          className="text-link"
          href={content.site.social.youtube}
          target="_blank"
          rel="noopener noreferrer"
        >
          Acessar canal oficial ↗
        </a>
      </aside>
    </section>
  );
}
