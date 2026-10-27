import { useService } from "../../hooks/useService";
import { ratesResource } from "../../lib/services/client";
import { formatDate } from "../../lib/services/format";
export function ServiceIndicators() {
  const rates = useService(ratesResource).result;
  return (
    <>
      {rates?.data && (
        <a
          className="utility-rates"
          href="https://www.bcb.gov.br/estabilidadefinanceira/historicocotacoes"
          target="_blank"
          rel="noopener noreferrer"
          title={`PTAX venda — fechamento, não é cotação em tempo real. ${rates.data.quotes.map((quote) => `${quote.currency}: ${formatDate(quote.referenceAt)} (Brasília)`).join("; ")}.${rates.stale ? " Última resposta válida." : ""}`}
        >
          {rates.data.quotes.map((quote) => (
            <span key={quote.currency}>
              <strong>
                {quote.currency} · R${" "}
                {quote.sell.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </strong>
            </span>
          ))}
          {rates.stale && <span>· anterior</span>}
        </a>
      )}
    </>
  );
}
