import { useEffect, useState } from "react";
import Icon from "../icons/Icon.jsx";
import Logomark from "../icons/Logomark.jsx";

export default function Navbar({ cartCount, go, view, onOpenCart }) {
  const [scrolled, setScrolled] = useState(false);

  // Mirrors the Appetizer template's scroll transition: the nav picks up a
  // shadow once the page has scrolled past the top.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <div className="topbar">
        <div className="wrap topbar-inner">
          <span>Mon – Sun, 8:00 AM – 9:00 PM</span>
          <span className="desktop-only" style={{ display: "inline" }}>Fresh food, simple ordering <span className="dot">·</span> Gyalpozhing College of IT</span>
        </div>
      </div>
      <header className={`navbar ${scrolled ? "scrolled" : ""}`}>
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
    </>
  );
}
