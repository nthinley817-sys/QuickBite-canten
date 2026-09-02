import Modal from "../common/Modal.jsx";
import StatusBadge from "../common/StatusBadge.jsx";
import PriorityBadge from "../common/PriorityBadge.jsx";
import { money } from "../../utils/format.js";

export default function OrderDetailsModal({ order, onClose, advance }) {
  if (!order) return null;
  const actionMap = { Pending: "Start Preparing", Processing: "Mark Completed", Completed: null };
  return (
    <Modal onClose={onClose}>
      <div style={{ padding: 28 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
          <div>
            <div className="order-code" style={{ fontSize: 22, margin: "0 0 6px" }}>{order.id}</div>
            <p style={{ color: "var(--text-secondary)", fontSize: 13.5 }}>{order.canteen}</p>
          </div>
          <StatusBadge status={order.status} />
        </div>
        <div style={{ margin: "18px 0" }}>
          <div className="detail-row"><span className="lbl">Order Time</span><span>{order.time}</span></div>
          <div className="detail-row"><span className="lbl">Priority</span><PriorityBadge priority={order.priority} /></div>
          {order.items.map((it, i) => (
            <div className="detail-row" key={i}><span className="lbl">{it.qty} × {it.name}</span></div>
          ))}
          <div className="detail-row"><span style={{ fontWeight: 800 }}>Total</span><span style={{ fontWeight: 800 }}>{money(order.total)}</span></div>
        </div>
        {actionMap[order.status] ? (
          <button className="btn btn-primary btn-block" onClick={() => { advance(order.id); onClose(); }}>{actionMap[order.status]}</button>
        ) : (
          <button className="btn btn-outline btn-block" disabled>Completed</button>
        )}
      </div>
    </Modal>
  );
}
