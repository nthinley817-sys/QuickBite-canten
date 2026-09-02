export default function PriorityBadge({ priority }) {
  return (
    <span className={`badge ${priority === "High" ? "badge-high" : "badge-normal"}`}>
      {priority === "High" ? "High Priority" : "Normal"}
    </span>
  );
}
