"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/context/AdminAuthContext";
import BrandName from "@/components/BrandName";

export default function AdminLogin() {
  const { login } = useAdminAuth();
  const router = useRouter();
  const [email, setEmail] = useState("admin@miyaabi.com");
  const [password, setPassword] = useState("miyaabi@admin123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      router.replace("/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-4">
      <div className="w-full max-w-sm rounded-2xl border border-line bg-white p-8 shadow-sm">
        <div className="mb-6 text-center">
          <BrandName className="text-2xl" />
          <p className="mt-1 text-[12px] font-semibold uppercase tracking-widest text-ink-soft">
            Admin Console
          </p>
        </div>
        <form onSubmit={submit} className="space-y-4">
          {error && (
            <p className="rounded-lg bg-brand/10 px-3 py-2 text-[13px] text-brand">
              {error}
            </p>
          )}
          <div>
            <label className="mb-1 block text-[12px] font-semibold text-ink-soft">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-ink"
              placeholder="admin@miyaabi.com"
            />
          </div>
          <div>
            <label className="mb-1 block text-[12px] font-semibold text-ink-soft">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-ink"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-ink py-3 text-[13px] font-bold uppercase tracking-wide text-white transition-colors hover:bg-brand disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
