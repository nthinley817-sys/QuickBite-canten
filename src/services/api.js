// Mock service layer. Every function here returns a Promise, matching the
// shape a real fetch() call to the future Java backend would have.
// Swap the body of each function for a real API call when the backend is ready —
// no component code needs to change, since components only ever call these.
import { MENU_SEED } from "../data/menu.js";
import { ORDERS_SEED } from "../data/orders.js";

export const Api = {
  getMenu: () => Promise.resolve(MENU_SEED),
  getOrders: () => Promise.resolve(ORDERS_SEED),
  getOrderById: (id, orders) => orders.find((o) => o.id === id),
  createOrder: (order) => Promise.resolve(order),
  updateOrderStatus: (id, status) => Promise.resolve({ id, status }),
  updateMenuItem: (item) => Promise.resolve(item),
};
