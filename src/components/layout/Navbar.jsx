import Icon from "../icons/Icon.jsx";
import Logomark from "../icons/Logomark.jsx";

export default function Navbar({ cartCount, go, view, onOpenCart }) {
  return (
    <header className="navbar">
      <div className="wrap navbar-inner">
        <a className="brand" onClick={() => go("landing")} style={{ cursor: "pointer" }}>
          <Logomark /> QuickBite
        </a>
        <nav className="nav-links desktop-only">
          <a className={`nav-link ${view === "menu" ? "active" : ""}`} onClick={() => go("canteens")}>Menu</a>
          <a className={`nav-link ${view === "tracking" ? "active" : ""}`} onClick={() => go("tracking")}>My Order</a>
          <a className="nav-link" onClick={() => go("landing", { scrollTo: "why" })}>About</a>
        </nav>
        <div className="nav-right">
          <button className="cart-pill" onClick={onOpenCart} aria-label="View cart">
            <Icon name="cart" size={18} />
            <span className="desktop-only" style={{ display: "inline" }}>Cart</span>
            <span className="count">{cartCount}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
