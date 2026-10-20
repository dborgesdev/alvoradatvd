import { useState } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { Menu, X, Radio, ArrowUpRight } from "lucide-react";
import { navigation } from "../../data/content/editorial";
import { Brand } from "./Brand";
export function Header() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  return (
    <header className="site-header">
      <div className="utility">
        <div className="container">
          <span>
            HORTOLÂNDIA, SP <span className="utility-divider">/</span> CONECTADA
            COM VOCÊ
          </span>
          <span>Rádio · TV · Jornal digital</span>
        </div>
      </div>
      <div className="container header-main">
        <Brand />
        <nav className="desktop-nav" aria-label="Navegação principal">
          {navigation.map(([url, label]) => (
            <NavLink end={url === "/"} key={url} to={url}>
              {label}
            </NavLink>
          ))}
        </nav>
        <Link className="button live-button" to="/tv">
          <Radio size={17} /> AO VIVO <ArrowUpRight size={16} />
        </Link>
        <button
          className="menu-toggle"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
          aria-controls="mobile-navigation"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <nav
          key={location.pathname}
          id="mobile-navigation"
          className="mobile-nav"
          aria-label="Navegação móvel"
        >
          {[
            ...navigation,
            ["/equipe", "Equipe"],
            ["/promocoes", "Promoções"],
          ].map(([url, label]) => (
            <NavLink onClick={() => setOpen(false)} key={url} to={url}>
              {label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  );
}
