import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Clock3, Radio, Tv } from "lucide-react";
import { collections } from "../../lib/content/collections";
import { scheduleDays } from "../../data/content/schedule";
import "./schedule.css";
export function ScheduleSection() {
  const [day, setDay] = useState(0);
  const entries = collections
    .getSchedule()
    .filter((entry) => entry.dayOfWeek === day);
  return (
    <section className="section container schedule-section">
      <div className="demo-disclosure">
        <span className="eyebrow">GRADE DEMONSTRATIVA</span>
        <p>
          Programas e horários abaixo são exemplos de organização. A grade
          oficial está em confirmação; nenhuma faixa representa uma transmissão
          em andamento.
        </p>
      </div>
      <div
        className="schedule-tabs"
        role="tablist"
        aria-label="Dias da programação"
        onKeyDown={(event) => {
          const next =
            event.key === "ArrowRight"
              ? (day + 1) % 7
              : event.key === "ArrowLeft"
                ? (day + 6) % 7
                : event.key === "Home"
                  ? 0
                  : event.key === "End"
                    ? 6
                    : null;
          if (next !== null) {
            event.preventDefault();
            setDay(next);
            const tabs =
              event.currentTarget.querySelectorAll<HTMLButtonElement>(
                '[role="tab"]',
              );
            tabs[next]?.focus();
          }
        }}
      >
        {scheduleDays.map((label, index) => (
          <button
            key={label}
            role="tab"
            id={`day-${index}`}
            aria-controls="schedule-panel"
            aria-selected={day === index}
            tabIndex={day === index ? 0 : -1}
            onClick={() => setDay(index)}
          >
            <span className="day-full">{label}</span>
            <span className="day-short" aria-hidden="true">
              {label.slice(0, 3)}
            </span>
            <span className="sr-only day-accessible">{label}</span>
          </button>
        ))}
      </div>
      <div
        id="schedule-panel"
        role="tabpanel"
        aria-labelledby={`day-${day}`}
        tabIndex={0}
        className="schedule-panel"
      >
        <div className="schedule-heading">
          <h2>{scheduleDays[day]}</h2>
          <span>Horários ilustrativos · Brasília</span>
        </div>
        {entries.length ? (
          entries.map((entry) => (
            <article key={entry.id} className="schedule-entry">
              <div className="schedule-time">
                <Clock3 size={19} aria-hidden="true" />
                <strong>{entry.startsAt}</strong>
                <span>às {entry.endsAt}</span>
              </div>
              <div>
                <span className="eyebrow">
                  {entry.category}
                  {entry.isDemo ? " · exemplo" : ""}
                </span>
                <h3>{entry.title}</h3>
                <p>{entry.description}</p>
              </div>
              <span className="schedule-index" aria-hidden="true">
                {String(entry.order + 1).padStart(2, "0")}
              </span>
            </article>
          ))
        ) : (
          <p>Programação ainda não cadastrada para este dia.</p>
        )}
      </div>
      <aside className="schedule-watch">
        <div>
          <p className="eyebrow">A CONEXÃO CONTINUA</p>
          <h2>Escolha a sua tela. Ou dê o play.</h2>
          <p>
            Acesse os players da emissora. O rádio utiliza áudio demonstrativo
            enquanto o stream oficial está em confirmação.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link className="button blue" to="/tv">
            <Tv size={18} />
            Assistir à TV <ArrowUpRight size={16} />
          </Link>
          <Link className="button outline" to="/radio">
            <Radio size={18} />
            Ouvir a rádio
          </Link>
        </div>
      </aside>
    </section>
  );
}
