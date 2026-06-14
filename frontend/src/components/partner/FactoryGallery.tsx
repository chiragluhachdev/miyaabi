import Image from "next/image";
import Reveal from "@/components/Reveal";

export default function FactoryGallery({ images }: { images: string[] }) {
  if (!images?.length) return null;
  return (
    <section className="bg-cream">
      <div className="mx-auto max-w-[1280px] px-4 py-14 lg:px-6">
        <div className="mb-8 text-center">
          <p className="text-[12px] font-bold uppercase tracking-[0.3em] text-brand">
            Behind The Scenes
          </p>
          <h2 className="font-display mt-2 text-3xl font-black uppercase tracking-tight sm:text-4xl">
            Factory Gallery
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
          {images.map((src, i) => (
            <Reveal key={i} delay={(i % 3) * 90}>
              <div className="relative aspect-square overflow-hidden rounded-xl bg-white">
                <Image
                  src={src}
                  alt={`Factory photo ${i + 1}`}
                  fill
                  sizes="(max-width:768px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
