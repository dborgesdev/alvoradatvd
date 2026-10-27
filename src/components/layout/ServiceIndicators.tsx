import { Cloud, CloudLightning, CloudRain, Sun } from "lucide-react";
import { useService } from "../../hooks/useService";
import { ratesResource, weatherResource } from "../../lib/services/client";
import { formatDate, weatherLabel } from "../../lib/services/format";
export function ServiceIndicators() {
  const rates = useService(ratesResource).result;
  const weather = useService(weatherResource).result;
  const current = weather?.data;
  const condition = current ? weatherLabel(current.code) : null;
  const WeatherIcon = condition
    ? { sun: Sun, cloud: Cloud, rain: CloudRain, storm: CloudLightning }[
        condition.icon
      ]
    : Cloud;
  return (
    <>
      {current && condition && (
        <a
          className="utility-weather"
          href="https://open-meteo.com/"
          target="_blank"
          rel="noopener noreferrer"
          title={`Hortolândia, SP · referência regional de Campinas, SP (coordenadas fixas). ${condition.label}. Open-Meteo, ${formatDate(current.referenceAt)}${weather.stale ? " · última leitura disponível" : ""}`}
        >
          <WeatherIcon size={15} />
          <span className="utility-weather-copy">
            <span>Hortolândia, SP</span>
            <span className="weather-condition">{condition.label}</span>
          </span>
          <strong>{Math.round(current.temperature)} °C</strong>
          {weather.stale && <span>· anterior</span>}
        </a>
      )}
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
