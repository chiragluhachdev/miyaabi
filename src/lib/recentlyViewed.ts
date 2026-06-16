const KEY = "miyaabi_recently_viewed";
const MAX = 5;

export function recordView(handle: string) {
  if (typeof window === "undefined") return;
  try {
    const list: string[] = JSON.parse(localStorage.getItem(KEY) || "[]");
    const next = [handle, ...list.filter((h) => h !== handle)].slice(0, MAX);
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
}

export function readRecentlyViewed(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}
