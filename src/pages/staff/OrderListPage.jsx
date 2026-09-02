import EmptyState from "../../components/common/EmptyState.jsx";
import PriorityBadge from "../../components/common/PriorityBadge.jsx";
import { money } from "../../utils/format.js";

export default function OrderListPage({ title, subtitle, orders, status, advance, actionLabel, openDetails }) {
  const list = orders.filter((o) => o.status === status);
  return (
    <div>
      <div className="dash-header">
        <div><h1 style={{ fontSize: 26 }}>{title}</h1><p style={{ color: "var(--text-secondary)", marginTop: 4 }}>{subtitle}</p></div>
        <span className="badge badge-normal">{list.length} order{list.length !== 1 ? "s" : ""}</span>
      </div>
      {list.length === 0 ? (
        <EmptyState icon="checkCircle" title={`No ${status.toLowerCase()} orders`} text="New orders will appear here automatically." />
      ) : (
        <div className="orders-list">
          {list.map((o) => (
            <div className={`order-card ${status === "Completed" ? "completed" : ""}`} key={o.id} onClick={() => openDetails(o)}>
              <div className="order-card-top">
                <div><div className="order-id">{o.id}</div><div className="order-canteen">{o.canteen}</div></div>
                <PriorityBadge priority={o.priority} />
              </div>
              <div className="order-items">{o.items.map((i) => `${i.qty} × ${i.name}`).join(", ")}</div>
              <div className="order-card-bottom">
                <span className="order-total">{money(o.total)}</span>
                <span className="order-time">{status === "Completed" ? `Completed: ${o.time}` : o.time}</span>
              </div>
              {actionLabel && (
                <button
                  className="btn btn-primary btn-sm btn-block"
                  style={{ marginTop: 14 }}
                  onClick={(e) => { e.stopPropagation(); advance(o.id); }}
                >
                  {actionLabel}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
