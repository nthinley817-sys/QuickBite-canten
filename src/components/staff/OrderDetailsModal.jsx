import Modal from "../common/Modal.jsx";
import StatusBadge from "../common/StatusBadge.jsx";
import PriorityBadge from "../common/PriorityBadge.jsx";
import { money, orderDate, orderTime } from "../../utils/format.js";

export default function OrderDetailsModal({ order, onClose, advance, onDelete, onSetPriority }) {
  if (!order) return null;
  const actionMap = { Pending: "Start Preparing", Processing: "Mark Completed", Completed: null };
  return (
    <Modal onClose={onClose}>
      <div style={{ padding: 28 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
          <div>
            <div className="order-code" style={{ fontSize: 22, margin: "0 0 6px" }}>Table {order.tableNumber}</div>
            <p style={{ color: "var(--text-secondary)", fontSize: 13.5 }}>{order.canteen}</p>
          </div>
          <StatusBadge status={order.status} />
        </div>
        <div style={{ margin: "18px 0" }}>
          <div className="detail-row"><span className="lbl">Order No.</span><span>{order.id}</span></div>
          <div className="detail-row"><span className="lbl">Placed</span><span>{orderDate(order) ? `${orderDate(order)}, ${orderTime(order)}` : orderTime(order)}</span></div>
          <div className="detail-row">
            <span className="lbl">Priority</span>
            <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <PriorityBadge priority={order.priority} />
              {order.status === "Pending" && onSetPriority && (
                <button className="btn btn-outline btn-sm" onClick={() => onSetPriority(order, order.priority === "High" ? "Normal" : "High")}>
                  {order.priority === "High" ? "Set Normal" : "Mark High Priority"}
                </button>
              )}
            </span>
          </div>
          {order.items.map((it, i) => (
            <div className="detail-row" key={i}><span className="lbl">{it.qty} × {it.name}</span></div>
          ))}
          <div className="detail-row"><span style={{ fontWeight: 800 }}>Total</span><span style={{ fontWeight: 800 }}>{money(order.total)}</span></div>
        </div>
        {actionMap[order.status] ? (
          <button className="btn btn-primary btn-block" onClick={() => { advance(order.id); onClose(); }}>{actionMap[order.status]}</button>
        ) : (
          <button className="btn btn-danger btn-block" onClick={() => onDelete(order)}>Remove Order</button>
        )}
      </div>
    </Modal>
  );
}
