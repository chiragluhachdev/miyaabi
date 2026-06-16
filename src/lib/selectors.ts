import { PRODUCTS, PRODUCT_MAP } from "@/data/products";
import { COLLECTION_MAP, COLLECTIONS } from "@/data/collections";
import { Product, SortKey } from "@/data/types";

export function getProduct(handle: string): Product | undefined {
  return PRODUCT_MAP[handle];
}

export function getCollection(handle: string) {
  return COLLECTION_MAP[handle];
}

export function getAllCollections() {
  return COLLECTIONS;
}

export function getProductsByCollection(handle: string): Product[] {
  return PRODUCTS.filter((p) => p.collectionHandles.includes(handle));
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  return PRODUCTS.filter(
    (p) =>
      p.handle !== product.handle &&
      p.collectionHandles.some((c) => product.collectionHandles.includes(c))
  ).slice(0, limit);
}

export function getTrending(limit = 8): Product[] {
  return [...PRODUCTS].sort((a, b) => b.popularity - a.popularity).slice(0, limit);
}

export function searchProducts(query: string, limit = 6): Product[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return PRODUCTS.filter(
    (p) =>
      p.title.toLowerCase().includes(q) ||
      p.collectionHandles.some((c) => c.includes(q))
  ).slice(0, limit);
}

export interface FilterState {
  availability: ("in" | "out")[];
  sizes: string[];
  colors: string[];
  brands: string[];
  minPrice?: number;
  maxPrice?: number;
}

export const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "featured", label: "Featured" },
  { key: "best-selling", label: "Best selling" },
  { key: "alpha", label: "Alphabetically, A–Z" },
  { key: "price-asc", label: "Price, low to high" },
  { key: "price-desc", label: "Price, high to low" },
  { key: "date-old", label: "Date, old to new" },
  { key: "date-new", label: "Date, new to old" },
];

export function filterAndSort(
  products: Product[],
  filters: FilterState,
  sort: SortKey
): Product[] {
  let out = products.filter((p) => {
    if (filters.availability.length) {
      const wantIn = filters.availability.includes("in");
      const wantOut = filters.availability.includes("out");
      if (p.available && !wantIn) return false;
      if (!p.available && !wantOut) return false;
    }
    if (filters.sizes.length && !p.sizes.some((s) => filters.sizes.includes(s)))
      return false;
    if (
      filters.colors.length &&
      !p.colors.some((c) => filters.colors.includes(c.name))
    )
      return false;
    if (filters.brands.length && !filters.brands.includes(p.brand)) return false;
    if (filters.minPrice != null && p.price < filters.minPrice) return false;
    if (filters.maxPrice != null && p.price > filters.maxPrice) return false;
    return true;
  });

  switch (sort) {
    case "alpha":
      out = out.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case "price-asc":
      out = out.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      out = out.sort((a, b) => b.price - a.price);
      break;
    case "best-selling":
      out = out.sort((a, b) => b.popularity - a.popularity);
      break;
    case "date-new":
      out = out.sort((a, b) => b.createdOrder - a.createdOrder);
      break;
    case "date-old":
      out = out.sort((a, b) => a.createdOrder - b.createdOrder);
      break;
    default:
      break; // featured = natural order
  }
  return out;
}

export function facetsFor(products: Product[]) {
  const sizes = new Set<string>();
  const colors = new Map<string, string>();
  const brands = new Set<string>();
  let min = Infinity;
  let max = 0;
  for (const p of products) {
    p.sizes.forEach((s) => sizes.add(s));
    p.colors.forEach((c) => colors.set(c.name, c.hex));
    brands.add(p.brand);
    min = Math.min(min, p.price);
    max = Math.max(max, p.price);
  }
  const sizeOrder = ["One Size", "S", "M", "L", "XL", "XXL", "3XL"];
  return {
    sizes: [...sizes].sort(
      (a, b) => sizeOrder.indexOf(a) - sizeOrder.indexOf(b)
    ),
    colors: [...colors.entries()].map(([name, hex]) => ({ name, hex })),
    brands: [...brands],
    minPrice: min === Infinity ? 0 : Math.floor(min),
    maxPrice: Math.ceil(max),
  };
}
