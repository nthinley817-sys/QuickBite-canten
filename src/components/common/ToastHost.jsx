import Icon from "../icons/Icon.jsx";

export default function ToastHost({ toasts }) {
  return (
    <div className="toast-wrap">
      {toasts.map((t) => (
        <div key={t.id} className={`toast ${t.type}`}>
          <span className="tick">
            <Icon name="check" size={12} stroke="#fff" />
          </span>
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
}
