"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import { getProducts } from "@/lib/api";
import { Product } from "@/data/types";
import ProductGrid from "@/components/ProductGrid";

export default function WishlistPage() {
  const { wishlist } = useStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!wishlist.length) {
      setProducts([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    getProducts({ handles: wishlist })
      .then(setProducts)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [wishlist]);

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-10 lg:px-6">
      <h1 className="font-display text-3xl font-black uppercase leading-none sm:text-4xl">
        Your Wishlist
      </h1>
      <span className="mb-8 mt-2 block h-1 w-12 rounded-full bg-brand" />

      {loading ? (
        <p className="py-16 text-center text-ink-soft">Loading…</p>
      ) : !products.length ? (
        <div className="rounded-xl border border-dashed border-line py-20 text-center">
          <p className="text-ink-soft">Your wishlist is empty.</p>
          <Link
            href="/collections/new-arrivals"
            className="mt-5 inline-block rounded-full bg-ink px-8 py-3 text-[13px] font-bold uppercase tracking-wide text-white hover:bg-brand"
          >
            Browse new arrivals
          </Link>
        </div>
      ) : (
        <ProductGrid products={products} />
      )}
    </div>
  );
}
