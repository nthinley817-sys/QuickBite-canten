import { useState } from "react";
import Icon from "../../components/icons/Icon.jsx";
import Logomark from "../../components/icons/Logomark.jsx";

export default function StaffLogin({ go, onLogin }) {
  const [staffId, setStaffId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    // Small delay so the button's loading state is visible — mirrors the
    // latency a real auth request would have.
    setTimeout(() => {
      const ok = onLogin(staffId, password);
      if (!ok) setError("Incorrect staff ID or password.");
      setSubmitting(false);
    }, 400);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--dark)",
        padding: "24px",
      }}
    >
      <div style={{ width: "100%", maxWidth: 400 }}>
        <div className="brand" style={{ color: "#fff", justifyContent: "center", marginBottom: 26, fontSize: 21 }}>
          <Logomark size={40} /> QuickBite
        </div>

        <div style={{ background: "#fff", borderRadius: "var(--radius-lg)", padding: "32px 28px", boxShadow: "var(--shadow-lg)" }}>
          <div className="eyebrow-chip" style={{ marginBottom: 10 }}>
            <span className="dot" /> Staff Console
          </div>
          <h2 style={{ fontSize: 23, marginBottom: 6 }}>Sign in to continue</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: 14, marginBottom: 24, lineHeight: 1.5 }}>
            Access the kitchen dashboard to manage orders and menu items.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="staffId">Staff ID</label>
              <input
                id="staffId"
                type="text"
                placeholder="e.g. staff"
                value={staffId}
                onChange={(e) => setStaffId(e.target.value)}
                autoFocus
                autoComplete="username"
                required
              />
            </div>
            <div className="field" style={{ marginBottom: 8 }}>
              <label htmlFor="password">Password</label>
              <div style={{ position: "relative" }}>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                  style={{ paddingRight: 44 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  style={{
                    position: "absolute", right: 5, top: "50%", transform: "translateY(-50%)",
                    background: "none", border: "none", color: "var(--text-secondary)",
                    width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >
                  <Icon name={showPassword ? "eyeOff" : "eye"} size={18} />
                </button>
              </div>
            </div>

            {error && (
              <p style={{ color: "var(--error)", fontSize: 13, fontWeight: 600, margin: "4px 0 14px" }}>
                {error}
              </p>
            )}

            <button type="submit" className="btn btn-primary btn-block" disabled={submitting} style={{ marginTop: 6 }}>
              <Icon name="lock" size={16} /> {submitting ? "Signing in…" : "Sign In"}
            </button>
          </form>

          <div className="info-note" style={{ marginTop: 20 }}>
            <strong>Demo access</strong> — Staff ID: <strong>staff</strong> · Password: <strong>staff123</strong>
          </div>
        </div>

        <button
          className="btn btn-ghost"
          style={{ color: "rgba(255,255,255,.75)", margin: "18px auto 0" }}
          onClick={() => go("landing")}
        >
          <Icon name="home" size={16} /> Back to Customer Site
        </button>
      </div>
    </div>
  );
}
