import EmptyState from "../../components/common/EmptyState.jsx";
import Icon from "../../components/icons/Icon.jsx";
import { money, orderDate, orderTime } from "../../utils/format.js";

export default function OrderConfirmation({ order, go, notifyPermission, onEnableNotify }) {
  if (!order) {
    return (
      <div className="wrap section-tight">
        <EmptyState
          icon="receipt"
          title="No recent order"
          text="Place an order to see your confirmation here."
          action={<button className="btn btn-primary" onClick={() => go("canteens")}>Browse Menu</button>}
        />
      </div>
    );
  }
  const date = orderDate(order);
  return (
    <div className="wrap section-tight" style={{ maxWidth: 560 }}>
      <div className="ticket">
        <div className="success-ring"><Icon name="checkCircle" size={38} stroke="var(--success)" /></div>
        <h2 style={{ fontSize: 24 }}>Order Confirmed!</h2>
        <div className="order-code">Table {order.tableNumber}</div>
        <p style={{ color: "var(--text-secondary)", fontSize: 14, marginBottom: 6 }}>{order.canteen}</p>
        <p style={{ color: "var(--text-secondary)", fontSize: 13.5, marginBottom: 20 }}>Please wait for your order to be prepared.</p>

        <div className="ticket-meta">
          <div><span className="lbl">Order No.</span><span className="val">{order.id}</span></div>
          {date && <div><span className="lbl">Date</span><span className="val">{date}</span></div>}
          <div><span className="lbl">Time</span><span className="val">{orderTime(order)}</span></div>
        </div>

        <div style={{ textAlign: "left", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", padding: "16px 0", margin: "0 0 20px" }}>
          {order.items.map((it, idx) => (
            <div key={idx} style={{ display: "flex", justifyContent: "space-between", fontSize: 14.5, padding: "4px 0" }}>
              <span>{it.qty} × {it.name}</span>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 800, fontSize: 19, marginBottom: 20 }}>
          <span>Total</span><span>{money(order.total)}</span>
        </div>

        <div className="info-note screenshot-note" role="note">
          <Icon name="receipt" size={18} />
          <span><strong>Take a screenshot of this page.</strong> Show it at the counter when you pay, so staff can find your order quickly.</span>
        </div>

        {notifyPermission === "default" && (
          <button className="btn btn-outline btn-block notify-btn" onClick={onEnableNotify}>
            <Icon name="bell" size={16} /> Notify me on this phone when it's ready
          </button>
        )}
        {notifyPermission === "granted" && (
          <p className="notify-on"><Icon name="check" size={14} /> You'll get a notification when your order is ready.</p>
        )}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => go("tracking")}>Track My Order</button>
          <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => go("canteens")}>Back to Menu</button>
        </div>
      </div>
    </div>
  );
}
