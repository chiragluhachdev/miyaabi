"use client";

import Image from "next/image";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import { formatINR } from "@/lib/format";
import { CloseIcon, PlusIcon, MinusIcon, BagIcon } from "./Icons";

export default function CartDrawer() {
  const {
    cart,
    cartOpen,
    setCartOpen,
    cartTotal,
    cartCount,
    removeFromCart,
    updateQty,
  } = useStore();

  return (
    <>
      <div
        className={`fixed inset-0 z-50 bg-black/40 transition-opacity ${
          cartOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setCartOpen(false)}
      />
      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-[90%] max-w-[420px] flex-col bg-white shadow-xl transition-transform ${
          cartOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-label="Shopping cart"
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="text-sm font-extrabold uppercase tracking-widest">
            Your Cart ({cartCount})
          </h2>
          <button onClick={() => setCartOpen(false)} aria-label="Close cart" className="p-1">
            <CloseIcon width={24} height={24} />
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <BagIcon width={48} height={48} className="text-line" />
            <p className="text-ink-soft">Your cart is empty.</p>
            <button
              onClick={() => setCartOpen(false)}
              className="rounded-full bg-ink px-6 py-2.5 text-[12px] font-bold uppercase tracking-wide text-white hover:bg-brand"
            >
              Continue shopping
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {cart.map((line, i) => (
                <div key={`${line.handle}-${i}`} className="flex gap-3 border-b border-line py-4">
                  <Image
                    src={line.image}
                    alt={line.title}
                    width={72}
                    height={88}
                    className="h-22 w-18 rounded-md object-cover"
                  />
                  <div className="flex flex-1 flex-col">
                    <div className="flex justify-between gap-2">
                      <Link
                        href={`/products/${line.handle}`}
                        onClick={() => setCartOpen(false)}
                        className="text-[13px] font-semibold leading-snug hover:text-brand"
                      >
                        {line.title}
                      </Link>
                      <button
                        onClick={() => removeFromCart(i)}
                        className="shrink-0 text-ink-soft hover:text-brand"
                        aria-label="Remove"
                      >
                        <CloseIcon width={16} height={16} />
                      </button>
                    </div>
                    <p className="mt-0.5 text-[12px] text-ink-soft">
                      {line.color} · {line.size}
                    </p>
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <div className="flex items-center rounded-full border border-line">
                        <button
                          onClick={() => updateQty(i, line.qty - 1)}
                          className="px-2 py-1.5 text-ink-soft hover:text-ink"
                          aria-label="Decrease quantity"
                        >
                          <MinusIcon width={14} height={14} />
                        </button>
                        <span className="min-w-6 text-center text-[13px] font-semibold">
                          {line.qty}
                        </span>
                        <button
                          onClick={() => updateQty(i, line.qty + 1)}
                          className="px-2 py-1.5 text-ink-soft hover:text-ink"
                          aria-label="Increase quantity"
                        >
                          <PlusIcon width={14} height={14} />
                        </button>
                      </div>
                      <span className="text-[13px] font-bold">
                        {formatINR(line.price * line.qty)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-line px-5 py-4">
              <div className="mb-3 flex items-center justify-between text-sm">
                <span className="text-ink-soft">Subtotal</span>
                <span className="text-lg font-extrabold">{formatINR(cartTotal)}</span>
              </div>
              <p className="mb-3 text-[12px] text-ink-soft">
                Taxes and shipping calculated at checkout.
              </p>
              <button className="w-full rounded-full bg-brand py-3.5 text-[13px] font-bold uppercase tracking-wide text-white hover:bg-brand-dark">
                Checkout
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
