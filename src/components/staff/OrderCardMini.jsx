import PriorityBadge from "../common/PriorityBadge.jsx";
import { money, orderDateTime } from "../../utils/format.js";

export default function OrderCardMini({ order, onClick }) {
  return (
    <div className="order-card" onClick={onClick}>
      <div className="order-card-top">
        <div><div className="order-id">Table {order.tableNumber}</div><div className="order-canteen">{order.canteen}</div></div>
        <PriorityBadge priority={order.priority} />
      </div>
      <div className="order-items">{order.items.map((i) => `${i.qty} × ${i.name}`).join(", ")}</div>
      <div className="order-card-bottom">
        <span className="order-total">{money(order.total)}</span>
        <span className="order-time">{orderDateTime(order)}</span>
      </div>
    </div>
  );
}
