import { useState, useEffect, Fragment } from "react";
import Icon from "../../components/icons/Icon.jsx";
import OrderCardMini from "../../components/staff/OrderCardMini.jsx";
import { Api } from "../../services/api.js";

// Shows QuickBite's Java data structures (backend package com.quickbite.dsa)
// working on this canteen's live orders and menu. Everything here is computed
// by the backend; this page only displays it.

const SOURCE = {
  queue: { file: "dsa/OrderQueue.java", ops: "enqueue O(1) · dequeue O(1) · peek O(1)" },
  priority: { file: "dsa/PriorityOrderQueue.java", ops: "add O(log n) · poll O(log n) · peek O(1)" },
  hash: { file: "dsa/ChainedHashTable.java", ops: "put / get / remove O(1) average · resize + rehash O(n), amortised O(1)" },
};

function JavaBadge({ tab }) {
  return (
    <div className="java-source">
      <span className="java-tag">Java</span>
      <code>backend/src/main/java/com/quickbite/{SOURCE[tab].file}</code>
      <span className="java-ops">{SOURCE[tab].ops}</span>
    </div>
  );
}

export default function DataStructuresDemo({ orders, push, onOrdersChanged }) {
  const [tab, setTab] = useState("queue");
  const [data, setData] = useState({});
  const [error, setError] = useState(null);
  const [lookupKey, setLookupKey] = useState("");
  const [lookup, setLookup] = useState(null);

  // Re-run the Java structures whenever the live order list changes.
  const ordersKey = orders.map((o) => `${o.id}:${o.status}`).join("|");
  useEffect(() => {
    let cancelled = false;
    const load = tab === "queue" ? Api.dsaQueue() : tab === "priority" ? Api.dsaPriority() : Api.dsaHash();
    load
      .then((d) => { if (!cancelled) { setData((prev) => ({ ...prev, [tab]: d })); setError(null); } })
      .catch((err) => { if (!cancelled) setError(err.userMessage || "Couldn't load from the backend."); });
    return () => { cancelled = true; };
  }, [tab, ordersKey]);

  // dequeue(): the backend takes the front order off the queue and starts it.
  const [processing, setProcessing] = useState(false);
  const processNext = async () => {
    setProcessing(true);
    try {
      const r = await Api.dsaProcessNext();
      setData((prev) => ({ ...prev, queue: r.queue }));
      push(`dequeue() → ${r.processed.id} (Table ${r.processed.tableNumber}) is now being prepared.`, "success");
      onOrdersChanged();
    } catch (err) {
      push(err.userMessage || "Couldn't process the next order.", "error");
    } finally {
      setProcessing(false);
    }
  };

  const runLookup = async () => {
    if (!lookupKey.trim()) return;
    try {
      const d = await Api.dsaHash(lookupKey.trim());
      setData((prev) => ({ ...prev, hash: d }));
      setLookup(d.lookup);
    } catch (err) {
      push(err.userMessage || "Lookup failed.", "error");
    }
  };

  const queue = data.queue;
  const priority = data.priority;
  const hash = data.hash;

  return (
    <div>
      <div className="dash-header"><div><h1 style={{ fontSize: 26 }}>Data Structure Monitor</h1><p style={{ color: "var(--text-secondary)", marginTop: 4 }}>Live results from QuickBite's own Java data structures, run on this canteen's orders and menu.</p></div></div>

      <div className="tabs-row">
        <button className={`tab-btn ${tab === "queue" ? "active" : ""}`} onClick={() => setTab("queue")}>Order Queue</button>
        <button className={`tab-btn ${tab === "priority" ? "active" : ""}`} onClick={() => setTab("priority")}>Priority Orders</button>
        <button className={`tab-btn ${tab === "hash" ? "active" : ""}`} onClick={() => setTab("hash")}>Hash Tables</button>
      </div>

      <JavaBadge tab={tab} />
      {error && <div className="info-note" style={{ marginBottom: 16 }}>{error}</div>}

      {tab === "queue" && queue && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6, flexWrap: "wrap", gap: 10 }}>
            <span className="badge badge-normal">Queue Size: {queue.size}</span>
            <div style={{ display: "flex", gap: 10 }}>
              <button className="btn btn-outline btn-sm" onClick={() => push(queue.front ? `peek() → ${queue.front.id} (Table ${queue.front.tableNumber})` : "Queue is empty")}>Peek Next</button>
              <button className="btn btn-primary btn-sm" disabled={!queue.front || processing} onClick={processNext}>
                {processing ? "Processing…" : "Process Next"}
              </button>
            </div>
          </div>
          <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "6px 18px", marginTop: 14 }}>
            <div className="queue-track">
              <span className="endpoint-label">FRONT</span>
              <Icon name="chevronRight" className="queue-arrow" />
              {queue.items.length === 0 && <span style={{ color: "var(--text-secondary)", fontSize: 14 }}>Queue is empty</span>}
              {queue.items.map((o, i) => (
                <Fragment key={o.id}>
                  <div className={`queue-node ${i === 0 ? "front" : ""}`}>
                    <div className="qn-id">{o.id}</div>
                    <div className="qn-tag">{i === 0 ? "Next" : `Pos ${i + 1}`} · T{o.tableNumber}</div>
                  </div>
                  {i < queue.items.length - 1 && <Icon name="chevronRight" className="queue-arrow" />}
                </Fragment>
              ))}
              <Icon name="chevronRight" className="queue-arrow" />
              <span className="endpoint-label">REAR</span>
            </div>
          </div>
          <div className="info-note" style={{ marginTop: 16 }}>
            A singly linked list with head and tail pointers. New orders are enqueued at the rear; the kitchen serves from the front, so orders are handled first come, first served. Process Next calls dequeue() and starts preparing that order.
          </div>
        </div>
      )}

      {tab === "priority" && priority && (
        <div>
          <div style={{ marginBottom: 14 }}>
            <span className="badge badge-normal">Heap Size: {priority.size}</span>
            {priority.next && <span style={{ marginLeft: 10, fontSize: 14 }}>peek() → <strong>{priority.next.id}</strong> (Table {priority.next.tableNumber})</span>}
          </div>
          <div className="priority-col" style={{ marginBottom: 18 }}>
            <div className="priority-panel">
              <h4 style={{ color: "#991B1B" }}>High Priority</h4>
              {priority.high.length === 0 && <p style={{ color: "var(--text-secondary)", fontSize: 13.5 }}>No high priority orders.</p>}
              {priority.high.map((o) => <OrderCardMini key={o.id} order={o} />)}
            </div>
            <div className="priority-panel">
              <h4>Normal</h4>
              {priority.normal.length === 0 && <p style={{ color: "var(--text-secondary)", fontSize: 13.5 }}>No normal orders.</p>}
              {priority.normal.map((o) => <OrderCardMini key={o.id} order={o} />)}
            </div>
          </div>
          {priority.serveOrder.length > 0 && (
            <p style={{ fontSize: 13.5, color: "var(--text-secondary)", marginBottom: 12 }}>
              poll() order: {priority.serveOrder.map((o) => o.id).join(" → ")}
            </p>
          )}
          <div className="info-note">A binary min-heap: High priority comes out first, and arrival time breaks ties so equally urgent orders stay fair. To make an order High priority, open it from Pending Orders and tap Mark High Priority.</div>
        </div>
      )}

      {tab === "hash" && hash && (
        <div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 18 }}>
            <input
              style={{ flex: 1, minWidth: 200, padding: "12px 14px", borderRadius: 11, border: "1.5px solid var(--border)" }}
              placeholder="Look up a key, e.g. QB-1042 or upper-M001"
              value={lookupKey}
              onChange={(e) => setLookupKey(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && runLookup()}
            />
            <button className="btn btn-primary" onClick={runLookup}>get(key)</button>
          </div>
          {lookup && (
            <div className="info-note" style={{ marginBottom: 18 }}>
              {lookup.found
                ? <>Found <strong>{lookup.label}</strong> in {lookup.table}, bucket {lookup.bucket}, after {lookup.comparisons} key comparison{lookup.comparisons === 1 ? "" : "s"}.</>
                : <>"{lookup.key}" is not in either table. Its bucket ({lookup.bucket}) was checked with {lookup.comparisons} comparison{lookup.comparisons === 1 ? "" : "s"}.</>}
            </div>
          )}
          <div className="stat-grid" style={{ gridTemplateColumns: "1fr 1fr", marginBottom: 26 }}>
            {[hash.menu, hash.orders].map((t) => (
              <div className="stat-card" key={t.name}>
                <div className="stat-top"><span style={{ fontWeight: 800, fontSize: 15 }}>{t.name}</span></div>
                <div className="detail-row"><span className="lbl">Stored Items</span><span>{t.size}</span></div>
                <div className="detail-row"><span className="lbl">Buckets</span><span>{t.bucketCount}{t.resizes > 0 ? ` (started at ${t.initialBucketCount}, doubled ${t.resizes}×)` : ""}</span></div>
                <div className="detail-row"><span className="lbl">Load Factor</span><span>{t.loadFactor} (grows past {t.maxLoadFactor})</span></div>
                <div className="detail-row"><span className="lbl">Collisions</span><span>{t.collisions} (longest chain {t.longestChain})</span></div>
                <div className="detail-row"><span className="lbl">Collision Handling</span><span>Separate Chaining</span></div>
                <div className="detail-row"><span className="lbl">Lookup Key</span><span>{t.keyField}</span></div>
              </div>
            ))}
          </div>
          {[hash.orders, hash.menu].map((t) => (
            <Fragment key={t.name}>
              <h4 style={{ fontSize: 14, marginBottom: 12, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: ".04em" }}>{t.name} buckets</h4>
              <div className="bucket-grid" style={{ marginBottom: 26 }}>
                {t.buckets.map((chain, i) => (
                  <div className={`bucket ${lookup?.found && lookup.table === t.name && lookup.bucket === i ? "hit" : ""}`} key={i}>
                    <div className="bnum">Bucket {i}</div>
                    {chain.length === 0
                      ? <div style={{ color: "var(--text-secondary)", fontSize: 12 }}>empty</div>
                      : chain.map((label, j) => <div className="bitem" key={`${label}-${j}`}>→ {label}</div>)}
                  </div>
                ))}
              </div>
            </Fragment>
          ))}
        </div>
      )}
    </div>
  );
}
