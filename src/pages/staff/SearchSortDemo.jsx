import { useState, useMemo } from "react";
import EmptyState from "../../components/common/EmptyState.jsx";
import StatusBadge from "../../components/common/StatusBadge.jsx";
import OrderCardMini from "../../components/staff/OrderCardMini.jsx";

export default function SearchSortDemo({ orders }) {
  const [q, setQ] = useState("");
  const [found, setFound] = useState(null);
  const [searched, setSearched] = useState(false);
  const [sortBy, setSortBy] = useState("Time");
  const [dir, setDir] = useState("Descending");

  const doSearch = () => {
    const clean = q.trim().toUpperCase().replace(/^QB-?/, "");
    const result = orders.find((o) => o.id.replace("QB-", "") === clean || o.id.toUpperCase() === q.trim().toUpperCase());
    setFound(result || null);
    setSearched(true);
  };

  const sorted = useMemo(() => {
    const arr = [...orders];
    const cmp = {
      "Order Number": (a, b) => a.id.localeCompare(b.id),
      Time: (a, b) => a.time.localeCompare(b.time),
      Total: (a, b) => a.total - b.total,
      Priority: (a, b) => (a.priority === "High" ? 0 : 1) - (b.priority === "High" ? 0 : 1),
      Status: (a, b) => a.status.localeCompare(b.status),
    };
    arr.sort(cmp[sortBy]);
    if (dir === "Descending") arr.reverse();
    return arr;
  }, [orders, sortBy, dir]);

  return (
    <div>
      <div className="dash-header"><div><h1 style={{ fontSize: 26 }}>Search & Sort</h1><p style={{ color: "var(--text-secondary)", marginTop: 4 }}>Frontend demonstration over today's mock order list.</p></div></div>

      <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 22, marginBottom: 28 }}>
        <h4 style={{ fontSize: 15, marginBottom: 14 }}>Search Order</h4>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <input
            style={{ flex: 1, minWidth: 200, padding: "12px 14px", borderRadius: 11, border: "1.5px solid var(--border)" }}
            placeholder="#QB-1042"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && doSearch()}
          />
          <button className="btn btn-primary" onClick={doSearch}>Search</button>
        </div>
        {searched && (
          found ? (
            <div className="order-card" style={{ marginTop: 16, cursor: "default" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--success)", marginBottom: 8 }}>✓ Order found</div>
              <div className="order-card-top">
                <div><div className="order-id">{found.id}</div><div className="order-canteen">{found.canteen}</div></div>
                <StatusBadge status={found.status} />
              </div>
              <div className="order-items">{found.items.map((i) => `${i.qty} × ${i.name}`).join(", ")}</div>
            </div>
          ) : (
            <div style={{ marginTop: 16 }}>
              <EmptyState icon="search" title="No matching order" text={`We couldn't find an order matching "${q}".`} />
            </div>
          )
        )}
      </div>

      <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 22 }}>
        <h4 style={{ fontSize: 15, marginBottom: 14 }}>Sort Orders</h4>
        <div className="field-row" style={{ marginBottom: 20 }}>
          <div className="field" style={{ marginBottom: 0 }}>
            <label>Sort by</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              {["Order Number", "Time", "Total", "Priority", "Status"].map((o) => <option key={o}>{o}</option>)}
            </select>
          </div>
          <div className="field" style={{ marginBottom: 0 }}>
            <label>Direction</label>
            <select value={dir} onChange={(e) => setDir(e.target.value)}>
              <option>Ascending</option><option>Descending</option>
            </select>
          </div>
        </div>
        <div className="orders-list">
          {sorted.map((o) => <OrderCardMini key={o.id} order={o} />)}
        </div>
      </div>
    </div>
  );
}
