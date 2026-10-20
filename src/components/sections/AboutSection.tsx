import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { content } from "../../lib/content";
export function AboutSection() {
  return (
    <section className="about-section section">
      <div className="container about-grid">
        <div>
          <p className="eyebrow">MUITO ALÉM DO SINAL</p>
          <h2>
            De perto.
            <br />
            De todos.
            <br />
            <span>Da nossa região.</span>
          </h2>
        </div>
        <div>
          <p className="large-copy">{content.institutional.about}</p>
          <p>
            Informação, cultura e utilidade pública em uma linguagem que
            aproxima. Conheça os princípios que orientam a Rede Alvorada.
          </p>
          <Link className="text-link" to="/institucional">
            Conheça a nossa essência <ArrowUpRight size={19} />
          </Link>
        </div>
      </div>
    </section>
  );
}
