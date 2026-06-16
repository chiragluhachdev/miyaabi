"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "./Icons";
import { Banner } from "@/data/types";

const INTERVAL = 2000;

export default function HeroSlideshow({ slides }: { slides: Banner[] }) {
  const SLIDES = slides;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const go = useCallback(
    (n: number) => {
      setIndex((prev) => {
        void prev;
        return (n + SLIDES.length) % SLIDES.length;
      });
    },
    [SLIDES.length]
  );

  useEffect(() => {
    if (paused || SLIDES.length <= 1) return;
    timer.current = setInterval(() => {
      setIndex((prev) => (prev + 1) % SLIDES.length);
    }, INTERVAL);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [paused, SLIDES.length]);

  return (
    <section
      className="relative w-full overflow-hidden bg-ink"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
    >
      <div className="relative aspect-[16/10] w-full sm:aspect-[16/7] lg:aspect-[16/6]">
        {SLIDES.map((slide, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-700 ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
            aria-hidden={i !== index}
          >
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              priority={i === 0}
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/10 to-transparent" />
            <div className="absolute inset-0 flex items-center">
              <div className="mx-auto w-full max-w-[1280px] px-6 lg:px-10">
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-white/80 sm:text-sm">
                  {slide.eyebrow}
                </p>
                <h2 className="font-display max-w-2xl text-3xl font-black uppercase leading-[0.95] text-white sm:text-5xl lg:text-6xl">
                  {slide.title}
                </h2>
                <Link
                  href={slide.href}
                  className="group/cta mt-6 inline-flex items-center gap-2 rounded-full bg-brand px-8 py-3.5 text-[13px] font-bold uppercase tracking-wide text-white shadow-lg shadow-brand/30 transition-all hover:bg-white hover:text-ink"
                >
                  {slide.cta}
                  <span className="transition-transform group-hover/cta:translate-x-1">
                    →
                  </span>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Arrows */}
      <button
        onClick={() => go(index - 1)}
        className="absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-ink shadow hover:bg-white"
        aria-label="Previous slide"
      >
        <ChevronLeft width={22} height={22} />
      </button>
      <button
        onClick={() => go(index + 1)}
        className="absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-ink shadow hover:bg-white"
        aria-label="Next slide"
      >
        <ChevronRight width={22} height={22} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => go(i)}
            className={`h-2.5 rounded-full transition-all ${
              i === index ? "w-7 bg-white" : "w-2.5 bg-white/50 hover:bg-white/80"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
