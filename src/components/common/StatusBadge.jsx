export default function StatusBadge({ status }) {
  const map = { Pending: "badge-pending", Processing: "badge-processing", Completed: "badge-completed" };
  return (
    <span className={`badge ${map[status]}`}>
      <span className="bdot" />
      {status}
    </span>
  );
}
