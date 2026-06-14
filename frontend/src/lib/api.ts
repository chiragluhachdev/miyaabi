import { Product, Collection, Banner, SiteSettings, Partner } from "@/data/types";
import { PRODUCTS as FALLBACK_PRODUCTS, PRODUCT_MAP } from "@/data/products";
import { COLLECTIONS as FALLBACK_COLLECTIONS } from "@/data/collections";

// Backend serves routes at the root (and also under /api), so the base URL can be
// the bare service URL, e.g. https://miyaabi.onrender.com
export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5007";

/* ---------------- normalizers (backend shape -> storefront shape) ---------------- */

type RawImg = string | { url: string; publicId?: string };
const imgUrl = (im: RawImg) => (typeof im === "string" ? im : im?.url ?? "");

function normProduct(p: Record<string, unknown>): Product {
  const raw = p as Record<string, unknown>;
  return {
    _id: raw._id as string | undefined,
    handle: raw.handle as string,
    title: raw.title as string,
    price: raw.price as number,
    compareAtPrice: (raw.compareAtPrice as number | null) ?? undefined,
    images: ((raw.images as RawImg[]) || []).map(imgUrl).filter(Boolean),
    sizes: (raw.sizes as string[]) || [],
    colors: (raw.colors as { name: string; hex: string }[]) || [],
    brand: (raw.brand as string) || "miyaabi",
    collectionHandles: (raw.collectionHandles as string[]) || [],
    available: raw.available !== false,
    badge: (raw.badge as string) || undefined,
    featured: Boolean(raw.featured),
    description: (raw.description as string) || "",
    popularity: (raw.popularity as number) ?? 50,
    createdOrder: (raw.createdOrder as number) ?? 0,
  };
}

function normCollection(c: Record<string, unknown>): Collection {
  return {
    _id: c._id as string | undefined,
    handle: c.handle as string,
    title: c.title as string,
    group: (c.group as Collection["group"]) || "shop",
    bannerImage: imgUrl(c.bannerImage as RawImg) || "/img/banners/collection.svg",
    description: (c.description as string) || "",
    productCount: c.productCount as number | undefined,
  };
}

/* ---------------- fetch helper with graceful fallback ---------------- */

