import Link from "next/link";
import { notFound } from "next/navigation";
import { getOrder } from "@/lib/api";
import { formatINR } from "@/lib/format";
import TrackingId from "@/components/TrackingId";

export const metadata = { title: "Order Confirmed — miyaabi" };

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getOrder(id);
  if (!order) notFound();

  const placed = new Date(order.createdAt);
  const eta = new Date(placed.getTime() + 5 * 24 * 60 * 60 * 1000);
  const fmt = (d: Date) =>
    d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

  return (
    <div className="mx-auto max-w-[760px] px-4 py-12 lg:px-6">
      <div className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl">
          ✓
        </div>
        <h1 className="font-display mt-4 text-3xl font-black uppercase">
          Order Placed Successfully
        </h1>
        <p className="mt-2 text-sm text-ink-soft">
          Thank you, {order.customer.name.split(" ")[0]}! We&apos;ve received your order and will
          confirm it on WhatsApp / phone shortly.
        </p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Info label="Order ID" value={`#${order._id.slice(-6).toUpperCase()}`} />
        <Info label="Payment" value={`${order.paymentMethod} · ${formatINR(order.total)}`} />
        <Info label="Est. Delivery" value={fmt(eta)} />
      </div>

      <div className="mt-6 rounded-xl border border-line bg-cream/50 p-5">
        <h2 className="mb-3 text-sm font-extrabold uppercase tracking-wide">Items</h2>
        <div className="divide-y divide-line">
          {order.items.map((l, i) => (
            <div key={i} className="flex items-center justify-between py-2.5 text-sm">
              <span>
                {l.title}{" "}
                <span className="text-ink-soft">
                  ({l.color} · {l.size}) × {l.qty}
                </span>
              </span>
              <span className="font-semibold">{formatINR(l.price * l.qty)}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-line pt-3 text-base font-extrabold">
          <span>Total ({order.paymentMethod})</span>
          <span>{formatINR(order.total)}</span>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-line p-5 text-sm">
        <h2 className="mb-2 text-sm font-extrabold uppercase tracking-wide">Delivering to</h2>
        <p className="text-ink-soft">
          {order.customer.name}, {order.customer.phone}
          <br />
          {order.customer.address}, {order.customer.city}, {order.customer.state} —{" "}
          {order.customer.pincode}
        </p>
      </div>

      <TrackingId id={order._id} />

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/track"
          className="rounded-full bg-ink px-7 py-3 text-[13px] font-bold uppercase tracking-wide text-white hover:bg-brand"
        >
          Track Order
        </Link>
        <Link
          href="/collections/new-arrivals"
          className="rounded-full border-2 border-ink px-7 py-3 text-[13px] font-bold uppercase tracking-wide text-ink hover:bg-ink hover:text-white"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-line p-4 text-center">
      <p className="text-[11px] font-bold uppercase tracking-wide text-ink-soft">{label}</p>
      <p className="mt-1 font-extrabold text-ink">{value}</p>
    </div>
  );
}
