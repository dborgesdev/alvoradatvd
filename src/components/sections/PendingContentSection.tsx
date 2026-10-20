import { Link } from "react-router-dom";
import { Users, Gift, ArrowUpRight } from "lucide-react";
export function PendingContentSection({
  kind,
}: {
  kind: "team" | "promotions";
}) {
  const isTeam = kind === "team";
  return (
    <section className="section container">
      <div className="pending-content">
        {isTeam ? <Users size={48} /> : <Gift size={48} />}
        <p className="eyebrow">ESPAÇO EM PREPARAÇÃO</p>
        <h2>
          {isTeam
            ? "As pessoas por trás da conexão."
            : "Novos encontros vêm por aí."}
        </h2>
        <p>
          {isTeam
            ? "Os nomes, as funções e as fotos da equipe serão apresentados após confirmação da emissora."
            : "Ainda não há promoções confirmadas. Quando houver ações oficiais, os detalhes e regulamentos estarão aqui."}
        </p>
        <Link className="button blue" to="/contato">
          Converse com a Alvorada <ArrowUpRight size={18} />
        </Link>
      </div>
    </section>
  );
}
