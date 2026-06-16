"use client";

import { useEffect, useState } from "react";
import { Product } from "@/data/types";
import { getProducts } from "@/lib/clientApi";
import { recordView, readRecentlyViewed } from "@/lib/recentlyViewed";
import ProductCarousel from "./ProductCarousel";

// Records the current product as viewed, then shows the recently-viewed row
// (excluding the current product).
export default function RecentlyViewed({ current }: { current?: string }) {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (current) recordView(current);
    const handles = readRecentlyViewed().filter((h) => h !== current);
    if (!handles.length) return;
    getProducts({ handles })
      .then((list) => {
        // preserve recency order
        const order = new Map(handles.map((h, i) => [h, i]));
        list.sort((a, b) => (order.get(a.handle) ?? 0) - (order.get(b.handle) ?? 0));
        setProducts(list);
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current]);

  if (!products.length) return null;
  return <ProductCarousel title="Recently Viewed" products={products} />;
}
