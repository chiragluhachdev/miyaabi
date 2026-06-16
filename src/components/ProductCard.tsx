"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/data/types";
import { formatINR } from "@/lib/format";
import { useStore } from "@/context/StoreContext";
import { stockBadge, badgeClasses } from "@/lib/badges";
import { PlusIcon, HeartIcon } from "./Icons";

export default function ProductCard({
  product,
  className = "",
}: {
  product: Product;
  className?: string;
}) {
  const { addToCart, toggleWishlist, inWishlist } = useStore();
  const hasSecond = product.images.length > 1;
  const onSale = product.compareAtPrice != null;
  const badge = stockBadge(product);
  const buyable = product.available && !product.comingSoon;
  const wished = inWishlist(product.handle);

  const quickAdd = () => {
    if (!buyable) return;
    addToCart({
      handle: product.handle,
      title: product.title,
      price: product.price,
      image: product.images[0],
      size: product.sizes[0],
      color: product.colors[0]?.name ?? "Default",
    });
  };

  return (
    <div className={`group flex flex-col ${className}`}>
      <Link
        href={`/products/${product.handle}`}
        className="relative block overflow-hidden rounded-xl bg-cream ring-1 ring-line/60 transition-shadow duration-300 group-hover:shadow-[0_12px_30px_rgba(0,0,0,0.10)]"
      >
        <div className="relative aspect-[5/6]">
          <Image
            src={product.images[0]}
            alt={product.title}
            fill
            sizes="(max-width:768px) 50vw, 25vw"
            className={`object-cover transition-opacity duration-300 ${
              hasSecond ? "group-hover:opacity-0" : ""
            }`}
          />
          {hasSecond && (
            <Image
              src={product.images[1]}
              alt=""
              fill
              sizes="(max-width:768px) 50vw, 25vw"
              className="object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            />
          )}
        </div>

        {badge && (
          <span
            className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${badgeClasses[badge.tone]}`}
          >
            {badge.label}
          </span>
        )}

        {/* Wishlist heart */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product.handle);
          }}
          className={`absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm transition-colors hover:bg-white ${
            wished ? "text-brand" : "text-ink"
          }`}
          aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
        >
          <HeartIcon
            width={17}
            height={17}
            fill={wished ? "currentColor" : "none"}
          />
        </button>

        {buyable && (
          <button
            onClick={(e) => {
              e.preventDefault();
              quickAdd();
            }}
            className="absolute bottom-3 right-3 flex h-9 w-9 translate-y-2 items-center justify-center rounded-full bg-white text-ink opacity-0 shadow-md transition-all hover:bg-ink hover:text-white group-hover:translate-y-0 group-hover:opacity-100"
            aria-label={`Add ${product.title} to cart`}
          >
            <PlusIcon width={18} height={18} />
          </button>
        )}
      </Link>

      <div className="mt-3 flex flex-1 flex-col">
        <Link
          href={`/products/${product.handle}`}
          className="line-clamp-2 text-[13px] font-semibold leading-snug text-ink hover:text-brand"
        >
          {product.title}
        </Link>
        <div className="mt-1.5 flex items-center gap-2">
          <span className="text-[14px] font-bold text-ink">
            {formatINR(product.price)}
          </span>
          {onSale && (
            <span className="text-[12px] text-ink-soft line-through">
              {formatINR(product.compareAtPrice!)}
            </span>
          )}
        </div>
        {product.colors.length > 1 && (
          <div className="mt-2 flex items-center gap-1.5">
            {product.colors.map((c) => (
              <span
                key={c.name}
                title={c.name}
                className="h-3.5 w-3.5 rounded-full border border-line"
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
