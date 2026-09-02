# QuickBite — Frontend Prototype

Smart QR-based canteen ordering system for Gyalpozhing College of Information Technology (Upper Canteen & Lower Canteen, Dragon Block).

This is a **frontend-only** prototype built with React + Vite. All data (menu, orders) is mock data held in frontend state — there is no backend, database, or real payment/auth. It is structured so the mock layer in `src/services/api.js` can be swapped for real API calls to the future Java backend without touching any UI components.

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL (usually http://localhost:5173) in your browser.

To build a production bundle:

```bash
npm run build
npm run preview
```

## Project structure

```
src/
  main.jsx                 App entry point
  App.jsx                  Root component: routing/state, ties everything together
  index.css                Design tokens + all styles (design system)

  data/                    Mock data (swap for real API responses later)
    canteens.js
    menu.js
    orders.js
    images.js               centralized image URLs

  services/
    api.js                  Mock service functions: getMenu, getOrders, getOrderById,
                             createOrder, updateOrderStatus, updateMenuItem
                             -> replace bodies with fetch()/axios calls to the Java backend later

  utils/
    format.js                money formatting, status helpers, mock hash function

  hooks/
    useToasts.js              toast notification queue

  components/
    icons/                    Icon.jsx (inline SVG icon set), Logomark.jsx (brand mark)
    common/                   SafeImg, StatusBadge, PriorityBadge, AvailBadge,
                               EmptyState, Skeleton, Modal, ToastHost
    layout/                   Navbar, Footer
    customer/                 CanteenGrid, FoodCardPreview, FoodDetailModal
    staff/                    StaffShell, OrderCardMini, OrderDetailsModal, MenuItemModal

  pages/
    customer/                 Landing, CanteenSelect, MenuPage, CartPage,
                               OrderConfirmation, OrderTracking
    staff/                    StaffDashboard, OrderListPage, MenuManagement,
                               SearchSortDemo, DataStructuresDemo
```

## Customer flow

Landing → Canteen Selection → Menu (search/filter) → Food Details → Cart → Order Confirmation → Order Tracking

## Staff flow

Dashboard → Pending / Processing / Completed Orders → Order Details → Menu Management → Search & Sort demo → Data Structure Monitor (Queue / Priority Queue / Hash Table visualizations — UI demonstration only, no real algorithms implemented yet)

Toggle between the two with the floating "Staff View" / "Customer View" button in the bottom-right corner, or the "Staff" link in the footer.

## Connecting the real backend later

Everything in `src/services/api.js` currently resolves mock data synchronously wrapped in `Promise.resolve(...)`. When the Java backend is ready, replace each function body with a real HTTP call (e.g. `fetch("/api/menu")`) that returns the same shape of data — no component code needs to change.
