"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Logo from "./Logo";
import { useStore } from "@/context/StoreContext";
import { getProducts } from "@/lib/clientApi";
import { formatINR } from "@/lib/format";
import { NavItem, Product, SiteSettings } from "@/data/types";
import {
  SearchIcon,
  UserIcon,
  HeartIcon,
  BagIcon,
  MenuIcon,
  CloseIcon,
  ChevronDown,
} from "./Icons";

export default function Header({
  nav,
  brand,
}: {
  nav: NavItem[];
  brand?: SiteSettings["brand"];
}) {
  const { cartCount, setCartOpen, menuOpen, setMenuOpen } = useStore();
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Debounced live product search against the API.
  useEffect(() => {
    const q = query.trim();
    if (!q) {
      setResults([]);
      return;
    }
    const t = setTimeout(() => {
      getProducts({ search: q, limit: 6 }).then(setResults).catch(() => {});
    }, 220);
    return () => clearTimeout(t);
  }, [query]);

  return (
    <header
      className={`sticky top-0 z-40 bg-white transition-shadow ${
        scrolled ? "shadow-[0_2px_14px_rgba(0,0,0,0.08)]" : "border-b border-line"
      }`}
    >
      <div className="mx-auto flex h-[68px] max-w-[1280px] items-center gap-4 px-4 lg:px-6">
        {/* Mobile menu toggle */}
        <button
          className="lg:hidden -ml-1 p-1 text-ink"
          aria-label="Open menu"
          onClick={() => setMenuOpen(true)}
        >
          <MenuIcon width={24} height={24} />
        </button>

        <Logo className="shrink-0 -ml-1 lg:-ml-3" height={48} />

        {/* Desktop nav */}
        <nav
          className="ml-2 hidden items-center gap-1 lg:flex"
          onMouseLeave={() => setOpenMenu(null)}
        >
          {nav.map((item) => (
            <div
              key={item.label}
              className="relative"
              onMouseEnter={() => setOpenMenu(item.columns ? item.label : null)}
            >
              <Link
                href={item.href}
                className={`flex items-center gap-1 px-3 py-2 text-[13px] font-bold uppercase tracking-wide transition-colors ${
                  item.highlight ? "text-brand" : "text-ink hover:text-brand"
                }`}
              >
                {item.label}
                {item.columns && <ChevronDown width={14} height={14} />}
              </Link>

              {item.columns && openMenu === item.label && (
                <div className="absolute left-0 top-full z-50 w-max min-w-[520px] animate-fade rounded-b-xl border border-line bg-white p-6 shadow-xl">
                  <div className="grid grid-cols-3 gap-8">
                    {item.columns.map((col) => (
                      <div key={col.heading}>
                        <p className="mb-3 text-[11px] font-extrabold uppercase tracking-widest text-brand">
                          {col.heading}
                        </p>
                        <ul className="space-y-2">
                          {col.links.map((l) => (
                            <li key={l.href}>
                              <Link
                                href={l.href}
                                className="block text-[13px] text-ink-soft hover:text-ink hover:underline"
                              >
                                {l.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Search (desktop) */}
        <div className="relative ml-auto hidden flex-1 max-w-[280px] md:block">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setSearchOpen(true)}
            onBlur={() => setTimeout(() => setSearchOpen(false), 150)}
            placeholder="Search"
            className="w-full rounded-full border border-line bg-cream py-2 pl-9 pr-4 text-sm outline-none focus:border-ink"
          />
          {searchOpen && query && (
            <div className="absolute left-0 top-full z-50 mt-2 w-full overflow-hidden rounded-xl border border-line bg-white shadow-xl">
              {results.length ? (
                results.map((p) => (
                  <Link
                    key={p.handle}
                    href={`/products/${p.handle}`}
                    className="flex items-center gap-3 px-3 py-2 hover:bg-cream"
                  >
                    <Image
                      src={p.images[0]}
                      alt=""
                      width={40}
                      height={48}
                      className="h-12 w-10 rounded object-cover"
                    />
                    <span className="flex-1 text-[13px]">{p.title}</span>
                    <span className="text-[13px] font-semibold">
                      {formatINR(p.price)}
                    </span>
                  </Link>
                ))
              ) : (
                <p className="px-3 py-4 text-sm text-ink-soft">
                  No matches for “{query}”.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Right icons */}
        <div className="ml-auto flex items-center gap-1 md:ml-2">
          <button
            className="p-2 text-ink hover:text-brand md:hidden"
            aria-label="Search"
            onClick={() => setSearchOpen((v) => !v)}
          >
            <SearchIcon width={22} height={22} />
          </button>
          <Link href="/account" className="hidden p-2 text-ink hover:text-brand sm:block" aria-label="Account">
            <UserIcon width={22} height={22} />
          </Link>
          <Link href="/wishlist" className="hidden p-2 text-ink hover:text-brand sm:block" aria-label="Wishlist">
            <HeartIcon width={22} height={22} />
          </Link>
          <button
            className="relative p-2 text-ink hover:text-brand"
            aria-label="Cart"
            onClick={() => setCartOpen(true)}
          >
            <BagIcon width={22} height={22} />
            {cartCount > 0 && (
              <span className="absolute -right-0 -top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[10px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile search bar */}
      {searchOpen && (
        <div className="border-t border-line px-4 py-3 md:hidden">
          <div className="relative">
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products"
              className="w-full rounded-full border border-line bg-cream py-2 pl-9 pr-4 text-sm outline-none focus:border-ink"
            />
          </div>
          {query && (
            <div className="mt-2 divide-y divide-line">
              {results.length ? (
                results.map((p) => (
                  <Link
                    key={p.handle}
                    href={`/products/${p.handle}`}
                    onClick={() => setSearchOpen(false)}
                    className="flex items-center gap-3 py-2"
                  >
                    <Image src={p.images[0]} alt="" width={36} height={44} className="h-11 w-9 rounded object-cover" />
                    <span className="flex-1 text-[13px]">{p.title}</span>
                  </Link>
                ))
              ) : (
                <p className="py-3 text-sm text-ink-soft">No matches.</p>
              )}
            </div>
          )}
        </div>
      )}

      <MobileMenu nav={nav} open={menuOpen} onClose={() => setMenuOpen(false)} />
    </header>
  );
}

function MobileMenu({
  nav,
  open,
  onClose,
}: {
  nav: NavItem[];
  open: boolean;
  onClose: () => void;
}) {
  return (
    <>
      <div
        className={`fixed inset-0 z-50 bg-black/40 transition-opacity lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />
      <aside
        className={`fixed left-0 top-0 z-50 h-full w-[84%] max-w-[360px] overflow-y-auto bg-white shadow-xl transition-transform lg:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-line px-4 py-4">
          <Logo />
          <button onClick={onClose} aria-label="Close menu" className="p-1">
            <CloseIcon width={24} height={24} />
          </button>
        </div>
        <nav className="px-4 py-2">
          {nav.map((item) => (
            <div key={item.label} className="border-b border-line py-1">
              <Link
                href={item.href}
                onClick={onClose}
                className={`block py-3 text-sm font-bold uppercase tracking-wide ${
                  item.highlight ? "text-brand" : "text-ink"
                }`}
              >
                {item.label}
              </Link>
              {item.columns && (
                <div className="pb-3">
                  {item.columns.map((col) => (
                    <div key={col.heading} className="mb-2">
                      <p className="mb-1 text-[10px] font-extrabold uppercase tracking-widest text-brand">
                        {col.heading}
                      </p>
                      <ul className="grid grid-cols-2 gap-x-3 gap-y-1">
                        {col.links.map((l) => (
                          <li key={l.href}>
                            <Link
                              href={l.href}
                              onClick={onClose}
                              className="block py-1 text-[13px] text-ink-soft"
                            >
                              {l.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}
