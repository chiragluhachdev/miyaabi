import Link from "next/link";

export default function InfoPage({
  title,
  intro,
  children,
}: {
  title: string;
  intro?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 lg:px-6">
      <nav className="mb-4 text-[12px] text-ink-soft">
        <Link href="/" className="hover:text-ink">
          Home
        </Link>{" "}
        / <span className="text-ink">{title}</span>
      </nav>
      <h1 className="font-display text-3xl font-black uppercase leading-none sm:text-4xl">
        {title}
      </h1>
      <span className="mt-3 block h-1 w-12 rounded-full bg-brand" />
      {intro && (
        <p className="mt-6 text-[15px] leading-relaxed text-ink-soft">{intro}</p>
      )}
      <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-ink-soft">
        {children}
      </div>
    </div>
  );
}
