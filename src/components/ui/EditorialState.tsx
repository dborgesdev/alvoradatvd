import type { ServiceResult } from "../../types/services";
import "./editorial-state.css";

export function EditorialState({ loading, result, emptyMessage }: {
  loading: boolean; result: ServiceResult<unknown[]> | null; emptyMessage: string;
}) {
  if (loading) return <div className="editorial-state" role="status" aria-live="polite">Carregando conteúdo…</div>;
  if (!result?.data) return <div className="editorial-state" role="alert"><strong>Não foi possível carregar o conteúdo.</strong><p>A comunicação está temporariamente indisponível. Tentaremos novamente em instantes.</p></div>;
  if (result.stale) return <p className="editorial-state" role="status">Atualização temporariamente indisponível. Exibindo a última versão recebida.</p>;
  if (!result.data.length) return <p className="editorial-state" role="status">{emptyMessage}</p>;
  return null;
}
