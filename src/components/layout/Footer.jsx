import Logomark from "../icons/Logomark.jsx";

export default function Footer({ go }) {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-grid">
          <div>
            <div className="brand" style={{ color: "#fff", marginBottom: 12 }}>
              <Logomark /> QuickBite
            </div>
            <p style={{ maxWidth: 220 }}>Smart ordering for a better canteen experience.</p>
          </div>
          <div>
            <h5>Links</h5>
            <a onClick={() => go("landing")} style={{ cursor: "pointer" }}>Home</a>
            <a onClick={() => go("canteens")} style={{ cursor: "pointer" }}>Menu</a>
            <a onClick={() => go("tracking")} style={{ cursor: "pointer" }}>My Order</a>
            <a onClick={() => go("staffDashboard")} style={{ cursor: "pointer" }}>Staff</a>
          </div>
          <div>
            <h5>Location</h5>
            <p>Gyalpozhing College of Information Technology</p>
            <p>Dragon Block</p>
          </div>
          <div>
            <h5>Canteens</h5>
            <p>Upper Canteen</p>
            <p>Lower Canteen</p>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 QuickBite</span>
          <span>Frontend prototype · Java backend integration ready</span>
        </div>
      </div>
    </footer>
  );
}
