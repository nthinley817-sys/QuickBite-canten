import { useState } from "react";
import SafeImg from "../../components/common/SafeImg.jsx";
import AvailBadge from "../../components/common/AvailBadge.jsx";
import Icon from "../../components/icons/Icon.jsx";
import Modal from "../../components/common/Modal.jsx";
import MenuItemModal from "../../components/staff/MenuItemModal.jsx";

export default function MenuManagement({ menuItems, setMenuItems, push }) {
  const [editing, setEditing] = useState(null); // item or "new" or null
  const [deleting, setDeleting] = useState(null);

  const toggleAvail = (id) => {
    setMenuItems((items) => items.map((i) => (i.id === id ? { ...i, available: !i.available } : i)));
    push("Menu item updated.", "success");
  };
  const remove = (id) => {
    setMenuItems((items) => items.filter((i) => i.id !== id));
    setDeleting(null);
    push("Menu item deleted.", "success");
  };
  const save = (item) => {
    setMenuItems((items) => {
      const exists = items.find((i) => i.id === item.id);
      if (exists) return items.map((i) => (i.id === item.id ? item : i));
      return [...items, item];
    });
    push(editing === "new" ? "Menu item added." : "Menu item updated.", "success");
    setEditing(null);
  };

  return (
    <div>
      <div className="dash-header">
        <div><h1 style={{ fontSize: 26 }}>Menu Management</h1><p style={{ color: "var(--text-secondary)", marginTop: 4 }}>Add, edit or remove items from the canteen menu.</p></div>
        <button className="btn btn-primary" onClick={() => setEditing("new")}><Icon name="plus" size={17} /> Add Item</button>
      </div>

      <div className="table-wrap responsive-table">
        <table className="data-table">
          <thead><tr><th>ID</th><th>Item</th><th>Category</th><th>Price</th><th>Availability</th><th>Actions</th></tr></thead>
          <tbody>
            {menuItems.map((item) => (
              <tr key={item.id}>
                <td style={{ fontWeight: 700, color: "var(--text-secondary)" }}>{item.id}</td>
                <td><div style={{ display: "flex", alignItems: "center", gap: 10 }}><SafeImg src={item.image} alt={item.name} /><span style={{ fontWeight: 700 }}>{item.name}</span></div></td>
                <td>{item.category}</td>
                <td style={{ fontWeight: 700 }}>Nu. {item.price}</td>
                <td><AvailBadge available={item.available} /></td>
                <td>
                  <div className="table-actions">
                    <button className="icon-btn" onClick={() => setEditing(item)} aria-label="Edit"><Icon name="edit" size={16} /></button>
                    <button className="icon-btn" onClick={() => toggleAvail(item.id)} aria-label="Toggle availability"><Icon name="refresh" size={16} /></button>
                    <button className="icon-btn" onClick={() => setDeleting(item)} aria-label="Delete"><Icon name="trash" size={16} stroke="var(--error)" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mgmt-cards">
        {menuItems.map((item) => (
          <div className="mgmt-card" key={item.id}>
            <SafeImg src={item.image} alt={item.name} />
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14.5 }}>{item.name}</div>
                  <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>{item.id} · {item.category}</div>
                </div>
                <span className="price" style={{ fontSize: 14 }}>Nu. {item.price}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
                <AvailBadge available={item.available} />
                <div className="table-actions">
                  <button className="icon-btn" onClick={() => setEditing(item)}><Icon name="edit" size={15} /></button>
                  <button className="icon-btn" onClick={() => setDeleting(item)}><Icon name="trash" size={15} stroke="var(--error)" /></button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editing && <MenuItemModal item={editing === "new" ? null : editing} onClose={() => setEditing(null)} onSave={save} />}
      {deleting && (
        <Modal onClose={() => setDeleting(null)} maxWidth={420}>
          <div style={{ padding: 28, textAlign: "center" }}>
            <div className="empty-state" style={{ padding: 0 }}>
              <div className="glyph" style={{ background: "var(--error-bg)", color: "var(--error)" }}><Icon name="trash" size={30} /></div>
              <h3>Delete {deleting.name}?</h3>
              <p>This will permanently remove it from the menu. This can't be undone.</p>
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => setDeleting(null)}>Cancel</button>
              <button className="btn btn-danger" style={{ flex: 1 }} onClick={() => remove(deleting.id)}>Delete</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
