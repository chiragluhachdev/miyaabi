import "server-only";
import { Product, Collection, Banner, SiteSettings } from "@/data/types";
import { PRODUCTS as FALLBACK_PRODUCTS, PRODUCT_MAP } from "@/data/products";
import { COLLECTIONS as FALLBACK_COLLECTIONS } from "@/data/collections";
import {
  normProduct,
  normCollection,
  normBanner,
  DEFAULT_BANNERS,
  DEFAULT_SETTINGS,
  type OrderRecord,
} from "./normalize";
import {
  getCachedProducts,
  getCachedProductByHandle,
  getCachedRelated,
  getCachedCollections,
  getCachedCollectionByHandle,
  getCachedBanners,
  getCachedSettings,
} from "./cache";
import { queryOrderById } from "./queries";

// Server-side storefront data layer. RSCs import this; it reads MongoDB DIRECTLY
// via the query layer (no self-HTTP hop). Each fetcher falls back to the static
// `src/data/*` content if the DB is unreachable, preserving the original behavior.

export { DEFAULT_BANNERS, DEFAULT_SETTINGS };
export type { OrderInput, OrderRecord } from "./normalize";

/* ---------------- products ---------------- */

export async function getProducts(params: {
  collection?: string;
  search?: string;
  sort?: string;
  featured?: boolean;
  limit?: number;
  handles?: string[];
} = {}): Promise<Product[]> {
  try {
    const docs = await getCachedProducts({
      collection: params.collection,
      search: params.search,
      sort: params.sort,
      featured: params.featured,
      limit: params.limit,
      handles: params.handles?.length ? params.handles.join(",") : undefined,
    });
    const mapped = docs.map(normProduct);
    // preserve the admin-curated order for manual handle lists
    if (params.handles?.length) {
      const order = new Map(params.handles.map((h, i) => [h, i]));
      mapped.sort((a, b) => (order.get(a.handle) ?? 0) - (order.get(b.handle) ?? 0));
    }
    return mapped;
  } catch {
    // fallback to static data
    let list = [...FALLBACK_PRODUCTS];
    if (params.handles?.length)
      list = params.handles
        .map((h) => list.find((p) => p.handle === h))
        .filter(Boolean) as Product[];
    if (params.collection)
      list = list.filter((p) => p.collectionHandles.includes(params.collection!));
    if (params.featured) list = list.filter((p) => (p.popularity ?? 0) >= 80);
    if (params.sort === "best-selling")
      list.sort((a, b) => b.popularity - a.popularity);
    if (params.limit) list = list.slice(0, params.limit);
    return list;
  }
}

/** Resolve the products for a homepage product-carousel section. */
export async function getSectionProducts(section: {
  source?: string;
  collectionHandle?: string;
  productHandles?: string[];
  limit?: number;
}): Promise<Product[]> {
  const limit = section.limit || 8;
  switch (section.source) {
    case "manual":
      return getProducts({ handles: section.productHandles || [], limit });
    case "collection":
      return getProducts({ collection: section.collectionHandle || "", limit });
    case "best-selling":
      return getProducts({ sort: "best-selling", limit });
    case "new":
      return getProducts({ sort: "date-new", limit });
    case "trending":
    default:
      return getTrendingProducts(limit);
  }
}

export async function getTrendingProducts(limit = 8): Promise<Product[]> {
  return getProducts({ sort: "best-selling", limit });
}

export async function getProduct(handle: string): Promise<Product | null> {
  try {
    const doc = await getCachedProductByHandle(handle);
    if (doc) return normProduct(doc);
  } catch {
    /* fall through to static */
  }
  return PRODUCT_MAP[handle] ? PRODUCT_MAP[handle] : null;
}

export async function getRelatedProducts(
  handle: string,
  limit = 4
): Promise<Product[]> {
  try {
    const docs = await getCachedRelated(handle, limit);
    if (docs) return docs.map(normProduct);
  } catch {
    /* fall through */
  }
  const base = PRODUCT_MAP[handle];
  if (!base) return [];
  return FALLBACK_PRODUCTS.filter(
    (p) =>
      p.handle !== handle &&
      p.collectionHandles.some((c) => base.collectionHandles.includes(c))
  ).slice(0, limit);
}

/* ---------------- collections ---------------- */

export async function getCollections(): Promise<Collection[]> {
  try {
    const docs = await getCachedCollections(true);
    return docs.map(normCollection);
  } catch {
    return FALLBACK_COLLECTIONS.map((c) => ({
      ...c,
      productCount: FALLBACK_PRODUCTS.filter((p) =>
        p.collectionHandles.includes(c.handle)
      ).length,
    }));
  }
}

export async function getCollection(
  handle: string
): Promise<{ collection: Collection; products: Product[] } | null> {
  try {
    const data = await getCachedCollectionByHandle(handle);
    if (data) {
      return {
        collection: normCollection(data.collection),
        products: data.products.map(normProduct),
      };
    }
  } catch {
    /* fall through */
  }
  const fallback = FALLBACK_COLLECTIONS.find((c) => c.handle === handle);
  if (!fallback) return null;
  return {
    collection: fallback,
    products: FALLBACK_PRODUCTS.filter((p) =>
      p.collectionHandles.includes(handle)
    ),
  };
}

/* ---------------- banners & settings ---------------- */

export async function getBanners(): Promise<Banner[]> {
  try {
    const docs = await getCachedBanners();
    if (docs && docs.length) {
      return docs.map(normBanner);
    }
  } catch {
    /* fall through */
  }
  return DEFAULT_BANNERS;
}

export async function getSettings(): Promise<SiteSettings> {
  try {
    const data = await getCachedSettings();
    return data as unknown as SiteSettings;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

/* ---------------- orders (read) ---------------- */

// Fetch a single order (public) for confirmation / tracking.
export async function getOrder(id: string): Promise<OrderRecord | null> {
  try {
    const doc = await queryOrderById(id);
    if (!doc) return null;
    // lean() returns Mongo ObjectId/Date — serialize to plain JSON so `_id` is a
    // string (the page does `_id.slice(...)`) and dates are ISO strings.
    return JSON.parse(JSON.stringify(doc)) as OrderRecord;
  } catch {
    return null;
  }
}
