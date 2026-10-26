import Icon from "../icons/Icon.jsx";
import { money, orderTime } from "../../utils/format.js";
import { describeOrder } from "../../hooks/useOrderAlerts.js";

// Messenger-style "new order" cards stacked in the top-right corner of the
// staff console. Each one opens that order; they disappear on their own.
export default function NewOrderAlerts({ cards, onOpen, onDismiss }) {
  if (cards.length === 0) return null;
  return (
    <div className="order-alerts" aria-live="assertive">
      {cards.map((c) => (
        <div className="order-alert" key={c.key} role="alert">
          <button className="order-alert-body" onClick={() => onOpen(c)}>
            <span className="order-alert-icon"><Icon name="bell" size={18} /></span>
            <span className="order-alert-text">
              <span className="order-alert-title">New order · Table {c.order.tableNumber}</span>
              <span className="order-alert-items">{describeOrder(c.order)}</span>
              <span className="order-alert-meta">{money(c.order.total)} · {orderTime(c.order)} · Tap to view</span>
            </span>
          </button>
          <button className="order-alert-close" onClick={() => onDismiss(c.key)} aria-label="Dismiss">
            <Icon name="close" size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
