"use client";

import { useRef } from "react";
import { Product } from "@/data/types";
import ProductCard from "./ProductCard";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";
import { ChevronLeft, ChevronRight } from "./Icons";

export default function ProductCarousel({
  title,
  products,
  viewAllHref,
}: {
  title: string;
  products: Product[];
  viewAllHref?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const scroll = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir * (el.clientWidth * 0.8), behavior: "smooth" });
  };

  return (
    <section className="mx-auto max-w-[1280px] px-4 py-10 lg:px-6">
      <SectionHeading title={title} viewAllHref={viewAllHref}>
        <button
          onClick={() => scroll(-1)}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-line transition-colors hover:border-ink hover:bg-ink hover:text-white"
          aria-label="Scroll left"
        >
          <ChevronLeft width={18} height={18} />
        </button>
        <button
          onClick={() => scroll(1)}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-line transition-colors hover:border-ink hover:bg-ink hover:text-white"
          aria-label="Scroll right"
        >
          <ChevronRight width={18} height={18} />
        </button>
      </SectionHeading>

      <div
        ref={ref}
        className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 lg:-mx-6 lg:px-6"
      >
        {products.map((p, i) => (
          <Reveal
            key={p.handle}
            delay={Math.min(i, 4) * 90}
            className="w-[46%] shrink-0 snap-start sm:w-[31%] lg:w-[23%]"
          >
            <ProductCard product={p} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
