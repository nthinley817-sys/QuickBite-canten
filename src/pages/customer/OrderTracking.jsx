import { Fragment } from "react";
import EmptyState from "../../components/common/EmptyState.jsx";
import Icon from "../../components/icons/Icon.jsx";
import { money } from "../../utils/format.js";

export default function OrderTracking({ order, onRefresh, go }) {
  if (!order) {
    return (
      <div className="wrap section-tight">
        <EmptyState
          icon="clock"
          title="Nothing to track yet"
          text="Place an order and it'll show up here."
          action={<button className="btn btn-primary" onClick={() => go("canteens")}>Browse Menu</button>}
        />
      </div>
    );
  }

  const steps = ["Pending", "Processing", "Completed"];
  const idx = steps.indexOf(order.status);
  const copy = {
    Pending: "Your order has been received.",
    Processing: "Your food is being prepared.",
    Completed: "Your order is ready for collection.",
  };

  return (
    <div className="wrap section-tight" style={{ maxWidth: 600 }}>
      <h1 style={{ fontSize: 28, marginBottom: 6 }}>Track Your Order</h1>
      <p style={{ color: "var(--text-secondary)", marginBottom: 26 }}>{order.canteen}</p>
      <div className="ticket" style={{ textAlign: "left" }}>
        <div style={{ textAlign: "center" }}>
          <div className="order-code" style={{ marginBottom: 4 }}>{order.id}</div>
          <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>{copy[order.status]}</p>
        </div>
        <div className="timeline">
          {steps.map((s, i) => (
            <Fragment key={s}>
              <div className={`tl-step ${i < idx ? "done" : i === idx ? "active" : ""}`}>
                <div className="tl-dot">{i < idx ? <Icon name="check" size={15} /> : i + 1}</div>
                <div className="tl-label">{s}</div>
              </div>
              {i < steps.length - 1 && <div className={`tl-line ${i < idx ? "done" : ""}`} />}
            </Fragment>
          ))}
        </div>
        <div style={{ borderTop: "1px solid var(--border)", paddingTop: 16, marginTop: 6 }}>
          {order.items.map((it, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 14, padding: "4px 0", color: "var(--text-secondary)" }}>
              <span>{it.qty} × {it.name}</span>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 800, fontSize: 17, marginTop: 10 }}>
            <span>Total</span><span>{money(order.total)}</span>
          </div>
        </div>
        <button className="btn btn-outline btn-block" style={{ marginTop: 20 }} disabled={order.status === "Completed"} onClick={onRefresh}>
          <Icon name="refresh" size={16} /> Refresh Status
        </button>
      </div>
    </div>
  );
}
