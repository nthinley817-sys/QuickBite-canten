import { useState } from "react";
import Modal from "../common/Modal.jsx";
import SafeImg from "../common/SafeImg.jsx";
import { CATEGORIES } from "../../data/menu.js";
import { IMG } from "../../data/images.js";

export default function MenuItemModal({ item, onClose, onSave }) {
  const blank = { id: "M0" + Math.floor(100 + Math.random() * 899), name: "", category: CATEGORIES[1], price: "", desc: "", image: IMG.momo, available: true };
  const [form, setForm] = useState(item || blank);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  return (
    <Modal onClose={onClose}>
      <div style={{ padding: 28 }}>
        <h3 style={{ fontSize: 20, marginBottom: 20 }}>{item ? "Edit Menu Item" : "Add Menu Item"}</h3>
        <SafeImg src={form.image} alt="preview" style={{ width: "100%", height: 150, objectFit: "cover", borderRadius: 12, marginBottom: 16 }} />
        <div className="field"><label>Item ID</label><input value={form.id} disabled /></div>
        <div className="field"><label>Name</label><input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Chicken Momo" /></div>
        <div className="field-row">
          <div className="field">
            <label>Category</label>
            <select value={form.category} onChange={(e) => set("category", e.target.value)}>
              {CATEGORIES.filter((c) => c !== "All").map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="field"><label>Price (Nu.)</label><input type="number" value={form.price} onChange={(e) => set("price", e.target.value)} placeholder="50" /></div>
        </div>
        <div className="field"><label>Description</label><textarea value={form.desc} onChange={(e) => set("desc", e.target.value)} /></div>
        <div className="switch-row" style={{ marginBottom: 22 }}>
          <span style={{ fontWeight: 600, fontSize: 14 }}>Available for ordering</span>
          <button className={`switch ${form.available ? "on" : ""}`} onClick={() => set("available", !form.available)} aria-label="Toggle availability"><span className="knob" /></button>
        </div>
        <button
          className="btn btn-primary btn-block"
          disabled={!form.name || !form.price}
          onClick={() => onSave({ ...form, price: Number(form.price) })}
        >
          {item ? "Save Changes" : "Add Item"}
        </button>
      </div>
    </Modal>
  );
}
