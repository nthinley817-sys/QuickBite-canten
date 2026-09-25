// Service layer that talks to the Java (Spring Boot) + MySQL backend in
// ../backend. Every function here returns a Promise, and no component code
// needs to change — components only ever call these.
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`API ${path} failed (${res.status}): ${body || res.statusText}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

export const Api = {
  getMenu: (canteenId) => request(canteenId ? `/menu?canteen=${encodeURIComponent(canteenId)}` : "/menu"),
  getOrders: () => request("/orders"),
  getOrderById: (id, orders) => orders.find((o) => o.id === id),
  createOrder: (order) => request("/orders", { method: "POST", body: JSON.stringify(order) }),
  updateOrderStatus: (id, status) =>
    request(`/orders/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) }),
  createMenuItem: (item) => request("/menu", { method: "POST", body: JSON.stringify(item) }),
  updateMenuItem: (item) => request(`/menu/${item.id}`, { method: "PUT", body: JSON.stringify(item) }),
  deleteMenuItem: (id) => request(`/menu/${id}`, { method: "DELETE" }),
  staffLogin: (staffId, password) =>
    request("/staff/login", { method: "POST", body: JSON.stringify({ staffId, password }) }),
};
