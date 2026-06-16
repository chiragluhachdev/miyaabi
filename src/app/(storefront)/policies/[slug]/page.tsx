import { notFound } from "next/navigation";
import InfoPage from "@/components/InfoPage";
import { POLICY_CONTENT } from "@/data/staticContent";

export function generateStaticParams() {
  return Object.keys(POLICY_CONTENT).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const c = POLICY_CONTENT[slug];
  return { title: c ? `${c.title} — miyaabi` : "miyaabi" };
}

export default async function PolicyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const content = POLICY_CONTENT[slug];
  if (!content) notFound();

  return (
    <InfoPage title={content.title} intro={content.intro}>
      {content.body?.map((p, i) => (
        <p key={i}>{p}</p>
      ))}
    </InfoPage>
  );
}
