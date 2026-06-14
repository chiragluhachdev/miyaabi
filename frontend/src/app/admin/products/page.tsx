"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { adminFetch } from "@/lib/adminApi";
import { Product } from "@/data/types";
import { PageTitle, Card, Button } from "@/components/admin/ui";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminFetch<Product[]>("/products", { auth: false })
      .then(setProducts)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <PageTitle title="Products" subtitle="Manage your catalog." />
        <Link href="/admin/products/new">
          <Button>+ New product</Button>
        </Link>
      </div>

      <Card className="overflow-hidden p-0">
        <table className="w-full text-left text-sm">
          <thead className="bg-shade font-semibold text-ink-soft">
            <tr>
              <th className="p-4">Product</th>
              <th className="p-4">Price</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {loading ? (
              <tr>
                <td colSpan={4} className="p-4 text-center text-ink-soft">
                  Loading...
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-4 text-center text-ink-soft">
                  No products found.
                </td>
              </tr>
            ) : (
              products.map((p) => (
                <tr key={p._id} className="hover:bg-shade/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 overflow-hidden rounded border border-line bg-shade">
                        {p.images?.[0] && (
                          <img
                            src={p.images[0]}
                            alt={p.title}
                            className="h-full w-full object-cover"
                          />
                        )}
                      </div>
                      <div>
                        <div className="font-bold">{p.title}</div>
                        <div className="text-[12px] text-ink-soft">{p.handle}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">₹{p.price}</td>
                  <td className="p-4">
                    {p.available ? (
                      <span className="inline-flex rounded-full bg-green-100 px-2 py-0.5 text-[11px] font-bold uppercase text-green-700">
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-bold uppercase text-gray-700">
                        Draft
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <Link
                      href={`/admin/products/${p.handle}`}
                      className="font-semibold text-brand hover:underline"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
