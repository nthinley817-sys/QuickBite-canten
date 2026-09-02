import SafeImg from "../common/SafeImg.jsx";
import { money } from "../../utils/format.js";

export default function FoodCardPreview({ item }) {
  if (!item) return null;
  return (
    <div className="food-card">
      <div className="img-wrap">
        <SafeImg src={item.image} alt={item.name} />
        <span className="cat-tag">{item.category}</span>
      </div>
      <div className="body">
        <h4>{item.name}</h4>
        <p className="desc">{item.desc}</p>
        <div className="foot"><span className="price">{money(item.price)}</span></div>
      </div>
    </div>
  );
}
