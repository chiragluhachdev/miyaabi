import { Product } from "@/data/types";

export interface Badge {
  label: string;
  tone: "brand" | "ink" | "muted";
}

/** Dynamic stock/marketing badge for a product, in priority order. */
export function stockBadge(product: Product): Badge | null {
  if (product.comingSoon) return { label: "Coming Soon", tone: "ink" };
  const stock = product.stock;
  if (product.available === false || stock === 0)
    return { label: "Out of Stock", tone: "muted" };
  if (typeof stock === "number" && stock > 0 && stock <= 3)
    return { label: `Only ${stock} left`, tone: "brand" };
  if (product.badge) return { label: product.badge, tone: "ink" };
  if ((product.popularity ?? 0) >= 88) return { label: "Selling Fast", tone: "brand" };
  if (product.compareAtPrice) return { label: "Sale", tone: "brand" };
  return null;
}

export const badgeClasses: Record<Badge["tone"], string> = {
  brand: "bg-brand text-white",
  ink: "bg-ink text-white",
  muted: "bg-white/90 text-ink border border-line",
};
