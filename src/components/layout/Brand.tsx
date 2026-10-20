import { Link } from "react-router-dom";

export function Brand({ lazy = false }: { lazy?: boolean }) {
  return (
    <Link to="/" aria-label="Rede Alvorada, início" className="brand">
      <img
        src="/assets/brand/logo-alvorada.png"
        alt=""
        loading={lazy ? "lazy" : "eager"}
      />
      <span className="wordmark">
        <small>REDE</small>
        <strong>ALVORADA</strong>
        <small>RÁDIO E TELEVISÃO DIGITAL</small>
      </span>
    </Link>
  );
}
