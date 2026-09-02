import { useState, useEffect, useRef } from "react";

import { Api } from "./services/api.js";
import { CANTEENS } from "./data/canteens.js";
import { useToasts } from "./hooks/useToasts.js";
import { nextStatus } from "./utils/format.js";

import Icon from "./components/icons/Icon.jsx";
import Navbar from "./components/layout/Navbar.jsx";
import Footer from "./components/layout/Footer.jsx";
import ToastHost from "./components/common/ToastHost.jsx";
import FoodDetailModal from "./components/customer/FoodDetailModal.jsx";
import StaffShell from "./components/staff/StaffShell.jsx";
import OrderDetailsModal from "./components/staff/OrderDetailsModal.jsx";

import Landing from "./pages/customer/Landing.jsx";
import CanteenSelect from "./pages/customer/CanteenSelect.jsx";
import MenuPage from "./pages/customer/MenuPage.jsx";
import CartPage from "./pages/customer/CartPage.jsx";
import OrderConfirmation from "./pages/customer/OrderConfirmation.jsx";
import OrderTracking from "./pages/customer/OrderTracking.jsx";

import StaffDashboard from "./pages/staff/StaffDashboard.jsx";
import OrderListPage from "./pages/staff/OrderListPage.jsx";
import MenuManagement from "./pages/staff/MenuManagement.jsx";
import SearchSortDemo from "./pages/staff/SearchSortDemo.jsx";
import DataStructuresDemo from "./pages/staff/DataStructuresDemo.jsx";

const STAFF_VIEWS = ["staffDashboard", "staffPending", "staffProcessing", "staffCompleted", "staffMenu", "staffSearchSort", "staffDataStructures"];

