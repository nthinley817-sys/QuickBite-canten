// Mock order data — replace with a real API response later via services/api.js
const now = Date.now();
const mins = (n) => new Date(now - n * 60000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

export const ORDERS_SEED = [
  { id: "QB-1001", canteen: "Upper Canteen", items: [{ name: "Momo", qty: 2 }, { name: "Tea", qty: 1 }], total: 120, status: "Completed", priority: "Normal", time: mins(210) },
  { id: "QB-1002", canteen: "Lower Canteen", items: [{ name: "Chicken Chowmein", qty: 1 }, { name: "Juice", qty: 1 }], total: 130, status: "Completed", priority: "Normal", time: mins(195) },
  { id: "QB-1003", canteen: "Upper Canteen", items: [{ name: "Fried Rice", qty: 1 }], total: 80, status: "Completed", priority: "High", time: mins(180) },
  { id: "QB-1004", canteen: "Upper Canteen", items: [{ name: "Chicken Sandwich", qty: 1 }, { name: "Coffee", qty: 1 }], total: 110, status: "Completed", priority: "Normal", time: mins(160) },
  { id: "QB-1005", canteen: "Lower Canteen", items: [{ name: "Thukpa", qty: 1 }, { name: "Tea", qty: 1 }], total: 90, status: "Completed", priority: "Normal", time: mins(140) },
  { id: "QB-1035", canteen: "Upper Canteen", items: [{ name: "Momo", qty: 1 }, { name: "Coffee", qty: 1 }], total: 90, status: "Completed", priority: "Normal", time: mins(95) },
  { id: "QB-1006", canteen: "Upper Canteen", items: [{ name: "Burger", qty: 1 }, { name: "Juice", qty: 1 }], total: 140, status: "Processing", priority: "High", time: mins(38) },
  { id: "QB-1039", canteen: "Lower Canteen", items: [{ name: "Chicken Chowmein", qty: 1 }, { name: "Tea", qty: 1 }], total: 100, status: "Processing", priority: "Normal", time: mins(26) },
  { id: "QB-1007", canteen: "Lower Canteen", items: [{ name: "Chicken Momo", qty: 2 }], total: 140, status: "Processing", priority: "Normal", time: mins(20) },
  { id: "QB-1008", canteen: "Upper Canteen", items: [{ name: "Egg Fried Rice", qty: 1 }, { name: "Tea", qty: 1 }], total: 95, status: "Pending", priority: "Normal", time: mins(12) },
  { id: "QB-1048", canteen: "Upper Canteen", items: [{ name: "Chicken Fried Rice", qty: 1 }], total: 90, status: "Pending", priority: "High", time: mins(9) },
  { id: "QB-1049", canteen: "Lower Canteen", items: [{ name: "Veg Sandwich", qty: 1 }, { name: "Milk Coffee", qty: 1 }], total: 95, status: "Pending", priority: "Normal", time: mins(7) },
  { id: "QB-1009", canteen: "Lower Canteen", items: [{ name: "Spring Rolls", qty: 2 }, { name: "Juice", qty: 1 }], total: 140, status: "Pending", priority: "Normal", time: mins(4) },
  { id: "QB-1010", canteen: "Upper Canteen", items: [{ name: "French Fries", qty: 1 }, { name: "Black Coffee", qty: 1 }], total: 75, status: "Pending", priority: "Normal", time: mins(2) },
];
