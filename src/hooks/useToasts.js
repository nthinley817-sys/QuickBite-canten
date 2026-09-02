import { useState, useCallback } from "react";

export function useToasts() {
  const [toasts, setToasts] = useState([]);
  const push = useCallback((message, type = "default") => {
    const id = Math.random().toString(36).slice(2);
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }, []);
  return { toasts, push };
}
