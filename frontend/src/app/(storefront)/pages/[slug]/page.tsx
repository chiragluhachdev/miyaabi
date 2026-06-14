import { notFound } from "next/navigation";
import InfoPage from "@/components/InfoPage";
import { PAGE_CONTENT } from "@/data/staticContent";

export function generateStaticParams() {
  return Object.keys(PAGE_CONTENT).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const c = PAGE_CONTENT[slug];
  return { title: c ? `${c.title} — miyaabi` : "miyaabi" };
}

export default async function StaticInfoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const content = PAGE_CONTENT[slug];
  if (!content) notFound();

  return (
    <InfoPage title={content.title} intro={content.intro}>
      {content.body?.map((p, i) => (
        <p key={i}>{p}</p>
      ))}

      {content.faqs && (
        <div className="divide-y divide-line">
          {content.faqs.map((f, i) => (
            <div key={i} className="py-4">
              <p className="font-semibold text-ink">{f.q}</p>
              <p className="mt-1">{f.a}</p>
            </div>
          ))}
        </div>
      )}

      {content.contact && (
        <div className="mt-2 flex flex-wrap gap-3">
          <a
            href="https://wa.me/919891829976"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-[#25D366] px-6 py-3 text-[13px] font-bold uppercase tracking-wide text-white hover:brightness-95"
          >
            Chat on WhatsApp
          </a>
          <a
            href="mailto:hello@miyaabi.com"
            className="rounded-full border-2 border-ink px-6 py-3 text-[13px] font-bold uppercase tracking-wide text-ink hover:bg-ink hover:text-white"
          >
            Email us
          </a>
        </div>
      )}
    </InfoPage>
  );
}
