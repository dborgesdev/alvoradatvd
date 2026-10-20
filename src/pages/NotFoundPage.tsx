import { Link } from "react-router-dom";
import { usePageMeta } from "../hooks/usePageMeta";
export default function NotFoundPage() {
  usePageMeta("Página não encontrada", "A página solicitada não foi encontrada no portal Rede Alvorada.");
  return (
    <section className="container empty-state">
      <p className="eyebrow">404 / FORA DE SINTONIA</p>
      <h1>Não encontramos esta página.</h1>
      <p>Continue sua conexão pelo início do portal.</p>
      <Link className="button blue" to="/">
        Voltar ao início
      </Link>
    </section>
  );
}
