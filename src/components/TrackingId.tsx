"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { recordOrder } from "@/lib/orders";

// Saves the placed order to this device's history (for the account tracker) and
// shows a copyable tracking ID on the confirmation screen.
export default function TrackingId({ id }: { id: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    recordOrder(id);
  }, [id]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(id);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div className="mt-6 rounded-xl border border-line bg-cream/50 p-5">
      <p className="text-[11px] font-bold uppercase tracking-wide text-ink-soft">
        Tracking ID
      </p>
      <div className="mt-1 flex flex-wrap items-center gap-3">
        <code className="select-all break-all text-sm font-semibold text-ink">{id}</code>
        <button
          onClick={copy}
          className="rounded-full border border-ink px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-ink hover:bg-ink hover:text-white"
        >
          {copied ? "Copied ✓" : "Copy"}
        </button>
      </div>
      <p className="mt-2 text-xs text-ink-soft">
        Save this ID to{" "}
        <Link href="/track" className="font-semibold underline hover:text-brand">
          track your order
        </Link>{" "}
        anytime. Orders placed on this device are remembered automatically.
      </p>
    </div>
  );
}
