import Icon from "../icons/Icon.jsx";

export default function EmptyState({ icon = "cart", title, text, action }) {
  return (
    <div className="empty-state">
      <div className="glyph">
        <Icon name={icon} size={34} />
      </div>
      <h3>{title}</h3>
      <p>{text}</p>
      {action}
    </div>
  );
}
