import { Link } from "@tanstack/react-router";
import "./Header.css";

const NAV: ReadonlyArray<{
  to: "/" | "/review" | "/library" | "/stats" | "/settings";
  label: string;
}> = [
  { to: "/", label: "Home" },
  { to: "/review", label: "Review" },
  { to: "/library", label: "Library" },
  { to: "/stats", label: "Stats" },
  { to: "/settings", label: "Settings" },
];

export function Header() {
  return (
    <header className="kio-header">
      <Link to="/" className="kio-brand">
        <span className="serif">記</span>
        <span className="meta kio-brand-name">Hibi · Kioku</span>
      </Link>
      <nav className="kio-nav" aria-label="Main">
        {NAV.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="kio-nav-link"
            activeProps={{ className: "kio-nav-link is-active" }}
            activeOptions={{ exact: item.to === "/" }}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
