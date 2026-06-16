const DEFAULT_MESSAGES = [
  "🔥 New season drop is LIVE now!",
  "✈️ International Shipping Available",
  "🏏 Premium sportswear, engineered for performance",
];

export default function AnnouncementBar({ messages }: { messages?: string[] }) {
  const list = messages && messages.length ? messages : DEFAULT_MESSAGES;
  const strip = [...list, ...list];
  return (
    <div className="bg-ink text-white text-[12px] sm:text-[13px] font-medium overflow-hidden">
      <div className="relative flex w-max animate-marquee whitespace-nowrap py-2">
        {strip.map((m, i) => (
          <span key={i} className="mx-6 inline-flex items-center gap-2">
            {m}
          </span>
        ))}
      </div>
    </div>
  );
}
