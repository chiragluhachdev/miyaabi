import Link from "next/link";
import OrderTracker from "@/components/OrderTracker";

export const metadata = { title: "Track Order — miyaabi" };

export default function TrackOrderPage() {
  return (
    <div className="mx-auto max-w-[760px] px-4 py-12 lg:px-6">
      <h1 className="font-display text-3xl font-black uppercase">Track Your Order</h1>
      <p className="mt-2 text-sm text-ink-soft">
        Orders placed on this device show up automatically. You can also look up any
        order by its tracking ID.
      </p>

      <OrderTracker />

      <div className="mt-10 border-t border-line pt-6 text-sm text-ink-soft">
        Need help with an order or a return?{" "}
        <Link href="/pages/contact" className="font-semibold underline hover:text-brand">
          Contact support
        </Link>
        .
      </div>
    </div>
  );
}
