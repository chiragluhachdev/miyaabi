"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useStore } from "@/context/StoreContext";
import { placeOrder } from "@/lib/clientApi";
import { formatINR } from "@/lib/format";

const FREE_SHIP_OVER = 1499;
const SHIP_FEE = 49;

const INDIAN_STATES = [
  "Andhra Pradesh","Assam","Bihar","Chhattisgarh","Delhi","Goa","Gujarat","Haryana",
  "Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra",
  "Odisha","Punjab","Rajasthan","Tamil Nadu","Telangana","Uttar Pradesh","Uttarakhand",
  "West Bengal","Other",
];

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useStore();
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [error, setError] = useState("");
  const [placing, setPlacing] = useState(false);

  const shipping = cartTotal >= FREE_SHIP_OVER || cartTotal === 0 ? 0 : SHIP_FEE;
  const total = cartTotal + shipping;
  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!/^\d{10}$/.test(form.phone.replace(/\D/g, "").slice(-10))) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }
    if (!/^\d{6}$/.test(form.pincode)) {
      setError("Please enter a valid 6-digit pincode.");
      return;
    }
    setPlacing(true);
    try {
      const order = await placeOrder({
        items: cart.map((l) => ({
          handle: l.handle,
          title: l.title,
          image: l.image,
          price: l.price,
          size: l.size,
          color: l.color,
          qty: l.qty,
        })),
        customer: form,
        paymentMethod: "COD",
      });
      clearCart();
      router.push(`/order-confirmation/${order._id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not place order");
      setPlacing(false);
    }
  };

  if (!cart.length) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <h1 className="font-display text-2xl font-black uppercase">Your cart is empty</h1>
        <p className="mt-2 text-sm text-ink-soft">Add a few pieces before checking out.</p>
        <Link
          href="/collections/new-arrivals"
          className="mt-6 inline-block rounded-full bg-ink px-8 py-3 text-[13px] font-bold uppercase tracking-wide text-white hover:bg-brand"
        >
          Shop new arrivals
        </Link>
      </div>
    );
  }

  const input =
    "w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-ink";

  return (
    <div className="mx-auto max-w-[1100px] px-4 py-10 lg:px-6">
      <h1 className="font-display text-3xl font-black uppercase">Checkout</h1>
      <span className="mt-2 mb-8 block h-1 w-12 rounded-full bg-brand" />

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        {/* Shipping form */}
        <form onSubmit={submit} className="space-y-4">
          <h2 className="text-sm font-extrabold uppercase tracking-wide">Shipping details</h2>
          {error && (
            <p className="rounded-lg bg-brand/10 px-3 py-2 text-[13px] text-brand">{error}</p>
          )}
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-[12px] font-semibold text-ink-soft">Full name *</span>
              <input required value={form.name} onChange={(e) => set("name", e.target.value)} className={input} />
            </label>
            <label className="block">
              <span className="mb-1 block text-[12px] font-semibold text-ink-soft">Phone *</span>
              <input required value={form.phone} onChange={(e) => set("phone", e.target.value)} className={input} placeholder="10-digit mobile" />
            </label>
          </div>
          <label className="block">
            <span className="mb-1 block text-[12px] font-semibold text-ink-soft">Email (optional)</span>
            <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} className={input} />
          </label>
          <label className="block">
            <span className="mb-1 block text-[12px] font-semibold text-ink-soft">Address *</span>
            <textarea required value={form.address} onChange={(e) => set("address", e.target.value)} className={`${input} min-h-20`} placeholder="House no, street, area, landmark" />
          </label>
          <div className="grid gap-4 sm:grid-cols-3">
            <label className="block">
              <span className="mb-1 block text-[12px] font-semibold text-ink-soft">City *</span>
              <input required value={form.city} onChange={(e) => set("city", e.target.value)} className={input} />
            </label>
            <label className="block">
              <span className="mb-1 block text-[12px] font-semibold text-ink-soft">State *</span>
              <select required value={form.state} onChange={(e) => set("state", e.target.value)} className={input}>
                <option value="">Select…</option>
                {INDIAN_STATES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-1 block text-[12px] font-semibold text-ink-soft">Pincode *</span>
              <input required value={form.pincode} onChange={(e) => set("pincode", e.target.value)} className={input} placeholder="6-digit" />
            </label>
          </div>

          <div className="rounded-xl border-2 border-ink bg-ink/5 px-4 py-3">
            <p className="flex items-center gap-2 text-sm font-bold text-ink">
              <span className="text-lg">💸</span> Cash on Delivery
            </p>
            <p className="mt-1 text-[12px] text-ink-soft">
              Pay in cash when your order arrives. No advance payment needed.
            </p>
          </div>

          <button
            type="submit"
            disabled={placing}
            className="w-full rounded-full bg-brand py-4 text-[14px] font-bold uppercase tracking-wide text-white hover:bg-brand-dark disabled:opacity-60"
          >
            {placing ? "Placing order…" : `Place order · ${formatINR(total)}`}
          </button>
        </form>

        {/* Order summary */}
        <aside className="h-fit rounded-xl border border-line bg-cream/50 p-5 lg:sticky lg:top-24">
          <h2 className="mb-4 text-sm font-extrabold uppercase tracking-wide">Order summary</h2>
          <div className="space-y-3">
            {cart.map((l, i) => (
              <div key={i} className="flex gap-3">
                <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-md bg-white">
                  <Image src={l.image} alt={l.title} fill sizes="56px" className="object-cover" />
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-ink px-1 text-[10px] font-bold text-white">
                    {l.qty}
                  </span>
                </div>
                <div className="flex flex-1 flex-col">
                  <p className="text-[12px] font-semibold leading-snug">{l.title}</p>
                  <p className="text-[11px] text-ink-soft">{l.color} · {l.size}</p>
                  <p className="mt-auto text-[12px] font-bold">{formatINR(l.price * l.qty)}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 space-y-1.5 border-t border-line pt-4 text-sm">
            <div className="flex justify-between"><span className="text-ink-soft">Subtotal</span><span>{formatINR(cartTotal)}</span></div>
            <div className="flex justify-between"><span className="text-ink-soft">Shipping</span><span>{shipping === 0 ? "FREE" : formatINR(shipping)}</span></div>
            <div className="mt-2 flex justify-between border-t border-line pt-2 text-base font-extrabold"><span>Total</span><span>{formatINR(total)}</span></div>
          </div>
        </aside>
      </div>
    </div>
  );
}
