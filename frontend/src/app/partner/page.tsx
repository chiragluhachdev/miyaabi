"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { verifyPartnerAccess } from "@/lib/clientApi";
import { Partner } from "@/data/types";
import PartnerGate from "@/components/partner/PartnerGate";
import ProcessSteps from "@/components/partner/ProcessSteps";
import FactoryGallery from "@/components/partner/FactoryGallery";
import VideoEmbed from "@/components/partner/VideoEmbed";

const CODE_KEY = "miyaabi_partner_code";

export default function PartnerPage() {
  const [partner, setPartner] = useState<Partner | null>(null);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Try a cached code on load (keeps it unlocked across refreshes).
  useEffect(() => {
    const cached = sessionStorage.getItem(CODE_KEY);
    if (!cached) {
      setChecking(false);
      return;
    }
    verifyPartnerAccess(cached)
      .then((p) => {
        if (p) setPartner(p);
        else sessionStorage.removeItem(CODE_KEY);
      })
      .finally(() => setChecking(false));
  }, []);

  const submit = async (code: string) => {
    setSubmitting(true);
    setError("");
    const p = await verifyPartnerAccess(code);
    setSubmitting(false);
    if (p) {
      sessionStorage.setItem(CODE_KEY, code);
      setPartner(p);
    } else {
      setError("That code didn't work. Please check and try again.");
    }
  };

  if (checking) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-ink-soft">
        Loading…
      </div>
    );
  }

  if (!partner) {
    return <PartnerGate onSubmit={submit} error={error} loading={submitting} />;
  }

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-ink">
        <div className="relative aspect-[16/9] w-full sm:aspect-[16/6]">
          {partner.hero.image && (
            <Image
              src={partner.hero.image}
              alt={partner.hero.title}
              fill
              priority
              sizes="100vw"
              className="object-cover opacity-70"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
          <div className="absolute inset-0 flex items-end">
            <div className="mx-auto w-full max-w-[1280px] px-4 pb-8 lg:px-6 lg:pb-12">
              <p className="text-[12px] font-bold uppercase tracking-[0.3em] text-white/80">
                {partner.hero.subtitle}
              </p>
              <h1 className="font-display mt-2 max-w-3xl text-3xl font-black uppercase leading-[0.95] text-white sm:text-5xl">
                {partner.hero.title}
              </h1>
            </div>
          </div>
        </div>
      </section>

      {/* Intro */}
      {partner.intro && (
        <section className="mx-auto max-w-[820px] px-4 py-12 text-center lg:px-6">
          <p className="text-lg leading-relaxed text-ink-soft">{partner.intro}</p>
        </section>
      )}

      <ProcessSteps steps={partner.process || []} />
      <FactoryGallery images={partner.gallery || []} />
      {partner.video?.url && (
        <VideoEmbed url={partner.video.url} caption={partner.video.caption} />
      )}
    </>
  );
}
