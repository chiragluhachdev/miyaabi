import Link from "next/link";
import Logo from "@/components/Logo";

export const metadata = {
  title: "Partner Portal — miyaabi",
  robots: { index: false, follow: false },
};

export default function PartnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="sticky top-0 z-30 border-b border-line bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-[64px] max-w-[1280px] items-center justify-between px-4 lg:px-6">
          <Logo height={42} />
          <span className="rounded-full bg-ink px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest text-white">
            Partner Portal
          </span>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-line bg-cream py-6 text-center text-[12px] text-ink-soft">
        © {new Date().getFullYear()} miyaabi · Confidential — for partners only.
        <span className="mx-2">·</span>
        <Link href="/" className="hover:text-ink">
          ← Back to store
        </Link>
      </footer>
    </div>
  );
}
