import { useState, useEffect } from "react";
import EmptyState from "../../components/common/EmptyState.jsx";
import StatusBadge from "../../components/common/StatusBadge.jsx";
import OrderCardMini from "../../components/staff/OrderCardMini.jsx";
import { Api } from "../../services/api.js";

export default function SearchSortDemo({ orders }) {
  const [q, setQ] = useState("");
  const [found, setFound] = useState(null);
  const [searched, setSearched] = useState(false);
  const [sortBy, setSortBy] = useState("Time");
  const [dir, setDir] = useState("Descending");

  const [searchInfo, setSearchInfo] = useState(null);
  const [sortInfo, setSortInfo] = useState(null);
  const [sorted, setSorted] = useState([]);

  // Search runs in Java: merge sort by order number, then binary search.
  const doSearch = async () => {
    if (!q.trim()) return;
    try {
      const r = await Api.dsaSearch(q.trim());
      setFound(r.found ? r.order : null);
      setSearchInfo(r);
    } catch {
      setFound(null);
      setSearchInfo(null);
    }
    setSearched(true);
  };

  // Sorting runs in Java (merge sort); re-sort when the live orders change.
  const ordersKey = orders.map((o) => `${o.id}:${o.status}`).join("|");
  useEffect(() => {
    let cancelled = false;
    Api.dsaSorted(sortBy, dir)
      .then((r) => { if (!cancelled) { setSorted(r.orders); setSortInfo(r); } })
      .catch(() => { if (!cancelled) setSortInfo(null); });
    return () => { cancelled = true; };
  }, [sortBy, dir, ordersKey]);

  return (
    <div>
      <div className="dash-header"><div><h1 style={{ fontSize: 26 }}>Search & Sort</h1><p style={{ color: "var(--text-secondary)", marginTop: 4 }}>Search and sort this canteen's orders with QuickBite's Java algorithms.</p></div></div>

      <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 22, marginBottom: 28 }}>
        <h4 style={{ fontSize: 15, marginBottom: 6 }}>Search Order</h4>
        <div className="java-source"><span className="java-tag">Java</span><code>backend/src/main/java/com/quickbite/dsa/BinarySearch.java</code><span className="java-ops">O(log n)</span></div>
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
              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--success)", marginBottom: 8 }}>
                ✓ Order found{searchInfo && ` · binary search took ${searchInfo.steps} step${searchInfo.steps === 1 ? "" : "s"} over ${searchInfo.searchedCount} orders`}
              </div>
              <div className="order-card-top">
                <div><div className="order-id">{found.id}</div><div className="order-canteen">{found.canteen}</div></div>
                <StatusBadge status={found.status} />
              </div>
              <div className="order-items">{found.items.map((i) => `${i.qty} × ${i.name}`).join(", ")}</div>
            </div>
          ) : (
            <div style={{ marginTop: 16 }}>
              <EmptyState icon="search" title="No matching order"
                text={`We couldn't find an order matching "${q}".${searchInfo ? ` Binary search checked ${searchInfo.steps} of ${searchInfo.searchedCount} orders.` : ""}`} />
            </div>
          )
        )}
      </div>

      <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 22 }}>
        <h4 style={{ fontSize: 15, marginBottom: 6 }}>Sort Orders</h4>
        <div className="java-source">
          <span className="java-tag">Java</span><code>backend/src/main/java/com/quickbite/dsa/MergeSort.java</code>
          <span className="java-ops">O(n log n), stable{sortInfo && ` · ${sortInfo.comparisons} comparisons for ${sortInfo.orders.length} orders`}</span>
        </div>
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
