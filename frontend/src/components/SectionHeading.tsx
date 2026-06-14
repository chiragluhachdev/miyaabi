import Link from "next/link";

export default function SectionHeading({
  title,
  viewAllHref,
  children,
}: {
  title: string;
  viewAllHref?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <div>
        <h2 className="section-title text-2xl leading-none sm:text-[28px]">
          {title}
        </h2>
        <span className="mt-2 block h-1 w-12 rounded-full bg-brand" />
      </div>
      <div className="flex items-center gap-3">
        {viewAllHref && (
          <Link
            href={viewAllHref}
            className="hidden text-[12px] font-bold uppercase tracking-wide text-ink-soft transition-colors hover:text-brand sm:inline"
          >
            View all →
          </Link>
        )}
        {children}
      </div>
    </div>
  );
}
