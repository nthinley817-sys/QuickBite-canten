import SafeImg from "../../components/common/SafeImg.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";
import Icon from "../../components/icons/Icon.jsx";
import { money } from "../../utils/format.js";

export default function CartPage({ cart, menuItems, updateQty, removeItem, go, placeOrder }) {
  const items = cart.map((c) => ({ ...c, menuItem: menuItems.find((m) => m.id === c.id) })).filter((c) => c.menuItem);
  const subtotal = items.reduce((s, i) => s + i.menuItem.price * i.qty, 0);

  if (items.length === 0) {
    return (
      <div className="wrap section-tight">
        <EmptyState
          icon="cart"
          title="Your cart is empty"
          text="Add something delicious from the menu."
          action={<button className="btn btn-primary" onClick={() => go("canteens")}>Browse Menu</button>}
        />
      </div>
    );
  }

  return (
    <div className="wrap section-tight" style={{ paddingBottom: 120 }}>
      <h1 style={{ fontSize: 30, marginBottom: 26 }}>Your Cart</h1>
      <div className="cart-layout">
        <div>
          {items.map((i) => (
            <div className="cart-item" key={i.id}>
              <SafeImg src={i.menuItem.image} alt={i.menuItem.name} />
              <div className="info">
                <h4>{i.menuItem.name}</h4>
                <div className="meta">{i.qty} × {money(i.menuItem.price)}</div>
                {i.note && <div className="meta" style={{ fontStyle: "italic", marginTop: 2 }}>Note: {i.note}</div>}
              </div>
              <div className="right">
                <span className="price" style={{ fontSize: 15 }}>{money(i.menuItem.price * i.qty)}</span>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div className="qty-stepper" style={{ height: 32 }}>
                    <button onClick={() => updateQty(i.id, -1)}><Icon name="minus" size={13} /></button>
                    <span style={{ fontSize: 13 }}>{i.qty}</span>
                    <button onClick={() => updateQty(i.id, 1)}><Icon name="plus" size={13} /></button>
                  </div>
                  <button className="remove-link" onClick={() => removeItem(i.id)}>Remove</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div>
          <div className="summary-card desktop-only" style={{ display: "block" }}>
            <h3 style={{ fontSize: 18, marginBottom: 16 }}>Order Summary</h3>
            <div className="summary-row"><span>Items ({items.reduce((s, i) => s + i.qty, 0)})</span><span>{money(subtotal)}</span></div>
            <div className="summary-row"><span>Subtotal</span><span>{money(subtotal)}</span></div>
            <div className="summary-row total"><span>Total</span><span>{money(subtotal)}</span></div>
            <button className="btn btn-primary btn-block" style={{ marginTop: 16 }} onClick={placeOrder}>Place Order</button>
          </div>
        </div>
      </div>
      <div className="sticky-cta mobile-only" style={{ display: "none" }}>
        <div className="wrap" style={{ padding: 0, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
          <div><div style={{ fontSize: 12, color: "var(--text-secondary)" }}>Total</div><div style={{ fontWeight: 800, fontSize: 19 }}>{money(subtotal)}</div></div>
          <button className="btn btn-primary" style={{ flex: 1 }} onClick={placeOrder}>Place Order</button>
        </div>
      </div>
    </div>
  );
}
