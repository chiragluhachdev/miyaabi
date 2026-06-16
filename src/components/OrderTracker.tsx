"use client";

import { useEffect, useState } from "react";
import { readOrders } from "@/lib/orders";
import { getOrderById, type OrderRecord } from "@/lib/clientApi";
import { formatINR } from "@/lib/format";

const STATUS_STYLES: Record<string, string> = {
  placed: "bg-amber-100 text-amber-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-indigo-100 text-indigo-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-700",
};

function StatusBadge({ status }: { status: string }) {
  const cls = STATUS_STYLES[status] || "bg-gray-100 text-gray-700";
  return (
    <span className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide ${cls}`}>
      {status}
    </span>
  );
}

function OrderCard({ order }: { order: OrderRecord }) {
  const placed = new Date(order.createdAt);
  const eta = new Date(placed.getTime() + 5 * 24 * 60 * 60 * 1000);
  const fmt = (d: Date) =>
    d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  const count = order.items.reduce((n, l) => n + (l.qty || 1), 0);

  return (
    <div className="rounded-xl border border-line p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wide text-ink-soft">Order</p>
          <p className="font-extrabold text-ink">#{order._id.slice(-6).toUpperCase()}</p>
        </div>
        <StatusBadge status={order.status} />
      </div>
      <div className="mt-3 grid gap-2 text-sm sm:grid-cols-3">
        <p className="text-ink-soft">
          Placed <span className="font-semibold text-ink">{fmt(placed)}</span>
        </p>
        <p className="text-ink-soft">
          {count} item{count === 1 ? "" : "s"} ·{" "}
          <span className="font-semibold text-ink">{formatINR(order.total)}</span>
        </p>
        <p className="text-ink-soft">
          {order.status === "delivered" ? "Delivered" : "Est. delivery"}{" "}
          <span className="font-semibold text-ink">{fmt(eta)}</span>
        </p>
      </div>
      <p className="mt-3 select-all break-all text-xs text-ink-soft">ID: {order._id}</p>
    </div>
  );
}

export default function OrderTracker() {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [looking, setLooking] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const ids = readOrders();
    if (!ids.length) {
      setLoading(false);
      return;
    }
    Promise.all(ids.map(getOrderById))
      .then((list) => setOrders(list.filter(Boolean) as OrderRecord[]))
      .finally(() => setLoading(false));
  }, []);

  const lookup = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = query.trim();
    if (!id) return;
    setLooking(true);
    setError("");
    const order = await getOrderById(id);
    setLooking(false);
    if (!order) {
      setError("No order found with that ID. Double-check and try again.");
      return;
    }
    setOrders((prev) => [order, ...prev.filter((p) => p._id !== order._id)]);
    setQuery("");
  };

  return (
    <div className="mt-8">
      <form onSubmit={lookup} className="flex flex-wrap gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Track by Order / Tracking ID"
          className="min-w-0 flex-1 rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-ink"
        />
        <button
          type="submit"
          disabled={looking}
          className="rounded-full bg-ink px-6 py-2.5 text-[13px] font-bold uppercase tracking-wide text-white hover:bg-brand disabled:opacity-60"
        >
          {looking ? "Looking…" : "Track"}
        </button>
      </form>
      {error && <p className="mt-2 text-sm text-brand">{error}</p>}

      <div className="mt-6 space-y-3">
        {loading ? (
          <p className="text-sm text-ink-soft">Loading your orders…</p>
        ) : orders.length === 0 ? (
          <p className="text-sm text-ink-soft">
            No orders on this device yet. Place an order, or look one up by its tracking ID above.
          </p>
        ) : (
          orders.map((o) => <OrderCard key={o._id} order={o} />)
        )}
      </div>
    </div>
  );
}
