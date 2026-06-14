// Convert a YouTube/Vimeo watch URL into an embeddable iframe src.
function toEmbed(url: string): string | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "");
    if (host === "youtu.be") return `https://www.youtube.com/embed${u.pathname}`;
    if (host.endsWith("youtube.com")) {
      const id = u.searchParams.get("v");
      if (id) return `https://www.youtube.com/embed/${id}`;
      if (u.pathname.startsWith("/embed/")) return url;
      if (u.pathname.startsWith("/shorts/"))
        return `https://www.youtube.com/embed/${u.pathname.split("/")[2]}`;
    }
    if (host.endsWith("vimeo.com")) {
      const id = u.pathname.split("/").filter(Boolean)[0];
      if (id) return `https://player.vimeo.com/video/${id}`;
    }
    return url; // assume it's already an embeddable URL
  } catch {
    return null;
  }
}

export default function VideoEmbed({
  url,
  caption,
}: {
  url: string;
  caption?: string;
}) {
  const src = toEmbed(url);
  if (!src) return null;

  return (
    <section className="mx-auto max-w-[1100px] px-4 py-12 lg:px-6">
      <div className="overflow-hidden rounded-2xl border border-line bg-ink shadow-sm">
        <div className="relative aspect-video">
          <iframe
            src={src}
            title={caption || "Factory walkthrough"}
            className="absolute inset-0 h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
      {caption && (
        <p className="mt-3 text-center text-sm text-ink-soft">{caption}</p>
      )}
    </section>
  );
}
