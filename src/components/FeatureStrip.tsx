const DEFAULT_FEATURES = [
  { icon: "🚚", title: "Free Shipping", sub: "On orders over ₹1,499" },
  { icon: "🔁", title: "Easy Returns", sub: "7-day hassle-free" },
  { icon: "🔒", title: "Secure Checkout", sub: "100% protected" },
  { icon: "✈️", title: "Ships Worldwide", sub: "International delivery" },
];

export default function FeatureStrip({
  features,
}: {
  features?: { icon: string; title: string; sub: string }[];
}) {
  const FEATURES = features && features.length ? features : DEFAULT_FEATURES;
  return (
    <section className="border-y border-line bg-white">
      <div className="mx-auto grid max-w-[1280px] grid-cols-2 gap-px px-4 py-6 sm:grid-cols-4 lg:px-6">
        {FEATURES.map((f) => (
          <div
            key={f.title}
            className="flex items-center gap-3 px-2 py-2 sm:justify-center"
          >
            <span className="text-2xl" aria-hidden>
              {f.icon}
            </span>
            <div>
              <p className="text-[13px] font-extrabold uppercase tracking-wide text-ink">
                {f.title}
              </p>
              <p className="text-[12px] text-ink-soft">{f.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
