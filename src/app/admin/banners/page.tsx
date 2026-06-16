"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { adminFetch } from "@/lib/adminApi";
import { Banner } from "@/data/types";
import { PageTitle, Card, Button } from "@/components/admin/ui";

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminFetch<Banner[]>("/banners?all=true", { auth: false })
      .then(setBanners)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <PageTitle title="Hero Banners" subtitle="Manage storefront carousel banners." />
        <Link href="/admin/banners/new">
          <Button>+ New banner</Button>
        </Link>
      </div>

      <Card className="overflow-hidden p-0">
        <table className="w-full text-left text-sm">
          <thead className="bg-shade font-semibold text-ink-soft">
            <tr>
              <th className="p-4">Banner Preview</th>
              <th className="p-4">Content</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {loading ? (
              <tr>
                <td colSpan={3} className="p-4 text-center text-ink-soft">
                  Loading...
                </td>
              </tr>
            ) : banners.length === 0 ? (
              <tr>
                <td colSpan={3} className="p-4 text-center text-ink-soft">
                  No banners found.
                </td>
              </tr>
            ) : (
              banners.map((b) => (
                <tr key={b._id || b.title} className="hover:bg-shade/50 transition-colors">
                  <td className="p-4">
                    <div className="h-20 w-40 overflow-hidden rounded border border-line bg-shade">
                      {b.image && (
                        <img
                          src={b.image}
                          alt={b.title}
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-[12px] text-brand font-bold uppercase">{b.eyebrow}</div>
                    <div className="font-bold text-lg">{b.title}</div>
                    <div className="mt-1 text-[13px] text-ink-soft">
                      Link: <span className="underline">{b.href}</span>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <Link
                      href={`/admin/banners/${b._id}`}
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
