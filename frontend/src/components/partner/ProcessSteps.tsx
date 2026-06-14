import Image from "next/image";
import Reveal from "@/components/Reveal";
import { PartnerProcessStep } from "@/data/types";

export default function ProcessSteps({ steps }: { steps: PartnerProcessStep[] }) {
  if (!steps?.length) return null;
  return (
    <section className="mx-auto max-w-[1100px] px-4 py-14 lg:px-6">
      <div className="mb-10 text-center">
        <p className="text-[12px] font-bold uppercase tracking-[0.3em] text-brand">
          How It's Made
        </p>
        <h2 className="font-display mt-2 text-3xl font-black uppercase tracking-tight sm:text-4xl">
          The Manufacturing Process
        </h2>
      </div>

      <div className="space-y-10 lg:space-y-16">
        {steps.map((step, i) => (
          <Reveal key={i}>
            <div
              className={`grid items-center gap-6 lg:grid-cols-2 lg:gap-12 ${
                i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
              }`}
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-cream">
                {step.image && (
                  <Image
                    src={step.image}
                    alt={step.title}
                    fill
                    sizes="(max-width:1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                )}
                <span className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-brand text-sm font-black text-white">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <div>
                <h3 className="font-display text-2xl font-extrabold uppercase tracking-tight">
                  {step.title}
                </h3>
                <span className="mt-2 block h-1 w-10 rounded-full bg-brand" />
                <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">
                  {step.description}
                </p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
