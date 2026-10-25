export const money = (n) => `Nu. ${n}`;

// Orders are placed and collected in Bhutan, so always show Bhutan time,
// whatever time zone the viewer's phone happens to be set to.
const ORDER_ZONE = "Asia/Thimphu";
const orderDateFmt = new Intl.DateTimeFormat("en-GB", { timeZone: ORDER_ZONE, weekday: "short", day: "numeric", month: "short", year: "numeric" });
const orderShortDateFmt = new Intl.DateTimeFormat("en-GB", { timeZone: ORDER_ZONE, day: "numeric", month: "short" });
const orderTimeFmt = new Intl.DateTimeFormat("en-US", { timeZone: ORDER_ZONE, hour: "2-digit", minute: "2-digit" });

const placedAt = (order) => (order && order.placedAt ? new Date(order.placedAt) : null);

// "Sun, 26 Oct 2026" — falls back to nothing for older orders without a date.
export const orderDate = (order) => { const d = placedAt(order); return d ? orderDateFmt.format(d) : ""; };
// "12:45 AM"
export const orderTime = (order) => { const d = placedAt(order); return d ? orderTimeFmt.format(d) : order?.time ?? ""; };
// "26 Oct, 12:45 AM" — compact form for staff lists.
export const orderDateTime = (order) => {
  const d = placedAt(order);
  return d ? `${orderShortDateFmt.format(d)}, ${orderTimeFmt.format(d)}` : order?.time ?? "";
};

// Pending -> Processing -> Completed. Used by both the customer "Refresh Status"
// button and staff action buttons so both views advance the same mock order.
export const nextStatus = { Pending: "Processing", Processing: "Completed", Completed: "Completed" };

// Simple demo hash function for the Data Structure Monitor's bucket visualization.
// This is a UI demonstration only — it is NOT a real hash table implementation.
export const simpleHash = (str) => {
  let sum = 0;
  for (const c of str) sum += c.charCodeAt(0);
  return sum % 10;
};

// Oldest first. ISO timestamps sort correctly as strings; older orders without
// one fall back to their display time.
export const byPlacedAt = (a, b) => (a.placedAt || a.time || "").localeCompare(b.placedAt || b.time || "");
