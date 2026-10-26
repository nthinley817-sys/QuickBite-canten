import { useState, useEffect, useRef, useCallback } from "react";

// Alerts staff when a new order arrives: a chime, a Messenger-style card in
// the corner, a system notification while the tab is in the background, and
// an unread count in the tab title. Orders already on screen when staff log
// in are not announced — only ones that show up afterwards.

const PREF_KEY = "qb_staff_alerts";
const CARD_MS = 9000;
// While an order is still Pending (nobody has tapped "Start Preparing"), the
// chime repeats so a missed alert doesn't mean a missed order. Only recent
// orders count, so a forgotten old test order can't ring forever.
const REMIND_MS = 30_000;
const REMIND_WINDOW_MS = 2 * 60 * 60 * 1000;
const isWaiting = (o) =>
  o.status === "Pending" && o.placedAt && Date.now() - new Date(o.placedAt).getTime() < REMIND_WINDOW_MS;
const BASE_TITLE = typeof document !== "undefined" ? document.title : "QuickBite";

const readPref = () => {
  try { return localStorage.getItem(PREF_KEY) === "on"; } catch { return false; }
};
const writePref = (on) => {
  try { localStorage.setItem(PREF_KEY, on ? "on" : "off"); } catch { /* private mode: keep it for this visit only */ }
};

let audioCtx = null;
function chime() {
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === "suspended") audioCtx.resume();
    const now = audioCtx.currentTime;
    // Two short rising notes, like a message "ding-dong".
    [[880, 0], [1320, 0.16]].forEach(([freq, at]) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.0001, now + at);
      gain.gain.exponentialRampToValueAtTime(0.35, now + at + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + at + 0.45);
      osc.connect(gain).connect(audioCtx.destination);
      osc.start(now + at);
      osc.stop(now + at + 0.5);
    });
  } catch { /* no audio available; the visual alert still shows */ }
}

const notificationsSupported = () => typeof window !== "undefined" && "Notification" in window;

export const describeOrder = (o) => o.items.map((i) => `${i.qty} × ${i.name}`).join(", ");

