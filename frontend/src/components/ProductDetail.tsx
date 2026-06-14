"use client";

import { useState } from "react";
import Image from "next/image";
import { Product } from "@/data/types";
import { formatINR } from "@/lib/format";
import { useStore } from "@/context/StoreContext";
import { PlusIcon, MinusIcon, ChevronDown } from "./Icons";

export default function ProductDetail({ product }: { product: Product }) {
  const { addToCart } = useStore();
  const [activeImg, setActiveImg] = useState(0);
  const [size, setSize] = useState(product.sizes[0]);
  const [color, setColor] = useState(product.colors[0]?.name ?? "Default");
  const [qty, setQty] = useState(1);
  const [openAcc, setOpenAcc] = useState<string | null>("desc");

  const onSale = product.compareAtPrice != null;

  const add = () => {
    addToCart({
      handle: product.handle,
      title: product.title,
      price: product.price,
      image: product.images[0],
      size,
      color,
      qty,
    });
  };

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      {/* Gallery */}
      <div className="flex flex-col gap-3 lg:flex-row-reverse">
        <div className="relative aspect-[5/6] flex-1 overflow-hidden rounded-xl bg-cream">
          <Image
            src={product.images[activeImg]}
            alt={product.title}
            fill
            priority
            sizes="(max-width:1024px) 100vw, 50vw"
            className="object-cover"
          />
          {product.badge && (
            <span
              className={`absolute left-4 top-4 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white ${
                product.badge === "Sale" ? "bg-brand" : "bg-ink"
              }`}
            >
              {product.badge}
            </span>
          )}
        </div>
        <div className="flex gap-3 lg:flex-col">
          {product.images.map((img, i) => (
            <button
              key={img}
              onClick={() => setActiveImg(i)}
              className={`relative h-20 w-16 shrink-0 overflow-hidden rounded-lg border-2 ${
                i === activeImg ? "border-ink" : "border-transparent"
              }`}
            >
              <Image src={img} alt="" fill sizes="64px" className="object-cover" />
            </button>
          ))}
        </div>
      </div>

      {/* Info */}
      <div>
        <p className="text-[12px] font-bold uppercase tracking-widest text-brand">
          {product.brand}
        </p>
        <h1 className="font-display mt-1 text-2xl font-extrabold leading-tight sm:text-[32px]">
          {product.title}
        </h1>

        <div className="mt-3 flex items-center gap-3">
          <span className="text-2xl font-black">{formatINR(product.price)}</span>
          {onSale && (
            <>
              <span className="text-lg text-ink-soft line-through">
                {formatINR(product.compareAtPrice!)}
              </span>
              <span className="rounded-full bg-brand/10 px-2 py-0.5 text-[12px] font-bold text-brand">
                Save {formatINR(product.compareAtPrice! - product.price)}
              </span>
            </>
          )}
        </div>
        <p className="mt-1 text-[12px] text-ink-soft">
          Inclusive of all taxes. Free shipping over {formatINR(1499)}.
        </p>

        {/* Colors */}
        {product.colors.length > 0 && (
          <div className="mt-6">
            <p className="mb-2 text-[12px] font-bold uppercase tracking-wide">
              Color: <span className="text-ink-soft">{color}</span>
            </p>
            <div className="flex gap-2">
              {product.colors.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setColor(c.name)}
                  title={c.name}
                  className={`h-9 w-9 rounded-full border-2 ${
                    color === c.name ? "border-ink ring-2 ring-ink/20" : "border-line"
                  }`}
                  style={{ backgroundColor: c.hex }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Sizes */}
        <div className="mt-6">
          <p className="mb-2 text-[12px] font-bold uppercase tracking-wide">
            Size: <span className="text-ink-soft">{size}</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((s) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className={`min-w-11 rounded-md border px-3 py-2 text-sm font-semibold ${
                  size === s
                    ? "border-ink bg-ink text-white"
                    : "border-line hover:border-ink"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Qty + add */}
        <div className="mt-7 flex items-stretch gap-3">
          <div className="flex items-center rounded-full border border-line">
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="px-4 py-3 text-ink-soft hover:text-ink"
              aria-label="Decrease"
            >
              <MinusIcon width={16} height={16} />
            </button>
            <span className="min-w-8 text-center font-bold">{qty}</span>
            <button
              onClick={() => setQty((q) => q + 1)}
              className="px-4 py-3 text-ink-soft hover:text-ink"
              aria-label="Increase"
            >
              <PlusIcon width={16} height={16} />
            </button>
          </div>
          <button
            onClick={add}
            disabled={!product.available}
            className="flex-1 rounded-full bg-ink py-3.5 text-[13px] font-bold uppercase tracking-wide text-white transition-colors hover:bg-brand disabled:cursor-not-allowed disabled:bg-line disabled:text-ink-soft"
          >
            {product.available ? "Add to cart" : "Sold out"}
          </button>
        </div>
        {product.available && (
          <button className="mt-3 w-full rounded-full border-2 border-ink py-3.5 text-[13px] font-bold uppercase tracking-wide text-ink hover:bg-ink hover:text-white">
            Buy it now
          </button>
        )}

        {/* Accordions */}
        <div className="mt-8 border-t border-line">
          {[
            { id: "desc", title: "Description", body: product.description },
            {
              id: "ship",
              title: "Shipping & Returns",
              body: "Dispatched within 2–4 business days. Free shipping on orders over ₹1,499. Easy 7-day returns on unused items with tags intact.",
            },
            {
              id: "care",
              title: "Material & Care",
              body: "Premium moisture-wicking polyester blend. Machine wash cold, inside out. Do not bleach. Tumble dry low.",
            },
          ].map((acc) => (
            <div key={acc.id} className="border-b border-line">
              <button
                onClick={() => setOpenAcc(openAcc === acc.id ? null : acc.id)}
                className="flex w-full items-center justify-between py-4 text-left text-sm font-bold"
              >
                {acc.title}
                <ChevronDown
                  width={18}
                  height={18}
                  className={`transition-transform ${
                    openAcc === acc.id ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openAcc === acc.id && (
                <p className="pb-4 text-sm leading-relaxed text-ink-soft">
                  {acc.body}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
