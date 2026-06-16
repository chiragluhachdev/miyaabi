import { Product, Partner } from "@/data/types";
import { PRODUCTS as FALLBACK_PRODUCTS } from "@/data/products";
import { normProduct, type OrderInput, type OrderRecord } from "./normalize";

// Browser-side data layer for "use client" components. Everything now hits the
// same-origin /api routes — the Express backend is no longer referenced.

export type { OrderInput, OrderRecord } from "./normalize";

// Client-side product fetch used by Header search, RecentlyViewed and wishlist.
export async function getProducts(params: {
  collection?: string;
  search?: string;
  sort?: string;
  featured?: boolean;
  limit?: number;
  handles?: string[];
} = {}): Promise<Product[]> {
  const qs = new URLSearchParams();
  if (params.collection) qs.set("collection", params.collection);
  if (params.search) qs.set("search", params.search);
  if (params.sort) qs.set("sort", params.sort);
  if (params.featured) qs.set("featured", "true");
  if (params.limit) qs.set("limit", String(params.limit));
  if (params.handles?.length) qs.set("handles", params.handles.join(","));

  try {
    const res = await fetch(`/api/products${qs.toString() ? `?${qs}` : ""}`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("bad status");
    const data = (await res.json()) as Record<string, unknown>[];
    const mapped = data.map(normProduct);
    if (params.handles?.length) {
      const order = new Map(params.handles.map((h, i) => [h, i]));
      mapped.sort((a, b) => (order.get(a.handle) ?? 0) - (order.get(b.handle) ?? 0));
    }
    return mapped;
  } catch {
    let list = [...FALLBACK_PRODUCTS];
    if (params.handles?.length)
      list = params.handles
        .map((h) => list.find((p) => p.handle === h))
        .filter(Boolean) as Product[];
    if (params.collection)
      list = list.filter((p) => p.collectionHandles.includes(params.collection!));
    if (params.search) {
      const q = params.search.toLowerCase();
      list = list.filter((p) => p.title.toLowerCase().includes(q));
    }
    if (params.limit) list = list.slice(0, params.limit);
    return list;
  }
}

// Place a Cash-on-Delivery order.
export async function placeOrder(payload: OrderInput): Promise<OrderRecord> {
  const res = await fetch(`/api/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok)
    throw new Error((data as { message?: string }).message || "Could not place order");
  return data as OrderRecord;
}

// Verify the partner passcode.
export async function verifyPartnerAccess(code: string): Promise<Partner | null> {
  try {
    const res = await fetch(`/api/partner/access`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { ok: boolean; partner: Partner };
    return data.partner;
  } catch {
    return null;
  }
}
