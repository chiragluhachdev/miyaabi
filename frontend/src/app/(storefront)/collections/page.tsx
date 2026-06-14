import Link from "next/link";
import Image from "next/image";
import { getCollections } from "@/lib/api";

export const metadata = {
  title: "All Collections — miyaabi",
};

export default async function CollectionsIndex() {
  const all = await getCollections();
  const collections = all.filter((c) => (c.productCount ?? 0) > 0);

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-10 lg:px-6">
      <nav className="mb-4 text-[12px] text-ink-soft">
        <Link href="/" className="hover:text-ink">
          Home
        </Link>{" "}
        / <span className="text-ink">Collections</span>
      </nav>
      <h1 className="font-display mb-2 text-3xl font-black uppercase leading-none sm:text-4xl">
        Shop All Collections
      </h1>
      <span className="mb-8 block h-1 w-12 rounded-full bg-brand" />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {collections.map((c) => {
          const count = c.productCount ?? 0;
          return (
            <Link
              key={c.handle}
              href={`/collections/${c.handle}`}
              className="group relative block overflow-hidden rounded-xl"
            >
              <div className="relative aspect-[4/3]">
                <Image
                  src={c.bannerImage}
                  alt={c.title}
                  fill
                  sizes="(max-width:768px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  <p className="text-sm font-extrabold uppercase tracking-wide text-white">
                    {c.title}
                  </p>
                  <p className="text-[11px] text-white/75">{count} items</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
