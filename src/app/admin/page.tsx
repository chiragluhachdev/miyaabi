"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { adminFetch } from "@/lib/adminApi";
import { PageTitle, Card } from "@/components/admin/ui";

interface Counts {
  products: number;
  collections: number;
  banners: number;
  orders: number;
}

export default function AdminDashboard() {
  const [counts, setCounts] = useState<Counts>({
    products: 0,
    collections: 0,
    banners: 0,
    orders: 0,
  });

  useEffect(() => {
    Promise.all([
      adminFetch<unknown[]>("/products", { auth: false }),
      adminFetch<unknown[]>("/collections/all"),
      adminFetch<unknown[]>("/banners?all=true", { auth: false }),
      adminFetch<unknown[]>("/orders"),
    ])
      .then(([p, c, b, o]) =>
        setCounts({
          products: p.length,
          collections: c.length,
          banners: b.length,
          orders: o.length,
        })
      )
      .catch(() => {});
  }, []);

  const cards = [
    { label: "Products", value: counts.products, href: "/admin/products", icon: "👕" },
    { label: "Collections", value: counts.collections, href: "/admin/collections", icon: "🗂" },
    { label: "Hero Banners", value: counts.banners, href: "/admin/banners", icon: "🖼" },
    { label: "Orders", value: counts.orders, href: "/admin/orders", icon: "📦" },
  ];

  return (
    <div>
      <PageTitle
        title="Dashboard"
        subtitle="Everything customers see is editable from here."
      />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((c) => (
          <Link key={c.label} href={c.href}>
            <Card className="transition-shadow hover:shadow-md">
              <div className="text-2xl">{c.icon}</div>
              <div className="mt-3 text-3xl font-extrabold text-ink">{c.value}</div>
              <div className="text-[13px] font-semibold uppercase tracking-wide text-ink-soft">
                {c.label}
              </div>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <Card>
          <h3 className="mb-3 text-sm font-extrabold uppercase tracking-wide">
            Quick actions
          </h3>
          <div className="flex flex-wrap gap-2">
            {[
              { label: "Build homepage", href: "/admin/homepage" },
              { label: "+ New product", href: "/admin/products/new" },
              { label: "+ New collection", href: "/admin/collections/new" },
              { label: "+ New banner", href: "/admin/banners/new" },
              { label: "Edit site settings", href: "/admin/settings" },
            ].map((a) => (
              <Link
                key={a.href}
                href={a.href}
                className="rounded-full border border-line px-4 py-2 text-[13px] font-semibold hover:border-ink"
              >
                {a.label}
              </Link>
            ))}
          </div>
        </Card>
        <Card>
          <h3 className="mb-2 text-sm font-extrabold uppercase tracking-wide">Tips</h3>
          <ul className="space-y-1.5 text-[13px] text-ink-soft">
            <li>• Upload product photos directly — they go to Cloudinary.</li>
            <li>• Reorder hero banners with the “order” field (lower = first).</li>
            <li>• The announcement bar, footer & WhatsApp live in Site Settings.</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
