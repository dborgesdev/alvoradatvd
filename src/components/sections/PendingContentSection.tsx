import { Link } from "react-router-dom";
import { Users, ArrowUpRight } from "lucide-react";
export function PendingContentSection({ kind }: { kind: "team" }) {
  void kind;
  return (
    <section className="section container">
      <div className="pending-content">
        <Users size={48} />
        <p className="eyebrow">ESPAÇO EM PREPARAÇÃO</p>
        <h2>As pessoas por trás da conexão.</h2>
        <p>
          Os nomes, as funções e as fotos da equipe serão apresentados após
          confirmação da emissora.
        </p>
        <Link className="button blue" to="/contato">
          Converse com a Alvorada <ArrowUpRight size={18} />
        </Link>
      </div>
    </section>
  );
}
