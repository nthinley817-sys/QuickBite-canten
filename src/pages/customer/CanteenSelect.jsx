import CanteenGrid from "../../components/customer/CanteenGrid.jsx";

export default function CanteenSelect({ go }) {
  return (
    <div className="wrap section-tight">
      <div className="section-head">
        <h2>Select a canteen</h2>
        <p>Choose where you'd like to order from.</p>
      </div>
      <CanteenGrid go={go} />
    </div>
  );
}
