import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import "./about.css";
export function ContactCtaSection() {
  return (
    <section className="contact-cta">
      <div className="container">
        <img
          className="cta-brand-art"
          src="/assets/brand/logo-3d-hero.webp"
          alt=""
          loading="lazy"
          width="640"
          height="640"
        />
        <div>
          <p className="eyebrow">VAMOS CONVERSAR?</p>
          <h2>
            A próxima conexão
            <br />
            começa com você.
          </h2>
        </div>
        <Link to="/contato" className="button dark">
          Fale com a Alvorada <ArrowUpRight size={21} />
        </Link>
      </div>
    </section>
  );
}