async function apiGet<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${API_BASE}${path}`, { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null; // backend unreachable -> caller uses fallback
  }
}

/* ---------------- public storefront fetchers ---------------- */

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
  const data = await apiGet<Record<string, unknown>[]>(
    `/products${qs.toString() ? `?${qs}` : ""}`
  );
  if (data) {
    const mapped = data.map(normProduct);
    // preserve the admin-curated order for manual handle lists
    if (params.handles?.length) {
      const order = new Map(params.handles.map((h, i) => [h, i]));
      mapped.sort((a, b) => (order.get(a.handle) ?? 0) - (order.get(b.handle) ?? 0));
    }
    return mapped;
  }

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
  const data = await apiGet<Record<string, unknown>[]>(
    `/products?sort=best-selling&limit=${limit}`
  );
  if (data) return data.map(normProduct);
  return [...FALLBACK_PRODUCTS]
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, limit);
}

export async function getProduct(handle: string): Promise<Product | null> {
  const data = await apiGet<Record<string, unknown>>(`/products/${handle}`);
  if (data) return normProduct(data);
  return PRODUCT_MAP[handle] ? PRODUCT_MAP[handle] : null;
}

export async function getRelatedProducts(
  handle: string,
  limit = 4
): Promise<Product[]> {
  const data = await apiGet<Record<string, unknown>[]>(
    `/products/${handle}/related?limit=${limit}`
  );
  if (data) return data.map(normProduct);
  const base = PRODUCT_MAP[handle];
  if (!base) return [];
  return FALLBACK_PRODUCTS.filter(
    (p) =>
      p.handle !== handle &&
      p.collectionHandles.some((c) => base.collectionHandles.includes(c))
  ).slice(0, limit);
}

export async function getCollections(): Promise<Collection[]> {
  const data = await apiGet<Record<string, unknown>[]>(
    `/collections?withCounts=true`
  );
  if (data) return data.map(normCollection);
  return FALLBACK_COLLECTIONS.map((c) => ({
    ...c,
    productCount: FALLBACK_PRODUCTS.filter((p) =>
      p.collectionHandles.includes(c.handle)
    ).length,
  }));
}

export async function getCollection(
  handle: string
): Promise<{ collection: Collection; products: Product[] } | null> {
  const data = await apiGet<{
    collection: Record<string, unknown>;
    products: Record<string, unknown>[];
  }>(`/collections/${handle}`);
  if (data) {
    return {
      collection: normCollection(data.collection),
      products: data.products.map(normProduct),
    };
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

export async function getBanners(): Promise<Banner[]> {
  const data = await apiGet<Record<string, unknown>[]>(`/banners`);
  if (data && data.length) {
    return data.map((b) => ({
      _id: b._id as string,
      image: imgUrl(b.image as RawImg) || "/img/banners/hero-1.svg",
      eyebrow: (b.eyebrow as string) || "",
      title: (b.title as string) || "",
      cta: (b.cta as string) || "Shop Now",
      href: (b.href as string) || "/collections",
    }));
  }
  return DEFAULT_BANNERS;
}

export async function getSettings(): Promise<SiteSettings> {
  const data = await apiGet<SiteSettings>(`/settings`);
  return data || DEFAULT_SETTINGS;
}

// Verify the partner passcode; returns the gated content or null if rejected.
export async function verifyPartnerAccess(code: string): Promise<Partner | null> {
  try {
    const res = await fetch(`${API_BASE}/partner/access`, {
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

/* ---------------- defaults (used when API is unreachable) ---------------- */

export const DEFAULT_BANNERS: Banner[] = [
  {
    image: "/img/banners/hero-1.svg",
    eyebrow: "mi-या-bi × Gujarat Titans",
    title: "Official Merchandise Partner",
    cta: "Shop Now",
    href: "/collections/gujarat-titans",
  },
  {
    image: "/img/banners/hero-2.svg",
    eyebrow: "New Season Drop",
    title: "Match Edition Jerseys",
    cta: "Explore",
    href: "/collections/fan-jersey",
  },
  {
    image: "/img/banners/hero-3.svg",
    eyebrow: "Worn By Champions",
    title: "International Shipping Available",
    cta: "Discover",
    href: "/collections",
  },
];

export const DEFAULT_SETTINGS: SiteSettings = {
  brand: { name: "mi-या-bi", logoUrl: "/logo.png" },
  announcementMessages: [
    "🔥 New season drop is LIVE now!",
    "✈️ International Shipping Available",
    "🏏 Premium sportswear, engineered for performance",
  ],
  whatsapp: {
    number: "919891829976",
    message: "Hi mi-या-bi! 👋 I'd like to know more about your products.",
    enabled: true,
  },
  featureStrip: [
    { icon: "🚚", title: "Free Shipping", sub: "On orders over ₹1,499" },
    { icon: "🔁", title: "Easy Returns", sub: "7-day hassle-free" },
    { icon: "🔒", title: "Secure Checkout", sub: "100% protected" },
    { icon: "✈️", title: "Ships Worldwide", sub: "International delivery" },
  ],
  footer: {
    columns: [
      {
        heading: "Quick Links",
        links: [
          { label: "Track Order", href: "/pages/track-order" },
          { label: "Bulk Enquiry", href: "/pages/bulk-enquiry" },
          { label: "FAQ", href: "/pages/faq" },
          { label: "Contact Us", href: "/pages/contact" },
        ],
      },
      {
        heading: "Policies",
        links: [
          { label: "Shipping Policy", href: "/policies/shipping" },
          { label: "Refund Policy", href: "/policies/refund" },
          { label: "Terms of Service", href: "/policies/terms" },
          { label: "Privacy Policy", href: "/policies/privacy" },
        ],
      },
      {
        heading: "Shop",
        links: [
          { label: "Cricket", href: "/collections/cricket" },
          { label: "Running", href: "/collections/running" },
          { label: "Football", href: "/collections/football" },
          { label: "Sale", href: "/collections/sale" },
        ],
      },
    ],
    social: [
      { label: "Instagram", href: "https://instagram.com" },
      { label: "Facebook", href: "https://facebook.com" },
      { label: "YouTube", href: "https://youtube.com" },
      { label: "X", href: "https://x.com" },
    ],
    payments: ["VISA", "MC", "AMEX", "UPI", "RuPay", "PayPal"],
    tagline:
      "Premium sports, athleisure and team wear. Engineered for performance, designed for the streets.",
  },
  currency: "INR",
  homeSections: [
    {
      id: "trending",
      type: "product-carousel",
      title: "Trending",
      source: "trending",
      limit: 8,
      viewAllHref: "/collections",
      enabled: true,
    },
    {
      id: "category-tiles",
      type: "tile-grid",
      title: "Shop by Category",
      enabled: true,
      tiles: [
        { label: "Clubs & Academies", image: "/img/tiles/clubs-academies.svg", href: "/collections" },
        { label: "Leagues & Partnership", image: "/img/tiles/leagues-partnership.svg", href: "/collections" },
        { label: "School & Alumni", image: "/img/tiles/school-alumni.svg", href: "/collections" },
        { label: "Brand Shops", image: "/img/tiles/brand-shops.svg", href: "/collections" },
      ],
    },
    {
      id: "shop-by-sports",
      type: "tile-carousel",
      title: "Shop by Sports",
      enabled: true,
      tiles: [
        { label: "Cricket", image: "/img/tiles/cricket.svg", href: "/collections/cricket" },
        { label: "Football", image: "/img/tiles/football.svg", href: "/collections/football" },
        { label: "Running", image: "/img/tiles/running.svg", href: "/collections/running" },
        { label: "Cycling", image: "/img/tiles/cycling.svg", href: "/collections/cycling" },
        { label: "Training", image: "/img/tiles/triathlon.svg", href: "/collections/training" },
        { label: "Yoga", image: "/img/tiles/fitness.svg", href: "/collections/yoga" },
      ],
    },
    {
      id: "best-sellers",
      type: "product-carousel",
      title: "Best Sellers",
      source: "best-selling",
      limit: 8,
      viewAllHref: "/collections",
      enabled: true,
    },
    {
      id: "promo",
      type: "promo",
      eyebrow: "New Season",
      title: "Gear up with miyaabi",
      text: "Performance fabrics, fan-ready designs and athleisure essentials — all in one place.",
      cta: "Shop the collection",
      href: "/collections",
      enabled: true,
    },
  ],
};
