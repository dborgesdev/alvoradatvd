import { Link } from "react-router-dom";
import { Radio, Tv, ArrowUpRight } from "lucide-react";
export function LiveAccessSection() {
  return (
    <section className="live-access">
      <div className="container live-grid">
        <Link to="/tv" className="live-item">
          <span className="media-icon">
            <Tv />
          </span>
          <div>
            <div className="mini-label">
              <span className="signal-dot" /> TRANSMISSÃO DIGITAL
            </div>
            <h2>Alvorada TV</h2>
            <p>A programação, na sua tela.</p>
          </div>
          <ArrowUpRight className="live-arrow" />
        </Link>
        <Link to="/radio" className="live-item">
          <span className="media-icon">
            <Radio />
          </span>
          <div>
            <div className="mini-label muted">STREAM EM CONFIRMAÇÃO</div>
            <h2>Rádio Alvorada</h2>
            <p>A sua companhia está por aqui.</p>
          </div>
          <ArrowUpRight className="live-arrow" />
        </Link>
      </div>
    </section>
  );
}
