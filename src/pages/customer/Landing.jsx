import Icon from "../../components/icons/Icon.jsx";
import SafeImg from "../../components/common/SafeImg.jsx";
import CanteenGrid from "../../components/customer/CanteenGrid.jsx";
import FoodCardPreview from "../../components/customer/FoodCardPreview.jsx";
import Footer from "../../components/layout/Footer.jsx";
import { IMG } from "../../data/images.js";
import { MENU_SEED } from "../../data/menu.js";

export default function Landing({ go }) {
  return (
    <div>
      <section className="hero">
        <div className="wrap hero-grid">
          <div>
            <span className="eyebrow-chip"><span className="dot" />Gyalpozhing College of IT · Dragon Block</span>
            <h1>Skip the Queue.<br />Enjoy Your <span className="accent">Bite.</span></h1>
            <p className="lead">Scan. Order. Collect. QuickBite lets you order from Upper and Lower Canteen straight from your phone, and pick it up the moment it's ready.</p>
            <div className="hero-actions">
              <button className="btn btn-primary" onClick={() => go("canteens")}>Start Ordering <Icon name="chevronRight" size={17} /></button>
              <button className="btn btn-outline" onClick={() => go("canteens")}>View Menu</button>
            </div>
          </div>
          <div className="hero-media">
            <SafeImg src={IMG.hero} alt="Fresh food spread ready to order" />
            <div className="float-card float-1">
              <span className="float-icon" style={{ background: "#FFF3E8", color: "var(--primary)" }}><Icon name="receipt" size={17} /></span>
              Order #QB-1042
            </div>
            <div className="float-card float-2">
              <span className="float-icon" style={{ background: "#EAF1FF", color: "#3B82F6" }}><Icon name="clock" size={17} /></span>
              Preparing your order
            </div>
            <div className="float-card float-3">
              <span className="float-icon" style={{ background: "var(--success-bg)", color: "var(--success)" }}><Icon name="checkCircle" size={17} /></span>
              Ready for collection
            </div>
          </div>
        </div>
      </section>

      <section className="section-tight">
        <div className="wrap">
          <div className="section-head">
            <h2>Choose your canteen</h2>
            <p>Both canteens are in Dragon Block, right on campus.</p>
          </div>
          <CanteenGrid go={go} />
        </div>
      </section>

      <section className="section" style={{ background: "#FBF8F1" }}>
        <div className="wrap">
          <div className="section-head">
            <h2>How QuickBite works</h2>
            <p>Four simple steps from hungry to fed.</p>
          </div>
          <div className="steps-grid">
            {[
              { n: "01", t: "Scan", d: "Scan the QR code posted at your canteen.", icon: "grid" },
              { n: "02", t: "Order", d: "Choose your favourite food and add it to your cart.", icon: "cart" },
              { n: "03", t: "Track", d: "Follow your order status in real time.", icon: "clock" },
              { n: "04", t: "Collect", d: "Pick up your food the moment it's ready.", icon: "bowl" },
            ].map((s) => (
              <div className="step-card" key={s.n}>
                <div className="step-num">{s.n}</div>
                <div className="step-icon"><Icon name={s.icon} size={22} stroke="var(--primary-deep)" /></div>
                <h4>{s.t}</h4>
                <p>{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-tight">
        <div className="wrap">
          <div className="section-head" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", maxWidth: "none", gap: 16, flexWrap: "wrap" }}>
            <div><h2>Popular today</h2><p>What most students are ordering right now.</p></div>
            <button className="btn btn-outline btn-sm" onClick={() => go("canteens")}>View Full Menu</button>
          </div>
          <div className="food-grid">
            {["M001", "M007", "M003", "M008"].map((id) => {
              const item = MENU_SEED.find((m) => m.id === id);
              return <FoodCardPreview key={id} item={item} />;
            })}
          </div>
        </div>
      </section>

      <section className="section" id="why">
        <div className="wrap">
          <div className="section-head"><h2>Why QuickBite</h2><p>Built for how students actually eat between classes.</p></div>
          <div className="feat-grid">
            <div className="feat-card">
              <div className="fi"><Icon name="clock" size={20} /></div>
              <h4>Skip the queue</h4>
              <p>Order digitally without waiting in the physical ordering line.</p>
            </div>
            <div className="feat-card">
              <div className="fi"><Icon name="cart" size={20} /></div>
              <h4>Simple ordering</h4>
              <p>Browse the menu and order in just a few steps.</p>
            </div>
            <div className="feat-card">
              <div className="fi"><Icon name="map" size={20} /></div>
              <h4>Easy tracking</h4>
              <p>Know when your order is being prepared and completed.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-tight">
        <div
          className="wrap"
          style={{ background: "var(--dark)", borderRadius: 28, padding: "52px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 24 }}
        >
          <div>
            <h2 style={{ color: "#fff", fontSize: 28, marginBottom: 8 }}>Hungry already?</h2>
            <p style={{ color: "rgba(255,255,255,.7)" }}>Your food is a few taps away.</p>
          </div>
          <button className="btn btn-primary" onClick={() => go("canteens")}>Start Ordering <Icon name="chevronRight" size={17} /></button>
        </div>
      </section>

      <Footer go={go} />
    </div>
  );
}
