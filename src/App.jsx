import { useState, useEffect } from "react";

import { Api, setStaffToken } from "./services/api.js";
import { CANTEENS } from "./data/canteens.js";
import { useToasts } from "./hooks/useToasts.js";
import { nextStatus } from "./utils/format.js";

import Navbar from "./components/layout/Navbar.jsx";
import Footer from "./components/layout/Footer.jsx";
import ToastHost from "./components/common/ToastHost.jsx";
import Modal from "./components/common/Modal.jsx";
import Icon from "./components/icons/Icon.jsx";
import FoodDetailModal from "./components/customer/FoodDetailModal.jsx";
import StaffShell from "./components/staff/StaffShell.jsx";
import OrderDetailsModal from "./components/staff/OrderDetailsModal.jsx";

import Landing from "./pages/customer/Landing.jsx";
import CanteenSelect from "./pages/customer/CanteenSelect.jsx";
import MenuPage from "./pages/customer/MenuPage.jsx";
import CartPage from "./pages/customer/CartPage.jsx";
import OrderConfirmation from "./pages/customer/OrderConfirmation.jsx";
import OrderTracking from "./pages/customer/OrderTracking.jsx";

import StaffLogin from "./pages/staff/StaffLogin.jsx";
import StaffDashboard from "./pages/staff/StaffDashboard.jsx";
import OrderListPage from "./pages/staff/OrderListPage.jsx";
import MenuManagement from "./pages/staff/MenuManagement.jsx";
import SearchSortDemo from "./pages/staff/SearchSortDemo.jsx";
import DataStructuresDemo from "./pages/staff/DataStructuresDemo.jsx";

const STAFF_VIEWS = ["staffDashboard", "staffPending", "staffProcessing", "staffCompleted", "staffMenu", "staffSearchSort", "staffDataStructures"];

const ORDER_POLL_MS = 8000;

const STAFF_SESSION_KEY = "qb_staff_session";
const savedStaffSession = (() => {
  try {
    const s = JSON.parse(localStorage.getItem(STAFF_SESSION_KEY));
    // Sessions saved before staff tokens existed can't call the API; treat them as signed out.
    return s && s.token ? s : null;
  } catch {
    return null;
  }
})();
setStaffToken(savedStaffSession?.token ?? null);

