"use client";

import { useEffect, useState } from "react";
import { adminFetch } from "@/lib/adminApi";
import { formatINR } from "@/lib/format";
import { PageTitle, Card } from "@/components/admin/ui";

interface OrderItem {
  title: string;
  color: string;
  size: string;
  qty: number;
  price: number;
}
interface Order {
  _id: string;
  items: OrderItem[];
  customer: {
    name: string;
    phone: string;
    email?: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  paymentMethod: string;
  total: number;
  status: string;
  createdAt: string;
}

const FLOW = ["placed", "processing", "shipped", "delivered"];
const STATUS_TONE: Record<string, string> = {
  placed: "bg-blue-100 text-blue-700",
  processing: "bg-amber-100 text-amber-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    adminFetch<Order[]>("/orders")
      .then(setOrders)
      .catch(() => {})
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const setStatus = async (id: string, status: string) => {
    setBusy(id);
    try {
      const updated = await adminFetch<Order>(`/orders/${id}`, {
        method: "PUT",
        body: { status },
      });
      setOrders((prev) => prev.map((o) => (o._id === id ? { ...o, status: updated.status } : o)));
    } catch {
      /* ignore */
    } finally {
      setBusy(null);
    }
  };

  const nextStatus = (s: string) => {
    const i = FLOW.indexOf(s);
    return i >= 0 && i < FLOW.length - 1 ? FLOW[i + 1] : null;
  };

  return (
    <div>
      <PageTitle
        title="Orders"
        subtitle={`${orders.length} order${orders.length === 1 ? "" : "s"} · Cash on Delivery`}
      />

      <Card className="overflow-x-auto p-0">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead className="bg-shade text-[11px] uppercase tracking-wide text-ink-soft">
            <tr>
              <th className="p-4">Order</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Total</th>
              <th className="p-4">Status</th>
              <th className="p-4">Advance</th>
              <th className="p-4">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {loading ? (
              <tr><td colSpan={6} className="p-6 text-center text-ink-soft">Loading…</td></tr>
            ) : !orders.length ? (
              <tr><td colSpan={6} className="p-6 text-center text-ink-soft">No orders yet.</td></tr>
            ) : (
              orders.map((o) => {
                const next = nextStatus(o.status);
                return (
                  <>
                    <tr key={o._id} className="hover:bg-shade/40">
                      <td className="p-4">
                        <button
                          onClick={() => setOpen(open === o._id ? null : o._id)}
                          className="font-mono text-[12px] font-bold text-ink hover:text-brand"
                        >
                          #{o._id.slice(-6).toUpperCase()} {open === o._id ? "▾" : "▸"}
                        </button>
                        <div className="text-[11px] text-ink-soft">{o.items.length} item(s)</div>
                      </td>
                      <td className="p-4">
                        <div className="font-semibold">{o.customer.name}</div>
                        <div className="text-[12px] text-ink-soft">{o.customer.phone}</div>
                      </td>
                      <td className="p-4 font-bold">
                        {formatINR(o.total)}
                        <div className="text-[11px] font-normal text-ink-soft">{o.paymentMethod}</div>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase ${STATUS_TONE[o.status] || "bg-shade text-ink-soft"}`}>
                          {o.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1.5">
                          {next && (
                            <button
                              onClick={() => setStatus(o._id, next)}
                              disabled={busy === o._id}
                              className="rounded-full bg-ink px-3 py-1.5 text-[11px] font-bold uppercase text-white hover:bg-brand disabled:opacity-50"
                            >
                              → {next}
                            </button>
                          )}
                          {o.status !== "cancelled" && o.status !== "delivered" && (
                            <button
                              onClick={() => setStatus(o._id, "cancelled")}
                              disabled={busy === o._id}
                              className="rounded-full border border-line px-3 py-1.5 text-[11px] font-bold uppercase text-ink-soft hover:border-brand hover:text-brand disabled:opacity-50"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-ink-soft">
                        {new Date(o.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                      </td>
                    </tr>
                    {open === o._id && (
                      <tr key={`${o._id}-d`} className="bg-shade/30">
                        <td colSpan={6} className="p-4">
                          <div className="grid gap-4 md:grid-cols-2">
                            <div>
                              <p className="mb-1 text-[11px] font-bold uppercase tracking-wide text-ink-soft">Items</p>
                              <ul className="space-y-1 text-[13px]">
                                {o.items.map((l, i) => (
                                  <li key={i} className="flex justify-between">
                                    <span>{l.title} ({l.color} · {l.size}) × {l.qty}</span>
                                    <span className="font-semibold">{formatINR(l.price * l.qty)}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <p className="mb-1 text-[11px] font-bold uppercase tracking-wide text-ink-soft">Deliver to</p>
                              <p className="text-[13px] text-ink-soft">
                                {o.customer.name}, {o.customer.phone}
                                {o.customer.email ? `, ${o.customer.email}` : ""}<br />
                                {o.customer.address}, {o.customer.city}, {o.customer.state} — {o.customer.pincode}
                              </p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
