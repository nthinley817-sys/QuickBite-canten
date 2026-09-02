export default function AvailBadge({ available }) {
  return (
    <span className={`badge ${available ? "badge-avail" : "badge-unavail"}`}>
      <span className="bdot" style={{ background: available ? "var(--success)" : "var(--text-secondary)" }} />
      {available ? "Available" : "Unavailable"}
    </span>
  );
}
