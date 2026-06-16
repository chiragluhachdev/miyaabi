import Link from "next/link";
import BrandName from "./BrandName";

export default function PromoBand({
  eyebrow = "New Season",
  title = "Gear up with miyaabi",
  text = "Performance fabrics, fan-ready designs and athleisure essentials — all in one place.",
  cta = "Shop the collection",
  href = "/collections",
}: {
  eyebrow?: string;
  title?: string;
  text?: string;
  cta?: string;
  href?: string;
}) {
  return (
    <section className="mx-auto max-w-[1280px] px-4 py-10 lg:px-6">
      <div className="group relative overflow-hidden rounded-[2.5rem] bg-ink px-6 py-16 text-center sm:px-12 sm:py-24 transition-all duration-700 hover:shadow-[0_20px_60px_-15px_rgba(225,27,34,0.3)]">
        
        {/* Animated gradient orbs for depth */}
        <div className="pointer-events-none absolute left-1/2 top-0 h-[400px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/20 opacity-40 blur-[100px] transition-opacity duration-1000 group-hover:opacity-70" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-[300px] w-[500px] translate-x-1/4 translate-y-1/4 rounded-full bg-brand-dark/20 opacity-30 blur-[100px] transition-opacity duration-1000 group-hover:opacity-60" />

        {/* diagonal accent lines with subtle animation using group-hover */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.05] transition-transform duration-1000 ease-out group-hover:scale-105"
          style={{
            backgroundImage:
              "repeating-linear-gradient(115deg, #fff 0 1px, transparent 1px 40px)",
          }}
        />
        
        {/* centered brand watermark with scale effect on hover */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center transition-all duration-1000 ease-out group-hover:scale-110">
          <BrandName
            invert
            className="select-none text-[120px] leading-none opacity-[0.02] transition-opacity duration-1000 group-hover:opacity-[0.04] sm:text-[200px] lg:text-[320px]"
          />
        </div>

        {/* Content layer */}
        <div className="relative z-10 flex flex-col items-center justify-center">
          {eyebrow && (
            <div className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/5 px-5 py-2 backdrop-blur-md transition-colors duration-500 group-hover:border-brand/30 group-hover:bg-brand/10">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-brand"></span>
              </span>
              <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-white/90">
                {eyebrow}
              </p>
            </div>
          )}
          
          <h2 className="font-display mx-auto max-w-4xl text-5xl font-black uppercase leading-[0.85] tracking-[-0.02em] text-white drop-shadow-xl sm:text-6xl md:text-7xl lg:text-8xl">
            {title.split(" ").map((word, i) => {
              const cleanWord = word.replace(/[^a-zA-Z]/g, "").toLowerCase();
              const isMiyaabi = cleanWord === "miyaabi";
              return (
                <span
                  key={i}
                  className={
                    isMiyaabi
                      ? "wordmark inline-block bg-gradient-to-r from-brand to-[#ff4d4d] bg-clip-text pb-2 px-1 lowercase text-transparent"
                      : ""
                  }
                >
                  {word}{" "}
                </span>
              );
            })}
          </h2>
          
          {text && (
            <p className="mx-auto mt-8 max-w-xl text-base font-light leading-relaxed text-white/60 sm:text-lg">
              {text}
            </p>
          )}
          
          <Link
            href={href}
            className="group/btn mt-10 inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 text-[13px] font-bold uppercase tracking-wide text-ink transition-all duration-300 hover:-translate-y-1 hover:bg-brand hover:text-white hover:shadow-[0_0_40px_rgba(225,27,34,0.4)]"
          >
            <span>{cta}</span>
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-ink/10 transition-colors duration-300 group-hover/btn:bg-white/20">
              <svg
                className="h-3 w-3 transition-transform duration-300 group-hover/btn:translate-x-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                />
              </svg>
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
