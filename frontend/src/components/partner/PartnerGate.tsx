"use client";

import { useState } from "react";
import BrandName from "@/components/BrandName";

export default function PartnerGate({
  onSubmit,
  error,
  loading,
}: {
  onSubmit: (code: string) => void;
  error?: string;
  loading?: boolean;
}) {
  const [code, setCode] = useState("");
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-16">
      <div className="w-full max-w-md rounded-2xl border border-line bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-cream text-2xl">
          🔒
        </div>
        <h1 className="font-display text-2xl font-black uppercase tracking-tight">
          Partner Access
        </h1>
        <p className="mt-2 text-sm text-ink-soft">
          This area is for <BrandName className="text-[15px]" /> business
          partners. Enter your access code to continue.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(code.trim());
          }}
          className="mt-6 space-y-3"
        >
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Access code"
            autoFocus
            className="w-full rounded-lg border border-line px-4 py-3 text-center text-sm tracking-widest outline-none focus:border-ink"
          />
          {error && <p className="text-[13px] text-brand">{error}</p>}
          <button
            type="submit"
            disabled={loading || !code.trim()}
            className="w-full rounded-full bg-ink py-3 text-[13px] font-bold uppercase tracking-wide text-white transition-colors hover:bg-brand disabled:opacity-60"
          >
            {loading ? "Checking…" : "Enter"}
          </button>
        </form>
      </div>
    </div>
  );
}
