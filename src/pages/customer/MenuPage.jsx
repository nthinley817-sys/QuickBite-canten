import { useState, useMemo } from "react";
import Icon from "../../components/icons/Icon.jsx";
import SafeImg from "../../components/common/SafeImg.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";
import Skeleton from "../../components/common/Skeleton.jsx";
import { CATEGORIES } from "../../data/menu.js";
import { CANTEENS } from "../../data/canteens.js";
import { money } from "../../utils/format.js";

export default function MenuPage({ menuItems, canteenId, cart, addToCart, updateQty, go, openDetail, loading }) {
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("All");
  const canteen = CANTEENS.find((c) => c.id === canteenId) || CANTEENS[0];

  const filtered = useMemo(() => {
    return menuItems.filter((m) => {
      const matchesCat = cat === "All" || m.category === cat;
      const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [menuItems, cat, search]);

  return (
    <div>
      <div className="wrap" style={{ paddingTop: 32 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--text-secondary)", fontSize: 13.5, fontWeight: 600, marginBottom: 10 }}>
          <Icon name="map" size={14} /> {canteen.name} · {canteen.location}
          <button className="btn btn-ghost btn-sm" style={{ marginLeft: "auto" }} onClick={() => go("canteens")}>Change</button>
        </div>
        <h1 style={{ fontSize: 32, marginBottom: 6 }}>What's on the menu?</h1>
        <p style={{ color: "var(--text-secondary)", fontSize: 15, marginBottom: 22 }}>Fresh food. Simple ordering.</p>
      </div>

      <div className="menu-toolbar">
        <div className="wrap">
          <div className="search-bar">
            <Icon name="search" size={18} />
            <input placeholder="Search for momo, noodles, drinks..." value={search} onChange={(e) => setSearch(e.target.value)} aria-label="Search menu" />
          </div>
          <div className="chip-row">
            {CATEGORIES.map((c) => (
              <button key={c} className={`chip ${cat === c ? "active" : ""}`} onClick={() => setCat(c)}>{c}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="wrap" style={{ paddingTop: 24, paddingBottom: 60 }}>
        {loading ? (
          <Skeleton />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon="search"
            title="No results found"
            text={`We couldn't find anything matching "${search}". Try a different search or category.`}
            action={<button className="btn btn-outline" onClick={() => { setSearch(""); setCat("All"); }}>Clear filters</button>}
          />
        ) : (
          <div className="food-grid">
            {filtered.map((item) => {
              const inCart = cart.find((c) => c.id === item.id);
              return (
                <div className="food-card" key={item.id}>
                  <div className="img-wrap" onClick={() => openDetail(item)}>
                    <SafeImg src={item.image} alt={item.name} />
                    <span className="cat-tag">{item.category}</span>
                    {!item.available && <div className="unavail-badge">Currently unavailable</div>}
                  </div>
                  <div className="body">
                    <h4 onClick={() => openDetail(item)}>{item.name}</h4>
                    <p className="desc">{item.desc}</p>
                    <div className="foot">
                      <span className="price">{money(item.price)}</span>
                      {!inCart ? (
                        <button className="add-btn" disabled={!item.available} onClick={() => addToCart(item)} aria-label={`Add ${item.name}`}>
                          <Icon name="plus" size={18} />
                        </button>
                      ) : (
                        <div className="qty-stepper">
                          <button onClick={() => updateQty(item.id, -1)} aria-label="Decrease quantity"><Icon name="minus" size={14} /></button>
                          <span>{inCart.qty}</span>
                          <button onClick={() => updateQty(item.id, 1)} aria-label="Increase quantity"><Icon name="plus" size={14} /></button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
