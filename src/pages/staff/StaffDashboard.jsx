import OrderCardMini from "../../components/staff/OrderCardMini.jsx";
import Icon from "../../components/icons/Icon.jsx";

export default function StaffDashboard({ orders, go }) {
  const pending = orders.filter((o) => o.status === "Pending").length;
  const processing = orders.filter((o) => o.status === "Processing").length;
  const completed = orders.filter((o) => o.status === "Completed").length;
  const total = orders.length;
  const stats = [
    { label: "Pending Orders", value: pending, icon: "clock", color: "#F59E0B", bg: "#FFF8EB", trend: "Needs action", tcolor: "#92400E", tbg: "#FFF3D6", view: "staffPending" },
    { label: "Processing", value: processing, icon: "refresh", color: "#3B82F6", bg: "#EAF1FF", trend: "In kitchen", tcolor: "#1E40AF", tbg: "#DCE9FF", view: "staffProcessing" },
    { label: "Completed Today", value: completed, icon: "checkCircle", color: "#16A34A", bg: "#EFFCF3", trend: "Collected", tcolor: "#166534", tbg: "#DFF6E6", view: "staffCompleted" },
    { label: "Total Orders", value: total, icon: "receipt", color: "#171717", bg: "#F1F1EE", trend: "All time today", tcolor: "#404040", tbg: "#EDEDED", view: "staffDashboard" },
  ];
  return (
    <div>
      <div className="dash-header">
        <div>
          <h1 style={{ fontSize: 28 }}>Good afternoon, Canteen Team</h1>
          <p style={{ color: "var(--text-secondary)", marginTop: 6 }}>Here's what's happening with today's orders.</p>
        </div>
      </div>
      <div className="stat-grid" style={{ marginBottom: 36 }}>
        {stats.map((s) => (
          <div className="stat-card" key={s.label} style={{ cursor: "pointer" }} onClick={() => go(s.view)}>
            <div className="stat-top">
              <span className="stat-icon" style={{ background: s.bg, color: s.color }}>
                <Icon name={s.icon} size={19} />
              </span>
              <span className="stat-trend" style={{ background: s.tbg, color: s.tcolor }}>{s.trend}</span>
            </div>
            <div className="stat-num">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
        <h3 style={{ fontSize: 19 }}>Needs attention</h3>
        <a onClick={() => go("staffPending")} style={{ cursor: "pointer", fontSize: 13.5, fontWeight: 700, color: "var(--primary-deep)" }}>View all pending →</a>
      </div>
      <div className="orders-list">
        {orders.filter((o) => o.status === "Pending").slice(0, 3).map((o) => (
          <OrderCardMini key={o.id} order={o} onClick={() => go("staffPending")} />
        ))}
        {pending === 0 && <p style={{ color: "var(--text-secondary)" }}>No pending orders right now — nice work!</p>}
      </div>
    </div>
  );
}
