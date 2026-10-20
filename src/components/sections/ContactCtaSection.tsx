import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
export function ContactCtaSection() {
  return (
    <section className="contact-cta">
      <div className="container">
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
