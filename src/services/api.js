// Service layer that talks to the Java (Spring Boot) + MySQL backend in
// ../backend. Every function here returns a Promise, and no component code
// needs to change — components only ever call these.
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

// Token from POST /staff/login. Staff-only endpoints reject requests without it.
let staffToken = null;
export const setStaffToken = (token) => { staffToken = token; };

async function request(path, options = {}) {
  const headers = { "Content-Type": "application/json" };
  if (staffToken) headers.Authorization = `Bearer ${staffToken}`;
  const res = await fetch(`${BASE_URL}${path}`, { headers, ...options });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    // The backend sends {"error": "..."} for validation failures; surface that
    // message so the UI can show it instead of a generic one.
    let message = "";
    try { message = JSON.parse(body).error || ""; } catch { /* not JSON */ }
    const err = new Error(message || `API ${path} failed (${res.status}): ${body || res.statusText}`);
    err.status = res.status;
    err.userMessage = message || null;
    throw err;
  }
  if (res.status === 204) return null;
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

export const Api = {
  getMenu: (canteenId) => request(canteenId ? `/menu?canteen=${encodeURIComponent(canteenId)}` : "/menu"),
  // Staff only: returns the signed-in staff member's canteen orders.
  getOrders: () => request("/orders"),
  // Public: customers track their own order by id.
  getOrderById: (id) => request(`/orders/${encodeURIComponent(id)}`),
  createOrder: (order) => request("/orders", { method: "POST", body: JSON.stringify(order) }),
  updateOrderStatus: (id, status) =>
    request(`/orders/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) }),
  deleteOrder: (id) => request(`/orders/${id}`, { method: "DELETE" }),
  createMenuItem: (item) => request("/menu", { method: "POST", body: JSON.stringify(item) }),
  updateMenuItem: (item) => request(`/menu/${item.id}`, { method: "PUT", body: JSON.stringify(item) }),
  deleteMenuItem: (id) => request(`/menu/${id}`, { method: "DELETE" }),
  staffLogin: (staffId, password) =>
    request("/staff/login", { method: "POST", body: JSON.stringify({ staffId, password }) }),
};
