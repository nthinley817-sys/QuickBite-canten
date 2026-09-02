import Icon from "../icons/Icon.jsx";
import SafeImg from "../common/SafeImg.jsx";
import { CANTEENS } from "../../data/canteens.js";

export default function CanteenGrid({ go }) {
  return (
    <div className="canteen-grid">
      {CANTEENS.map((c) => (
        <div className="canteen-card" key={c.id} onClick={() => go("menu", { canteen: c.id })}>
          <div className="img-wrap"><SafeImg src={c.image} alt={c.name} /></div>
          <div className="body">
            <div className="loc"><Icon name="map" size={14} /> {c.location}</div>
            <h3>{c.name}</h3>
            <p className="desc">{c.desc}</p>
            <button className="btn btn-primary btn-sm">View Menu <Icon name="chevronRight" size={15} /></button>
          </div>
        </div>
      ))}
    </div>
  );
}
