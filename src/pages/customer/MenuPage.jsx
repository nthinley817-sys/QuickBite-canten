import { useState, useMemo } from "react";
import Icon from "../../components/icons/Icon.jsx";
import SafeImg from "../../components/common/SafeImg.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";
import Skeleton from "../../components/common/Skeleton.jsx";
import { CATEGORIES } from "../../data/menu.js";
import { CANTEENS } from "../../data/canteens.js";
import { IMG } from "../../data/images.js";
import { money } from "../../utils/format.js";
import useReveal from "../../hooks/useReveal.js";

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

  // Group into the same category-columns layout Appetizer's menu page uses
  // (Breakfast / Lunch / Dinner ... becomes our own categories here).
  const grouped = useMemo(() => {
    const map = new Map();
    filtered.forEach((item) => {
      if (!map.has(item.category)) map.set(item.category, []);
      map.get(item.category).push(item);
    });
    return Array.from(map.entries());
  }, [filtered]);

  const revealRef = useReveal([grouped, loading]);

  return (
    <div>
      <div className="page-hero" style={{ "--hero-img": `url(${IMG.hero})` }}>
        <div className="wrap">
          <span className="eyebrow-script">Menu</span>
          <h1>What's on the menu?</h1>
          <div className="crumb">
            <Icon name="map" size={14} /> {canteen.name} · {canteen.location}
            <button onClick={() => go("canteens")}>Change</button>
          </div>
        </div>
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

      <div className="wrap" style={{ paddingTop: 24, paddingBottom: 60 }} ref={revealRef}>
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
          grouped.map(([groupName, items]) => (
            <div key={groupName} style={{ marginBottom: 40 }} data-reveal>
              <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 18 }}>{groupName}</h3>
              <div className="menu-list">
                {items.map((item) => {
                  const inCart = cart.find((c) => c.id === item.id);
                  return (
                    <div className={`menu-item ${!item.available ? "unavailable" : ""}`} key={item.id} data-reveal>
                      <SafeImg className="thumb" src={item.image} alt={item.name} onClick={() => openDetail(item)} />
                      <div className="info">
                        <div className="row">
                          <h3 onClick={() => openDetail(item)}>{item.name}</h3>
                          <span className="price">{money(item.price)}</span>
                        </div>
                        <p className="desc">{item.desc}</p>
                        <div className="foot">
                          <span className="cat-tag">{item.available ? item.category : "Unavailable"}</span>
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
            </div>
          ))
        )}
      </div>
    </div>
  );
}
