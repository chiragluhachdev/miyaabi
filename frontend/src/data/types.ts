export type SortKey =
  | "featured"
  | "best-selling"
  | "alpha"
  | "price-asc"
  | "price-desc"
  | "date-old"
  | "date-new";

export interface Product {
  _id?: string;
  handle: string;
  title: string;
  /** price in INR (whole rupees) */
  price: number;
  compareAtPrice?: number | null;
  /** normalized to plain URLs for the storefront */
  images: string[];
  sizes: string[];
  colors: { name: string; hex: string }[];
  brand: string;
  collectionHandles: string[];
  available: boolean;
  badge?: string;
  featured?: boolean;
  description: string;
  /** higher = sells better; used by best-selling sort */
  popularity: number;
  /** unix-ish ordering for date sorts */
  createdOrder: number;
}

export interface Collection {
  _id?: string;
  handle: string;
  title: string;
  /** short label used in nav */
  group: "shop" | "brand" | "sport" | "feature";
  bannerImage: string;
  description: string;
  productHandles?: string[];
  productCount?: number;
}

export interface Banner {
  _id?: string;
  image: string;
  eyebrow: string;
  title: string;
  cta: string;
  href: string;
}

export interface Tile {
  label: string;
  image: string;
  href: string;
}

export type ProductSource =
  | "trending"
  | "best-selling"
  | "new"
  | "collection"
  | "manual";

export interface HomeSection {
  id: string;
  type: "product-carousel" | "tile-grid" | "tile-carousel" | "promo";
  title?: string;
  enabled?: boolean;
  // product-carousel
  source?: ProductSource;
  collectionHandle?: string;
  productHandles?: string[];
  limit?: number;
  viewAllHref?: string;
  // tile-grid / tile-carousel
  tiles?: Tile[];
  // promo
  eyebrow?: string;
  text?: string;
  cta?: string;
  href?: string;
}

export interface SiteSettings {
  brand: { name: string; logoUrl: string };
  announcementMessages: string[];
  whatsapp: { number: string; message: string; enabled: boolean };
  featureStrip: { icon: string; title: string; sub: string }[];
  footer: {
    columns: { heading: string; links: { label: string; href: string }[] }[];
    social: { label: string; href: string }[];
    payments: string[];
    tagline: string;
  };
  currency: string;
  homeSections?: HomeSection[];
}

export interface NavItem {
  label: string;
  href: string;
  highlight?: boolean;
  columns?: { heading: string; links: { label: string; href: string }[] }[];
}
