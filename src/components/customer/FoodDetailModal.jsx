import { useState } from "react";
import Modal from "../common/Modal.jsx";
import SafeImg from "../common/SafeImg.jsx";
import AvailBadge from "../common/AvailBadge.jsx";
import Icon from "../icons/Icon.jsx";
import { money } from "../../utils/format.js";

export default function FoodDetailModal({ item, onClose, onAdd }) {
  const [qty, setQty] = useState(1);
  const [note, setNote] = useState("");
  if (!item) return null;
  return (
    <Modal onClose={onClose}>
      <SafeImg src={item.image} alt={item.name} style={{ width: "100%", height: 240, objectFit: "cover", borderRadius: "22px 22px 0 0" }} />
      <div style={{ padding: 26 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10, marginBottom: 10 }}>
          <div>
            <span className="badge badge-normal" style={{ marginBottom: 8 }}>{item.category}</span>
            <h3 style={{ fontSize: 24 }}>{item.name}</h3>
          </div>
          <span className="price" style={{ fontSize: 22 }}>{money(item.price)}</span>
        </div>
        <p style={{ color: "var(--text-secondary)", fontSize: 14.5, lineHeight: 1.6, marginBottom: 16 }}>{item.desc}</p>
        <AvailBadge available={item.available} />

        <div className="field" style={{ marginTop: 22 }}>
          <label>Quantity</label>
          <div className="qty-stepper" style={{ background: "var(--dark)", width: "fit-content" }}>
            <button onClick={() => setQty((q) => Math.max(1, q - 1))}><Icon name="minus" size={14} /></button>
            <span style={{ minWidth: 28 }}>{qty}</span>
            <button onClick={() => setQty((q) => q + 1)}><Icon name="plus" size={14} /></button>
          </div>
        </div>
        <div className="field">
          <label>Special instructions (optional)</label>
          <textarea placeholder="e.g. less spicy, no onions" value={note} onChange={(e) => setNote(e.target.value)} />
        </div>
        <button
          className="btn btn-primary btn-block"
          disabled={!item.available}
          onClick={() => { onAdd(item, qty, note); onClose(); }}
        >
          Add to Cart · {money(item.price * qty)}
        </button>
      </div>
    </Modal>
  );
}
