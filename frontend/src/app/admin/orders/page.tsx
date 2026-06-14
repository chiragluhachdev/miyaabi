"use client";

import { useEffect, useState } from "react";
import { adminFetch } from "@/lib/adminApi";
import { PageTitle, Card } from "@/components/admin/ui";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminFetch<any[]>("/orders")
      .then(setOrders)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <PageTitle title="Orders" subtitle="View customer orders." />
      </div>

      <Card className="overflow-hidden p-0">
        <table className="w-full text-left text-sm">
          <thead className="bg-shade font-semibold text-ink-soft">
            <tr>
              <th className="p-4">Order</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Items</th>
              <th className="p-4">Total</th>
              <th className="p-4">Status</th>
              <th className="p-4">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {loading ? (
              <tr>
                <td colSpan={6} className="p-4 text-center text-ink-soft">
                  Loading...
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-4 text-center text-ink-soft">
                  No orders yet.
                </td>
              </tr>
            ) : (
              orders.map((o) => (
                <tr key={o._id} className="hover:bg-shade/50 transition-colors">
                  <td className="p-4 font-mono text-[12px] text-ink-soft">
                    #{String(o._id).slice(-6)}
                  </td>
                  <td className="p-4">
                    <div className="font-semibold">{o.customer?.name}</div>
                    <div className="text-[12px] text-ink-soft">
                      {o.customer?.email || o.customer?.phone}
                    </div>
                  </td>
                  <td className="p-4 text-ink-soft">{o.items?.length ?? 0}</td>
                  <td className="p-4 font-bold">₹{o.total ?? o.subtotal ?? 0}</td>
                  <td className="p-4">
                    <span className="inline-flex rounded-full bg-shade px-2 py-0.5 text-[11px] font-bold uppercase text-ink-soft">
                      {o.status || "pending"}
                    </span>
                  </td>
                  <td className="p-4 text-ink-soft">
                    {o.createdAt ? new Date(o.createdAt).toLocaleDateString() : "—"}
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