export function useOrderAlerts(orders, active, onOpenOrder) {
  const [enabled, setEnabled] = useState(readPref);
  const [cards, setCards] = useState([]);
  const seen = useRef(null); // null until the first load after login
  const unread = useRef(0);
  const latestOrders = useRef(orders);
  latestOrders.current = orders;

  // Forget what we've seen when staff log out, so the next login starts fresh.
  useEffect(() => {
    if (!active) { seen.current = null; unread.current = 0; document.title = BASE_TITLE; }
  }, [active]);

  useEffect(() => {
    if (!active) return;
    if (seen.current === null) {
      seen.current = new Set(orders.map((o) => o.id));
      return;
    }
    const fresh = orders.filter((o) => !seen.current.has(o.id) && o.status === "Pending");
    orders.forEach((o) => seen.current.add(o.id));
    if (fresh.length === 0) return;

    setCards((c) => [...fresh.map((o) => ({ key: `${o.id}-${Date.now()}`, order: o })), ...c].slice(0, 4));
    fresh.forEach((o) => {
      const key = o.id;
      setTimeout(() => setCards((c) => c.filter((x) => x.order.id !== key)), CARD_MS);
    });

    if (!enabled) return;
    chime();
    if (document.hidden) {
      unread.current += fresh.length;
      document.title = `(${unread.current}) New order${unread.current > 1 ? "s" : ""} · QuickBite`;
      if (notificationsSupported() && Notification.permission === "granted") {
        fresh.forEach((o) => {
          const n = new Notification(`New order · Table ${o.tableNumber}`, {
            body: `${describeOrder(o)} — Nu. ${o.total}`,
            icon: "/logoshort.png",
            tag: o.id,
          });
          n.onclick = () => { window.focus(); onOpenOrder(o); n.close(); };
        });
      }
    }
  }, [orders, active, enabled, onOpenOrder]);

  // Repeat the chime every 30 seconds while any recent order is still waiting.
  useEffect(() => {
    if (!active || !enabled) return;
    const id = setInterval(() => {
      if (latestOrders.current.some(isWaiting)) chime();
    }, REMIND_MS);
    return () => clearInterval(id);
  }, [active, enabled]);

  // Coming back to the tab clears the unread count in the title.
  useEffect(() => {
    const onVisible = () => {
      if (!document.hidden) { unread.current = 0; document.title = BASE_TITLE; }
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, []);

  // Browsers only allow sound and notifications after a tap, so turning alerts
  // on happens from a button click: ask for notification permission and
  // unlock audio with a test chime in the same gesture.
  const [permission, setPermission] = useState(() => (notificationsSupported() ? Notification.permission : "unsupported"));
  const toggle = useCallback(() => {
    if (enabled) { setEnabled(false); writePref(false); return; }
    // Sound and on-screen cards work right away; desktop notifications only
    // once the browser prompt is answered, so don't wait on it.
    chime();
    setEnabled(true);
    writePref(true);
    if (notificationsSupported() && Notification.permission === "default") {
      Notification.requestPermission().then(setPermission).catch(() => { /* ignore */ });
    }
  }, [enabled]);

  // A saved "on" preference still needs one tap per page load before audio can
  // play; unlock it on the first interaction anywhere.
  useEffect(() => {
    if (!enabled) return;
    const unlock = () => {
      try {
        audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
        if (audioCtx.state === "suspended") audioCtx.resume();
      } catch { /* ignore */ }
    };
    window.addEventListener("pointerdown", unlock, { once: true });
    return () => window.removeEventListener("pointerdown", unlock);
  }, [enabled]);

  const dismiss = useCallback((key) => setCards((c) => c.filter((x) => x.key !== key)), []);
  return { enabled, toggle, cards, dismiss, permission };
}

// ---------------------------------------------------------------------------
// Customer side: tell the customer, on their own phone, when staff move their
// order along. Plays the chime, vibrates (Android), shows a card on screen and,
// if they allowed it and are looking at another tab, a system notification.

const STATUS_NOTICES = {
  Processing: { title: "Your food is being prepared", body: "The kitchen has started on your order." },
  Completed: { title: "Your order is ready!", body: "Please collect it at the counter." },
};

// Call from a tap (e.g. "Place Order") so the browser lets us play sound later.
export function unlockAudio() {
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === "suspended") audioCtx.resume();
  } catch { /* no audio available */ }
}

export function useOrderStatusAlerts(order) {
  const [notice, setNotice] = useState(null);
  const [permission, setPermission] = useState(() => (notificationsSupported() ? Notification.permission : "unsupported"));
  const last = useRef(null);

  useEffect(() => {
    if (!order) { last.current = null; return; }
    const prev = last.current;
    last.current = { id: order.id, status: order.status };
    // Only react to a change we saw happen, not to the first load.
    if (!prev || prev.id !== order.id || prev.status === order.status) return;
    const info = STATUS_NOTICES[order.status];
    if (!info) return;

    chime();
    try { navigator.vibrate?.([250, 120, 250]); } catch { /* not supported */ }
    const key = `${order.id}-${order.status}`;
    setNotice({ key, title: info.title, body: `Table ${order.tableNumber} · ${info.body}`, status: order.status });
    setTimeout(() => setNotice((n) => (n && n.key === key ? null : n)), 12000);

    if (document.hidden && notificationsSupported() && Notification.permission === "granted") {
      try {
        const n = new Notification(info.title, { body: `Table ${order.tableNumber} · ${info.body}`, icon: "/logoshort.png", tag: key });
        n.onclick = () => { window.focus(); n.close(); };
      } catch { /* some mobile browsers only allow notifications from an installed app */ }
    }
  }, [order?.id, order?.status]);

  const requestNotify = useCallback(() => {
    unlockAudio();
    if (!notificationsSupported() || Notification.permission !== "default") return;
    Notification.requestPermission().then(setPermission).catch(() => { /* ignore */ });
  }, []);

  return { notice, dismiss: () => setNotice(null), permission, requestNotify };
}
