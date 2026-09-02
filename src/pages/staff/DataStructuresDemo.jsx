import { useState, useMemo, Fragment } from "react";
import Icon from "../../components/icons/Icon.jsx";
import OrderCardMini from "../../components/staff/OrderCardMini.jsx";
import { simpleHash } from "../../utils/format.js";

export default function DataStructuresDemo({ orders, menuItems, push }) {
  const [tab, setTab] = useState("queue");
  const pendingQueue = orders.filter((o) => o.status === "Pending").sort((a, b) => a.time.localeCompare(b.time));

  const buckets = (arr, keyFn) => {
    const b = Array.from({ length: 10 }, () => []);
    arr.forEach((x) => b[simpleHash(keyFn(x))].push(x));
    return b;
  };
  const menuBuckets = useMemo(() => buckets(menuItems, (m) => m.id), [menuItems]);
  const orderBuckets = useMemo(() => buckets(orders, (o) => o.id), [orders]);

  const high = orders.filter((o) => o.status === "Pending" && o.priority === "High");
  const normal = orders.filter((o) => o.status === "Pending" && o.priority === "Normal");

  return (
    <div>
      <div className="dash-header"><div><h1 style={{ fontSize: 26 }}>Data Structure Monitor</h1><p style={{ color: "var(--text-secondary)", marginTop: 4 }}>Visual demonstration only — no backend logic runs here yet.</p></div></div>

      <div className="tabs-row">
        <button className={`tab-btn ${tab === "queue" ? "active" : ""}`} onClick={() => setTab("queue")}>Order Queue</button>
        <button className={`tab-btn ${tab === "priority" ? "active" : ""}`} onClick={() => setTab("priority")}>Priority Orders</button>
        <button className={`tab-btn ${tab === "hash" ? "active" : ""}`} onClick={() => setTab("hash")}>Hash Tables</button>
      </div>

      {tab === "queue" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6, flexWrap: "wrap", gap: 10 }}>
            <span className="badge badge-normal">Queue Size: {pendingQueue.length}</span>
            <div style={{ display: "flex", gap: 10 }}>
              <button className="btn btn-outline btn-sm" onClick={() => push(pendingQueue[0] ? `Next up: ${pendingQueue[0].id}` : "Queue is empty")}>Peek Next</button>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => push(pendingQueue[0] ? `Processing ${pendingQueue[0].id} — head to Pending Orders to advance it.` : "Queue is empty")}
              >
                Process Next
              </button>
            </div>
          </div>
          <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "6px 18px", marginTop: 14 }}>
            <div className="queue-track">
              <span className="endpoint-label">FRONT</span>
              <Icon name="chevronRight" className="queue-arrow" />
              {pendingQueue.length === 0 && <span style={{ color: "var(--text-secondary)", fontSize: 14 }}>Queue is empty</span>}
              {pendingQueue.map((o, i) => (
                <Fragment key={o.id}>
                  <div className={`queue-node ${i === 0 ? "front" : ""}`}>
                    <div className="qn-id">{o.id}</div>
                    <div className="qn-tag">{i === 0 ? "Next" : `Pos ${i + 1}`}</div>
                  </div>
                  {i < pendingQueue.length - 1 && <Icon name="chevronRight" className="queue-arrow" />}
                </Fragment>
              ))}
              <Icon name="chevronRight" className="queue-arrow" />
              <span className="endpoint-label">REAR</span>
            </div>
          </div>
        </div>
      )}

      {tab === "priority" && (
        <div>
          <div className="priority-col" style={{ marginBottom: 18 }}>
            <div className="priority-panel">
              <h4 style={{ color: "#991B1B" }}>High Priority</h4>
              {high.length === 0 && <p style={{ color: "var(--text-secondary)", fontSize: 13.5 }}>No high priority orders.</p>}
              {high.map((o) => <OrderCardMini key={o.id} order={o} />)}
            </div>
            <div className="priority-panel">
              <h4>Normal</h4>
              {normal.length === 0 && <p style={{ color: "var(--text-secondary)", fontSize: 13.5 }}>No normal orders.</p>}
              {normal.map((o) => <OrderCardMini key={o.id} order={o} />)}
            </div>
          </div>
          <div className="info-note">Arrival time is used to maintain fairness between orders with equal priority.</div>
        </div>
      )}

      {tab === "hash" && (
        <div>
          <div className="stat-grid" style={{ gridTemplateColumns: "1fr 1fr", marginBottom: 26 }}>
            <div className="stat-card">
              <div className="stat-top"><span style={{ fontWeight: 800, fontSize: 15 }}>MenuHashTable</span></div>
              <div className="detail-row"><span className="lbl">Stored Items</span><span>{menuItems.length}</span></div>
              <div className="detail-row"><span className="lbl">Buckets</span><span>10</span></div>
              <div className="detail-row"><span className="lbl">Collision Handling</span><span>Separate Chaining</span></div>
              <div className="detail-row"><span className="lbl">Lookup Key</span><span>Item ID</span></div>
            </div>
            <div className="stat-card">
              <div className="stat-top"><span style={{ fontWeight: 800, fontSize: 15 }}>OrderHashTable</span></div>
              <div className="detail-row"><span className="lbl">Stored Items</span><span>{orders.length}</span></div>
              <div className="detail-row"><span className="lbl">Buckets</span><span>10</span></div>
              <div className="detail-row"><span className="lbl">Collision Handling</span><span>Separate Chaining</span></div>
              <div className="detail-row"><span className="lbl">Lookup Key</span><span>Order ID</span></div>
            </div>
          </div>
          <h4 style={{ fontSize: 14, marginBottom: 12, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: ".04em" }}>OrderHashTable buckets</h4>
          <div className="bucket-grid" style={{ marginBottom: 26 }}>
            {orderBuckets.map((b, i) => (
              <div className="bucket" key={i}>
                <div className="bnum">Bucket {i}</div>
                {b.length === 0 ? <div style={{ color: "var(--text-secondary)", fontSize: 12 }}>empty</div> : b.map((o) => <div className="bitem" key={o.id}>→ {o.id}</div>)}
              </div>
            ))}
          </div>
          <h4 style={{ fontSize: 14, marginBottom: 12, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: ".04em" }}>MenuHashTable buckets</h4>
          <div className="bucket-grid">
            {menuBuckets.map((b, i) => (
              <div className="bucket" key={i}>
                <div className="bnum">Bucket {i}</div>
                {b.length === 0 ? <div style={{ color: "var(--text-secondary)", fontSize: 12 }}>empty</div> : b.map((m) => <div className="bitem" key={m.id}>→ {m.name}</div>)}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
