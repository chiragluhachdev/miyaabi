import Image from "next/image";
import Link from "next/link";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";

export interface Tile {
  label: string;
  image: string;
  href: string;
}

export function TileGrid({ title, tiles }: { title: string; tiles: Tile[] }) {
  return (
    <section className="mx-auto max-w-[1280px] px-4 py-10 lg:px-6">
      <SectionHeading title={title} />
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {tiles.map((t, i) => (
          <Reveal key={t.label} delay={i * 90}>
            <Tile tile={t} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function TileCarousel({ title, tiles }: { title: string; tiles: Tile[] }) {
  return (
    <section className="bg-cream">
      <div className="mx-auto max-w-[1280px] px-4 py-10 lg:px-6">
        <SectionHeading title={title} />
        <div className="no-scrollbar -mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-2 lg:-mx-6 lg:px-6">
          {tiles.map((t) => (
            <Tile
              key={t.label}
              tile={t}
              className="w-[70%] shrink-0 snap-start sm:w-[42%] lg:w-[32%]"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function Tile({ tile, className = "" }: { tile: Tile; className?: string }) {
  return (
    <Link
      href={tile.href}
      className={`group relative block overflow-hidden rounded-xl ${className}`}
    >
      <div className="relative aspect-[4/5]">
        <Image
          src={tile.image}
          alt={tile.label}
          fill
          sizes="(max-width:768px) 70vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
        <span className="absolute bottom-4 left-4 right-4 text-sm font-extrabold uppercase tracking-wide text-white">
          {tile.label}
        </span>
      </div>
    </Link>
  );
}