export default function App() {
  const [view, setView] = useState(savedStaffSession ? "staffDashboard" : "landing");
  const [menuItems, setMenuItems] = useState([]);
  const [loadingMenu, setLoadingMenu] = useState(true);
  const [orders, setOrders] = useState([]);
  const [canteenId, setCanteenId] = useState("upper");
  const [cart, setCart] = useState([]); // { id, qty, note }
  const [tableNumber, setTableNumber] = useState(null);
  const [detailItem, setDetailItem] = useState(null);
  const [currentOrder, setCurrentOrder] = useState(null); // last placed order id
  const [staffOrderDetail, setStaffOrderDetail] = useState(null);
  const [deletingOrder, setDeletingOrder] = useState(null);
  const [staffAuthed, setStaffAuthed] = useState(!!savedStaffSession);
  const [staffCanteenId, setStaffCanteenId] = useState(savedStaffSession?.canteenId ?? null);
  const { toasts, push } = useToasts();

  const activeCanteenId = staffAuthed ? staffCanteenId : canteenId;

  useEffect(() => {
    if (!activeCanteenId) return;
    setLoadingMenu(true);
    Api.getMenu(activeCanteenId)
      .then((d) => {
        setTimeout(() => { setMenuItems(d); setLoadingMenu(false); }, 500);
      })
      .catch((err) => {
        console.error(err);
        setMenuItems([]);
        setLoadingMenu(false);
        push("Couldn't load the menu. Is the backend running?", "error");
      });
  }, [activeCanteenId]);

  // Staff get their canteen's order list; customers only ever see the order
  // they placed, fetched by id.
  const loadStaffOrders = () =>
    Api.getOrders().then((d) => setOrders(d)).catch((err) => {
      if (err.status === 401) endStaffSession("Your session has expired. Please log in again.");
    });
  const loadTrackedOrder = () => {
    if (!currentOrder) return Promise.resolve();
    return Api.getOrderById(currentOrder).then((o) =>
      setOrders((list) => [o, ...list.filter((x) => x.id !== o.id)]));
  };

  useEffect(() => {
    if (staffAuthed) loadStaffOrders();
  }, [staffAuthed]);

  // Keep orders live while someone is watching them: staff see new orders
  // arrive, customers see their status change, without reloading the page.
  const watching = STAFF_VIEWS.includes(view) ? "staff" : (view === "tracking" || view === "confirmation") ? "customer" : null;
  useEffect(() => {
    if (!watching) return;
    const id = setInterval(() => {
      if (document.hidden) return;
      if (watching === "staff") loadStaffOrders();
      else loadTrackedOrder().catch(() => { /* try again next tick */ });
    }, ORDER_POLL_MS);
    return () => clearInterval(id);
  }, [watching, currentOrder]);

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

  const placeOrder = async () => {
    if (!tableNumber) {
      push("Please select your table number.", "error");
      return;
    }
    // The backend assigns the order id, looks up names/prices and works out
    // the total itself - we only say what was ordered and where.
    const newOrder = {
      canteenId,
      tableNumber,
      items: cart.map((c) => ({ menuItemId: c.id, qty: c.qty })),
    };
    try {
      const saved = await Api.createOrder(newOrder);
      setOrders((o) => [saved, ...o]);
      setCurrentOrder(saved.id);
      setCart([]);
      setTableNumber(null);
      push("Order placed successfully.", "success");
      go("confirmation");
    } catch (err) {
      push(err.userMessage || "Failed to place order. Please try again.", "error");
    }
  };

  const staffLogin = async (staffId, password) => {
    try {
      const res = await Api.staffLogin(staffId, password);
      if (res.success) {
        setStaffToken(res.token);
        setStaffAuthed(true);
        setStaffCanteenId(res.canteenId);
        localStorage.setItem(STAFF_SESSION_KEY, JSON.stringify({ canteenId: res.canteenId, token: res.token }));
        go("staffDashboard");
        push("Welcome back!", "success");
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };
  function endStaffSession(message) {
    setStaffToken(null);
    setStaffAuthed(false);
    setStaffCanteenId(null);
    setOrders([]);
    localStorage.removeItem(STAFF_SESSION_KEY);
    go("staffLogin");
    push(message);
  }
  const staffLogout = () => endStaffSession("Signed out.");
  // Any staff action that comes back 401 means the token expired or is invalid.
  const staffActionFailed = (err, fallback) => {
    if (err.status === 401) endStaffSession("Your session has expired. Please log in again.");
    else push(err.userMessage || fallback, "error");
  };

  const advanceOrderStatus = async (id) => {
    const order = orders.find((o) => o.id === id);
    if (!order) return;
    const newStatus = nextStatus[order.status];
    try {
      await Api.updateOrderStatus(id, newStatus);
      setOrders((list) => list.map((o) => (o.id === id ? { ...o, status: newStatus } : o)));
      push(`Order marked as ${newStatus}.`, "success");
    } catch (err) {
      staffActionFailed(err, "Failed to update order status.");
    }
  };

  const refreshOrders = async () => {
    try {
      await loadTrackedOrder();
    } catch {
      push("Failed to refresh order status.", "error");
    }
  };

  const deleteOrder = async (id) => {
    try {
      await Api.deleteOrder(id);
      setOrders((list) => list.filter((o) => o.id !== id));
      setDeletingOrder(null);
      setStaffOrderDetail(null);
      push("Order removed.", "success");
    } catch (err) {
      staffActionFailed(err, "Failed to remove order.");
    }
  };

  const trackedOrder = orders.find((o) => o.id === currentOrder);
  const isStaff = STAFF_VIEWS.includes(view);
  const isStaffLogin = view === "staffLogin";
  const staffOrders = orders.filter((o) => o.canteenId === staffCanteenId);

  let body;
  if (isStaffLogin) {
    body = <StaffLogin go={go} onLogin={staffLogin} />;
  } else if (isStaff) {
    const staffCanteenName = CANTEENS.find((c) => c.id === staffCanteenId)?.name;
    body = (
      <StaffShell view={view} go={go} orders={staffOrders} onLogout={staffLogout} canteenName={staffCanteenName}>
        {view === "staffDashboard" && <StaffDashboard orders={staffOrders} go={go} />}
        {view === "staffPending" && (
          <OrderListPage title="Pending Orders" subtitle="New orders waiting to be started." orders={staffOrders} status="Pending"
            advance={advanceOrderStatus} actionLabel="Start Preparing" openDetails={setStaffOrderDetail} />
        )}
        {view === "staffProcessing" && (
          <OrderListPage title="Processing Orders" subtitle="Orders currently being prepared." orders={staffOrders} status="Processing"
            advance={advanceOrderStatus} actionLabel="Mark Completed" openDetails={setStaffOrderDetail} />
        )}
        {view === "staffCompleted" && (
          <OrderListPage title="Completed Orders" subtitle="Orders ready or already collected." orders={staffOrders} status="Completed"
            advance={advanceOrderStatus} actionLabel={null} openDetails={setStaffOrderDetail} onDelete={setDeletingOrder} />
        )}
        {view === "staffMenu" && (
          <MenuManagement menuItems={menuItems} setMenuItems={setMenuItems} push={push} canteenId={staffCanteenId}
            onActionFailed={staffActionFailed} />
        )}
        {view === "staffSearchSort" && <SearchSortDemo orders={staffOrders} />}
        {view === "staffDataStructures" && <DataStructuresDemo orders={staffOrders} menuItems={menuItems} push={push} />}
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
            <Footer go={go} staffAuthed={staffAuthed} />
          </>
        )}
        {view === "menu" && (
          <>
            <MenuPage menuItems={menuItems} canteenId={canteenId} cart={cart} addToCart={addToCart} updateQty={updateQty}
              go={go} openDetail={setDetailItem} loading={loadingMenu} />
            <Footer go={go} staffAuthed={staffAuthed} />
          </>
        )}
        {view === "cart" && (
          <>
            <CartPage cart={cart} menuItems={menuItems} updateQty={updateQty} removeItem={removeItem} go={go} placeOrder={placeOrder}
              tableNumber={tableNumber} setTableNumber={setTableNumber} />
            <Footer go={go} staffAuthed={staffAuthed} />
          </>
        )}
        {view === "confirmation" && (
          <>
            <OrderConfirmation order={trackedOrder} go={go} />
            <Footer go={go} staffAuthed={staffAuthed} />
          </>
        )}
        {view === "tracking" && (
          <>
            <OrderTracking order={trackedOrder} onRefresh={refreshOrders} go={go} />
            <Footer go={go} staffAuthed={staffAuthed} />
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
          onDelete={(order) => { setStaffOrderDetail(null); setDeletingOrder(order); }}
        />
      )}
      {deletingOrder && (
        <Modal onClose={() => setDeletingOrder(null)} maxWidth={420}>
          <div style={{ padding: 28, textAlign: "center" }}>
            <div className="empty-state" style={{ padding: 0 }}>
              <div className="glyph" style={{ background: "var(--error-bg)", color: "var(--error)" }}><Icon name="trash" size={30} /></div>
              <h3>Remove order for Table {deletingOrder.tableNumber}?</h3>
              <p>This permanently deletes the order record. This can't be undone.</p>
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => setDeletingOrder(null)}>Cancel</button>
              <button className="btn btn-danger" style={{ flex: 1 }} onClick={() => deleteOrder(deletingOrder.id)}>Delete</button>
            </div>
          </div>
        </Modal>
      )}
      <ToastHost toasts={toasts} />
    </div>
  );
}
