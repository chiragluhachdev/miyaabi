"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAdminAuth } from "@/context/AdminAuthContext";
import BrandName from "@/components/BrandName";

const NAV = [
  { label: "Dashboard", href: "/admin", icon: "▦" },
  { label: "Homepage", href: "/admin/homepage", icon: "🏠" },
  { label: "Products", href: "/admin/products", icon: "👕" },
  { label: "Collections", href: "/admin/collections", icon: "🗂" },
  { label: "Hero Banners", href: "/admin/banners", icon: "🖼" },
  { label: "Orders", href: "/admin/orders", icon: "📦" },
  { label: "Site Settings", href: "/admin/settings", icon: "⚙️" },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { admin, ready, logout } = useAdminAuth();

  const isLogin = pathname === "/admin/login";

  useEffect(() => {
    if (ready && !admin && !isLogin) router.replace("/admin/login");
  }, [ready, admin, isLogin, router]);

  // Login page renders without the shell
  if (isLogin) return <>{children}</>;

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream text-ink-soft">
        Loading…
      </div>
    );
  }

  if (!admin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream text-ink-soft">
        Redirecting to login…
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-cream">
      {/* Sidebar */}
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-line bg-white md:flex">
        <div className="border-b border-line px-5 py-4">
          <BrandName className="text-xl" />
          <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-widest text-ink-soft">
            Admin Console
          </p>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {NAV.map((item) => {
            const active =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors ${
                  active
                    ? "bg-ink text-white"
                    : "text-ink-soft hover:bg-cream hover:text-ink"
                }`}
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-line p-3">
          <Link
            href="/"
            target="_blank"
            className="block rounded-lg px-3 py-2 text-[13px] text-ink-soft hover:text-ink"
          >
            ↗ View storefront
          </Link>
          <button
            onClick={logout}
            className="mt-1 w-full rounded-lg px-3 py-2 text-left text-[13px] font-semibold text-brand hover:bg-brand/5"
          >
            Log out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-white/90 px-5 py-3 backdrop-blur">
          <div className="flex items-center gap-3 md:hidden">
            <BrandName className="text-lg" />
          </div>
          <div className="ml-auto flex items-center gap-3 text-sm">
            <span className="text-ink-soft">
              {admin.name} · <span className="text-ink">{admin.email}</span>
            </span>
            <button
              onClick={logout}
              className="rounded-full border border-line px-3 py-1.5 text-[12px] font-semibold hover:border-ink md:hidden"
            >
              Log out
            </button>
          </div>
        </header>
        <main className="flex-1 p-5 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
