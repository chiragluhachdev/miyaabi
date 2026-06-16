// Remembers the IDs of orders placed on this device (no customer accounts yet),
// so the account screen can list and track them. Mirrors lib/recentlyViewed.ts.

const KEY = "miyaabi_orders";
const MAX = 20;

export function recordOrder(id: string) {
  if (typeof window === "undefined" || !id) return;
  try {
    const list: string[] = JSON.parse(localStorage.getItem(KEY) || "[]");
    const next = [id, ...list.filter((x) => x !== id)].slice(0, MAX);
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
}

export function readOrders(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}
