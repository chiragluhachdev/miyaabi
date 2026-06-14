import { API_BASE } from "./api";

export const TOKEN_KEY = "miyaabi_admin_token";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

interface FetchOpts {
  method?: string;
  body?: unknown;
  auth?: boolean;
}

export async function adminFetch<T = unknown>(
  path: string,
  { method = "GET", body, auth = true }: FetchOpts = {}
): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((data as { message?: string }).message || `Request failed (${res.status})`);
  }
  return data as T;
}

// Upload image files to Cloudinary via the backend. Returns [{url, publicId}].
export async function uploadImages(
  files: FileList | File[]
): Promise<{ url: string; publicId: string }[]> {
  const token = getToken();
  const form = new FormData();
  Array.from(files).forEach((f) => form.append("images", f));
  const res = await fetch(`${API_BASE}/upload`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    body: form,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Upload failed");
  return data.images;
}
