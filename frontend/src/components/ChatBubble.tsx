"use client";

import { WhatsAppIcon } from "./Icons";
import { SiteSettings } from "@/data/types";

export default function ChatBubble({
  whatsapp,
}: {
  whatsapp?: SiteSettings["whatsapp"];
}) {
  const number = whatsapp?.number || "919891829976";
  const message =
    whatsapp?.message || "Hi mi-या-bi! 👋 I'd like to know more about your products.";
  const WA_LINK = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
  return (
    <a
      href={WA_LINK}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="group fixed bottom-5 right-5 z-40 flex items-center gap-2"
    >
      <span className="hidden translate-x-2 rounded-full bg-white px-3 py-1.5 text-[12px] font-semibold text-ink opacity-0 shadow-md transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 sm:inline-block">
        Chat with us
      </span>
      <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform duration-200 group-hover:scale-105">
        <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366] opacity-40" />
        <WhatsAppIcon width={32} height={32} className="relative" />
      </span>
    </a>
  );
}
