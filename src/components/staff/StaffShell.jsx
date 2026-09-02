import { useState, Fragment } from "react";
import Icon from "../icons/Icon.jsx";
import Logomark from "../icons/Logomark.jsx";

export const STAFF_NAV = [
  { id: "staffDashboard", label: "Dashboard", icon: "grid" },
  { id: "staffPending", label: "Pending Orders", icon: "clock" },
  { id: "staffProcessing", label: "Processing", icon: "refresh" },
  { id: "staffCompleted", label: "Completed", icon: "checkCircle" },
  { id: "staffMenu", label: "Menu Management", icon: "list" },
  { id: "staffSearchSort", label: "Search & Sort", icon: "search" },
  { id: "staffDataStructures", label: "Data Structures", icon: "layers" },
];

export default function StaffShell({ view, go, children, orders }) {
  const [drawer, setDrawer] = useState(false);
  const pendingCount = orders.filter((o) => o.status === "Pending").length;
  return (
    <div className="staff-shell">
      <aside className="staff-sidebar">
        <a className="brand" onClick={() => go("staffDashboard")} style={{ cursor: "pointer" }}><Logomark /> QuickBite</a>
        {STAFF_NAV.map((n) => (
          <a key={n.id} className={`side-link ${view === n.id ? "active" : ""}`} onClick={() => go(n.id)}>
            <Icon name={n.icon} size={17} /> {n.label}
            {n.id === "staffPending" && pendingCount > 0 && (
              <span style={{ marginLeft: "auto", background: "rgba(255,255,255,.2)", borderRadius: 999, fontSize: 11, padding: "1px 8px" }}>{pendingCount}</span>
            )}
          </a>
        ))}
        <div className="side-foot">
          <a className="side-link" onClick={() => go("landing")}><Icon name="home" size={17} /> Exit to Customer View</a>
          <a className="side-link"><Icon name="settings" size={17} /> Settings</a>
          <div className="side-link" style={{ cursor: "default" }}><Icon name="user" size={17} /> Canteen Team</div>
        </div>
      </aside>

      <main className="staff-main">
        <div className="staff-topbar">
          <div className="wrap" style={{ padding: "0 24px", display: "flex", alignItems: "center", gap: 14 }}>
            <button className="hamburger mobile-only" style={{ display: "none" }} onClick={() => setDrawer(true)} aria-label="Open menu"><Icon name="menu" size={19} /></button>
            <div className="brand mobile-only" style={{ display: "none", fontSize: 16 }}><Logomark size={30} /> QuickBite Staff</div>
            <div className="desktop-only" style={{ fontWeight: 700, fontSize: 15, color: "var(--text-secondary)" }}>Staff Console</div>
          </div>
        </div>
        <div className="staff-content wrap" style={{ padding: "32px 24px 60px" }}>
          {children}
        </div>
      </main>

      {drawer && (
        <Fragment>
          <div className="staff-drawer-backdrop" onClick={() => setDrawer(false)} />
          <div className="staff-drawer">
            <div className="brand" style={{ color: "#fff", marginBottom: 24 }}><Logomark /> QuickBite</div>
            {STAFF_NAV.map((n) => (
              <a key={n.id} className={`side-link ${view === n.id ? "active" : ""}`} onClick={() => { go(n.id); setDrawer(false); }}>
                <Icon name={n.icon} size={17} /> {n.label}
              </a>
            ))}
            <div className="side-foot">
              <a className="side-link" onClick={() => { go("landing"); setDrawer(false); }}><Icon name="home" size={17} /> Exit to Customer View</a>
            </div>
          </div>
        </Fragment>
      )}

      <nav className="staff-mobile-nav">
        {STAFF_NAV.slice(0, 5).map((n) => (
          <a key={n.id} className={view === n.id ? "active" : ""} onClick={() => go(n.id)}>
            <Icon name={n.icon} size={19} />{n.label.split(" ")[0]}
          </a>
        ))}
      </nav>
    </div>
  );
}
