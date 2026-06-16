"use client";

import { useMemo, useState } from "react";
import { Product, SortKey } from "@/data/types";
import {
  FilterState,
  SORT_OPTIONS,
  facetsFor,
  filterAndSort,
} from "@/lib/selectors";
import { formatINR } from "@/lib/format";
import ProductGrid from "./ProductGrid";
import { ChevronDown, CloseIcon } from "./Icons";

const EMPTY: FilterState = {
  availability: [],
  sizes: [],
  colors: [],
  brands: [],
};

export default function CollectionView({ products }: { products: Product[] }) {
  const facets = useMemo(() => facetsFor(products), [products]);
  const [filters, setFilters] = useState<FilterState>(EMPTY);
  const [sort, setSort] = useState<SortKey>("featured");
  const [maxPrice, setMaxPrice] = useState(facets.maxPrice);
  const [mobileOpen, setMobileOpen] = useState(false);

  const visible = useMemo(
    () => filterAndSort(products, { ...filters, maxPrice }, sort),
    [products, filters, maxPrice, sort]
  );

  const toggle = (key: keyof FilterState, value: string) => {
    setFilters((prev) => {
      const arr = prev[key] as string[];
      const next = arr.includes(value)
        ? arr.filter((v) => v !== value)
        : [...arr, value];
      return { ...prev, [key]: next };
    });
  };

  const activeCount =
    filters.availability.length +
    filters.sizes.length +
    filters.colors.length +
    filters.brands.length +
    (maxPrice < facets.maxPrice ? 1 : 0);

  const clearAll = () => {
    setFilters(EMPTY);
    setMaxPrice(facets.maxPrice);
  };

  const FilterPanel = (
    <div className="space-y-6">
      <FacetGroup title="Availability">
        {[
          { v: "in", label: "In stock" },
          { v: "out", label: "Out of stock" },
        ].map((o) => (
          <Check
            key={o.v}
            label={o.label}
            checked={filters.availability.includes(o.v as "in" | "out")}
            onChange={() => toggle("availability", o.v)}
          />
        ))}
      </FacetGroup>

      <FacetGroup title={`Price · up to ${formatINR(maxPrice)}`}>
        <input
          type="range"
          min={facets.minPrice}
          max={facets.maxPrice}
          step={100}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full accent-brand"
        />
        <div className="flex justify-between text-[11px] text-ink-soft">
          <span>{formatINR(facets.minPrice)}</span>
          <span>{formatINR(facets.maxPrice)}</span>
        </div>
      </FacetGroup>

      {facets.sizes.length > 0 && (
        <FacetGroup title="Size">
          <div className="flex flex-wrap gap-2">
            {facets.sizes.map((s) => (
              <button
                key={s}
                onClick={() => toggle("sizes", s)}
                className={`min-w-9 rounded-md border px-2.5 py-1.5 text-[12px] font-semibold ${
                  filters.sizes.includes(s)
                    ? "border-ink bg-ink text-white"
                    : "border-line text-ink hover:border-ink"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </FacetGroup>
      )}

      {facets.colors.length > 0 && (
        <FacetGroup title="Color">
          <div className="flex flex-wrap gap-2">
            {facets.colors.map((c) => (
              <button
                key={c.name}
                onClick={() => toggle("colors", c.name)}
                title={c.name}
                className={`h-7 w-7 rounded-full border-2 ${
                  filters.colors.includes(c.name)
                    ? "border-ink ring-2 ring-ink/20"
                    : "border-line"
                }`}
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>
        </FacetGroup>
      )}

      {facets.brands.length > 1 && (
        <FacetGroup title="Brand">
          {facets.brands.map((b) => (
            <Check
              key={b}
              label={b}
              checked={filters.brands.includes(b)}
              onChange={() => toggle("brands", b)}
            />
          ))}
        </FacetGroup>
      )}

      {activeCount > 0 && (
        <button
          onClick={clearAll}
          className="text-[12px] font-semibold text-brand hover:underline"
        >
          Clear all filters
        </button>
      )}
    </div>
  );

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-8 lg:px-6">
      {/* Toolbar */}
      <div className="mb-6 flex items-center justify-between gap-3">
        <button
          onClick={() => setMobileOpen(true)}
          className="rounded-full border border-line px-4 py-2 text-[12px] font-bold uppercase tracking-wide lg:hidden"
        >
          Filter {activeCount > 0 && `(${activeCount})`}
        </button>
        <p className="hidden text-sm text-ink-soft lg:block">
          {visible.length} {visible.length === 1 ? "product" : "products"}
        </p>
        <label className="flex items-center gap-2 text-sm">
          <span className="hidden text-ink-soft sm:inline">Sort by:</span>
          <div className="relative">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="appearance-none rounded-full border border-line bg-white py-2 pl-4 pr-9 text-[13px] font-semibold outline-none hover:border-ink"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.key} value={o.key}>
                  {o.label}
                </option>
              ))}
            </select>
            <ChevronDown
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
              width={14}
              height={14}
            />
          </div>
        </label>
      </div>

      <div className="flex gap-8">
        {/* Desktop sidebar */}
        <aside className="hidden w-60 shrink-0 lg:block">{FilterPanel}</aside>

        <div className="flex-1">
          <ProductGrid products={visible} />
        </div>
      </div>

      {/* Mobile filter drawer */}
      <div
        className={`fixed inset-0 z-50 bg-black/40 transition-opacity lg:hidden ${
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setMobileOpen(false)}
      />
      <aside
        className={`fixed right-0 top-0 z-50 h-full w-[85%] max-w-[340px] overflow-y-auto bg-white p-5 shadow-xl transition-transform lg:hidden ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-sm font-extrabold uppercase tracking-widest">
            Filters
          </h3>
          <button onClick={() => setMobileOpen(false)} aria-label="Close filters">
            <CloseIcon width={22} height={22} />
          </button>
        </div>
        {FilterPanel}
        <button
          onClick={() => setMobileOpen(false)}
          className="mt-6 w-full rounded-full bg-ink py-3 text-[13px] font-bold uppercase tracking-wide text-white"
        >
          Show {visible.length} results
        </button>
      </aside>
    </div>
  );
}

function FacetGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border-b border-line pb-5">
      <button
        onClick={() => setOpen((v) => !v)}
        className="mb-3 flex w-full items-center justify-between text-[12px] font-extrabold uppercase tracking-widest text-ink"
      >
        {title}
        <ChevronDown
          width={16}
          height={16}
          className={`transition-transform ${open ? "" : "-rotate-90"}`}
        />
      </button>
      {open && <div className="space-y-2.5">{children}</div>}
    </div>
  );
}

function Check({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 text-[13px] text-ink">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 accent-brand"
      />
      {label}
    </label>
  );
}
