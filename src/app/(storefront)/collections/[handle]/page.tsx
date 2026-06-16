import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import CollectionView from "@/components/CollectionView";
import { getCollection } from "@/lib/api";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const data = await getCollection(handle);
  return {
    title: data ? `${data.collection.title} — miyaabi` : "Collection — miyaabi",
  };
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const data = await getCollection(handle);
  if (!data) notFound();

  const col = data.collection;
  const products = data.products;

  return (
    <div>
      {/* Banner */}
      <div className="relative h-44 w-full overflow-hidden bg-ink sm:h-56">
        <Image
          src={col.bannerImage}
          alt={col.title}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
          <h1 className="font-display text-3xl font-black uppercase leading-none text-white sm:text-5xl">
            {col.title}
          </h1>
          <p className="mt-2 max-w-xl text-sm text-white/80">{col.description}</p>
        </div>
      </div>

      <nav className="mx-auto max-w-[1280px] px-4 pt-5 text-[12px] text-ink-soft lg:px-6">
        <Link href="/" className="hover:text-ink">
          Home
        </Link>{" "}
        /{" "}
        <Link href="/collections" className="hover:text-ink">
          Collections
        </Link>{" "}
        / <span className="text-ink">{col.title}</span>
      </nav>

      <CollectionView products={products} />
    </div>
  );
}
