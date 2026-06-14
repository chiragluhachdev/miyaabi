"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { adminFetch } from "@/lib/adminApi";
import { Collection } from "@/data/types";
import { PageTitle, Card, Button } from "@/components/admin/ui";

export default function AdminCollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminFetch<Collection[]>("/collections", { auth: false })
      .then(setCollections)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <PageTitle title="Collections" subtitle="Organize products into categories." />
        <Link href="/admin/collections/new">
          <Button>+ New collection</Button>
        </Link>
      </div>

      <Card className="overflow-hidden p-0">
        <table className="w-full text-left text-sm">
          <thead className="bg-shade font-semibold text-ink-soft">
            <tr>
              <th className="p-4">Collection</th>
              <th className="p-4">Group</th>
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
            ) : collections.length === 0 ? (
              <tr>
                <td colSpan={3} className="p-4 text-center text-ink-soft">
                  No collections found.
                </td>
              </tr>
            ) : (
              collections.map((c) => (
                <tr key={c._id || c.handle} className="hover:bg-shade/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-16 overflow-hidden rounded border border-line bg-shade">
                        {c.bannerImage && (
                          <img
                            src={c.bannerImage}
                            alt={c.title}
                            className="h-full w-full object-cover"
                          />
                        )}
                      </div>
                      <div>
                        <div className="font-bold">{c.title}</div>
                        <div className="text-[12px] text-ink-soft">{c.handle}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 uppercase text-[11px] font-bold tracking-wide">
                    {c.group}
                  </td>
                  <td className="p-4 text-right">
                    <Link
                      href={`/admin/collections/${c.handle}`}
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
