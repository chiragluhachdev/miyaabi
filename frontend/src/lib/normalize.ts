import { Product, Collection, Banner, SiteSettings } from "@/data/types";

// Pure, client-safe normalizers + defaults shared by the server data layer
// (lib/api.ts) and the browser data layer (lib/clientApi.ts). No DB / server-only
// imports here so this can ship in the client bundle.

export type RawImg = string | { url: string; publicId?: string };
export const imgUrl = (im: RawImg) => (typeof im === "string" ? im : im?.url ?? "");

export function normProduct(p: unknown): Product {
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
    stock: (raw.stock as number) ?? undefined,
    comingSoon: Boolean(raw.comingSoon),
    badge: (raw.badge as string) || undefined,
    tags: (raw.tags as string[]) || [],
    featured: Boolean(raw.featured),
    description: (raw.description as string) || "",
    fabric: (raw.fabric as string) || "",
    gsm: (raw.gsm as number) || 0,
    fit: (raw.fit as string) || "",
    washCare: (raw.washCare as string) || "",
    countryOfOrigin: (raw.countryOfOrigin as string) || "",
    returnPolicy: (raw.returnPolicy as string) || "",
    shippingTime: (raw.shippingTime as string) || "",
    popularity: (raw.popularity as number) ?? 50,
    createdOrder: (raw.createdOrder as number) ?? 0,
  };
}

export function normCollection(input: unknown): Collection {
  const c = input as Record<string, unknown>;
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

export function normBanner(input: unknown): Banner {
  const b = input as Record<string, unknown>;
  return {
    _id: b._id as string,
    image: imgUrl(b.image as RawImg) || "/img/banners/hero-1.svg",
    eyebrow: (b.eyebrow as string) || "",
    title: (b.title as string) || "",
    cta: (b.cta as string) || "Shop Now",
    href: (b.href as string) || "/collections",
  };
}

export interface OrderInput {
  items: {
    handle: string;
    title: string;
    image: string;
    price: number;
    size: string;
    color: string;
    qty: number;
  }[];
  customer: {
    name: string;
    phone: string;
    email?: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  paymentMethod: string;
}

export interface OrderRecord extends OrderInput {
  _id: string;
  subtotal: number;
  shipping: number;
  total: number;
  status: string;
  createdAt: string;
}

/* ---------------- defaults (used when DB/API is unreachable) ---------------- */

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