export default function App() {
  const [view, setView] = useState("landing");
  const [menuItems, setMenuItems] = useState([]);
  const [loadingMenu, setLoadingMenu] = useState(true);
  const [orders, setOrders] = useState([]);
  const [canteenId, setCanteenId] = useState("upper");
  const [cart, setCart] = useState([]); // { id, qty, note }
  const [detailItem, setDetailItem] = useState(null);
  const [currentOrder, setCurrentOrder] = useState(null); // last placed order id
  const [staffOrderDetail, setStaffOrderDetail] = useState(null);
  const { toasts, push } = useToasts();
  const orderCounter = useRef(1042);

  useEffect(() => {
    Api.getMenu().then((d) => {
      setTimeout(() => { setMenuItems(d); setLoadingMenu(false); }, 500);
    });
    Api.getOrders().then((d) => setOrders(d));
  }, []);

  const go = (v, opts) => {
    setView(v);
    window.scrollTo({ top: 0, behavior: "instant" });
    if (opts && opts.canteen) setCanteenId(opts.canteen);
  };

  const addToCart = (item, qty = 1, note = "") => {
    setCart((c) => {
      const existing = c.find((x) => x.id === item.id);
      if (existing) return c.map((x) => (x.id === item.id ? { ...x, qty: x.qty + qty, note: note || x.note } : x));
      return [...c, { id: item.id, qty, note }];
    });
    push(`Added ${item.name} to cart.`);
  };
  const updateQty = (id, delta) => {
    setCart((c) => c.map((x) => (x.id === id ? { ...x, qty: x.qty + delta } : x)).filter((x) => x.qty > 0));
  };
  const removeItem = (id) => setCart((c) => c.filter((x) => x.id !== id));
  const cartCount = cart.reduce((s, c) => s + c.qty, 0);

  const placeOrder = () => {
    const items = cart.map((c) => {
      const m = menuItems.find((mm) => mm.id === c.id);
      return { name: m.name, qty: c.qty };
    });
    const total = cart.reduce((s, c) => {
      const m = menuItems.find((mm) => mm.id === c.id);
      return s + m.price * c.qty;
    }, 0);
    orderCounter.current += 1;
    const id = "QB-" + orderCounter.current;
    const newOrder = {
      id,
      canteen: CANTEENS.find((c) => c.id === canteenId).name,
      items,
      total,
      status: "Pending",
      priority: "Normal",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setOrders((o) => [newOrder, ...o]);
    setCurrentOrder(id);
    setCart([]);
    push("Order placed successfully.", "success");
    go("confirmation");
  };

  const advanceOrderStatus = (id) => {
    const order = orders.find((o) => o.id === id);
    setOrders((list) => list.map((o) => (o.id === id ? { ...o, status: nextStatus[o.status] } : o)));
    if (order) push(`Order marked as ${nextStatus[order.status]}.`, "success");
  };

  const trackedOrder = orders.find((o) => o.id === currentOrder);
  const isStaff = STAFF_VIEWS.includes(view);

  let body;
  if (isStaff) {
    body = (
      <StaffShell view={view} go={go} orders={orders}>
        {view === "staffDashboard" && <StaffDashboard orders={orders} go={go} />}
        {view === "staffPending" && (
          <OrderListPage title="Pending Orders" subtitle="New orders waiting to be started." orders={orders} status="Pending"
            advance={advanceOrderStatus} actionLabel="Start Preparing" openDetails={setStaffOrderDetail} />
        )}
        {view === "staffProcessing" && (
          <OrderListPage title="Processing Orders" subtitle="Orders currently being prepared." orders={orders} status="Processing"
            advance={advanceOrderStatus} actionLabel="Mark Completed" openDetails={setStaffOrderDetail} />
        )}
        {view === "staffCompleted" && (
          <OrderListPage title="Completed Orders" subtitle="Orders ready or already collected." orders={orders} status="Completed"
            advance={advanceOrderStatus} actionLabel={null} openDetails={setStaffOrderDetail} />
        )}
        {view === "staffMenu" && <MenuManagement menuItems={menuItems} setMenuItems={setMenuItems} push={push} />}
        {view === "staffSearchSort" && <SearchSortDemo orders={orders} />}
        {view === "staffDataStructures" && <DataStructuresDemo orders={orders} menuItems={menuItems} push={push} />}
      </StaffShell>
    );
  } else {
    body = (
      <div>
        <Navbar cartCount={cartCount} go={go} view={view} onOpenCart={() => go("cart")} />
        {view === "landing" && <Landing go={go} />}
        {view === "canteens" && (
          <>
            <CanteenSelect go={go} />
            <Footer go={go} />
          </>
        )}
        {view === "menu" && (
          <>
            <MenuPage menuItems={menuItems} canteenId={canteenId} cart={cart} addToCart={addToCart} updateQty={updateQty}
              go={go} openDetail={setDetailItem} loading={loadingMenu} />
            <Footer go={go} />
          </>
        )}
        {view === "cart" && (
          <>
            <CartPage cart={cart} menuItems={menuItems} updateQty={updateQty} removeItem={removeItem} go={go} placeOrder={placeOrder} />
            <Footer go={go} />
          </>
        )}
        {view === "confirmation" && (
          <>
            <OrderConfirmation order={trackedOrder} go={go} />
            <Footer go={go} />
          </>
        )}
        {view === "tracking" && (
          <>
            <OrderTracking order={trackedOrder} onRefresh={() => advanceOrderStatus(trackedOrder.id)} go={go} />
            <Footer go={go} />
          </>
        )}
      </div>
    );
  }

  return (
    <div>
      {body}
      {detailItem && <FoodDetailModal item={detailItem} onClose={() => setDetailItem(null)} onAdd={addToCart} />}
      {staffOrderDetail && (
        <OrderDetailsModal
          order={staffOrderDetail}
          onClose={() => setStaffOrderDetail(null)}
          advance={(id) => { advanceOrderStatus(id); setStaffOrderDetail(null); }}
        />
      )}
      <ToastHost toasts={toasts} />
      <button className="mode-toggle" onClick={() => go(isStaff ? "landing" : "staffDashboard")}>
        <Icon name={isStaff ? "home" : "settings"} size={15} /> {isStaff ? "Customer View" : "Staff View"}
      </button>
    </div>
  );
}
