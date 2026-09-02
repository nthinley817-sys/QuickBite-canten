export default function Skeleton({ count = 8 }) {
  return (
    <div className="food-grid">
      {Array.from({ length: count }).map((_, i) => (
        <div className="skel-card" key={i}>
          <div className="skel" />
          <div className="p">
            <div className="skel skel-line" style={{ width: "60%" }} />
            <div className="skel skel-line" style={{ width: "90%" }} />
            <div className="skel skel-line" style={{ width: "40%" }} />
          </div>
        </div>
      ))}
    </div>
  );
}
