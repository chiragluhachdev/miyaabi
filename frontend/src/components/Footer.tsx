import Link from "next/link";
import Logo from "./Logo";
import BrandName from "./BrandName";
import { SiteSettings } from "@/data/types";

export default function Footer({
  footer,
  brand,
}: {
  footer: SiteSettings["footer"];
  brand?: SiteSettings["brand"];
}) {
  const COLUMNS = footer.columns;
  const SOCIAL = footer.social;
  const PAYMENTS = footer.payments;
  void brand;
  return (
    <footer className="mt-16 border-t border-line bg-cream">
      <div className="mx-auto max-w-[1280px] px-4 py-12 lg:px-6">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Logo />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-soft">
              <BrandName /> — {footer.tagline}
            </p>
            <form
              className="mt-5 flex max-w-sm overflow-hidden rounded-full border border-line bg-white"
              action="#"
            >
              <input
                type="email"
                required
                placeholder="Enter your email"
                className="flex-1 bg-transparent px-4 py-2.5 text-sm outline-none"
              />
              <button
                type="submit"
                className="bg-ink px-5 text-[12px] font-bold uppercase tracking-wide text-white hover:bg-brand"
              >
                Subscribe
              </button>
            </form>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.heading}>
              <h3 className="mb-4 text-[12px] font-extrabold uppercase tracking-widest text-ink">
                {col.heading}
              </h3>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-sm text-ink-soft hover:text-ink hover:underline"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-6 border-t border-line pt-6 md:flex-row">
          <div className="flex items-center gap-3">
            {SOCIAL.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-white text-[10px] font-bold text-ink hover:border-ink"
                aria-label={s.label}
              >
                {s.label[0]}
              </a>
            ))}
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {PAYMENTS.map((p) => (
              <span
                key={p}
                className="rounded border border-line bg-white px-2.5 py-1 text-[10px] font-bold text-ink-soft"
              >
                {p}
              </span>
            ))}
          </div>
        </div>

        <p className="mt-6 flex flex-wrap items-center justify-center gap-1 text-center text-[12px] text-ink-soft">
          © {new Date().getFullYear()} <BrandName className="text-[13px]" />. All
          rights reserved.
        </p>
      </div>
    </footer>
  );
}
