import { useRef, useState } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { Menu, X, Radio, ArrowUpRight } from "lucide-react";
import { navigation } from "../../data/content/editorial";
import { Brand } from "./Brand";
import { InstitutionalMenu } from "./InstitutionalMenu";
import { UtilityBar } from "./UtilityBar";
export function Header() {
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const location = useLocation();
  return (
    <header
      className="site-header"
      onKeyDown={(event) => {
        if (open && event.key === "Escape") {
          setOpen(false);
          menuButton.current?.focus();
        }
      }}
    >
      <UtilityBar />
      <div className="container header-main">
        <Brand />
        <nav className="desktop-nav" aria-label="Navegação principal">
          {navigation.map(([url, label]) =>
            url === "/institucional" ? (
              <InstitutionalMenu key={url} />
            ) : (
              <NavLink end={url === "/"} key={url} to={url}>
                {label}
              </NavLink>
            ),
          )}
        </nav>
        <Link className="button live-button" to="/tv">
          <Radio size={17} /> AO VIVO <ArrowUpRight size={16} />
        </Link>
        <button
          ref={menuButton}
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
          {navigation.map(([url, label]) =>
            url === "/institucional" ? (
              <InstitutionalMenu key={url} onNavigate={() => setOpen(false)} />
            ) : (
              <NavLink onClick={() => setOpen(false)} key={url} to={url}>
                {label}
              </NavLink>
            ),
          )}
        </nav>
      )}
    </header>
  );
}
