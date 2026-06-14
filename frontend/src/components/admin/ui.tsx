"use client";

import { ReactNode } from "react";

export function PageTitle({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-ink">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-ink-soft">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl border border-line bg-white p-5 ${className}`}>
      {children}
    </div>
  );
}

export function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[12px] font-semibold text-ink-soft">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-[11px] text-ink-soft">{hint}</span>}
    </label>
  );
}

const inputClass =
  "w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-ink";

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${inputClass} ${props.className || ""}`} />;
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea {...props} className={`${inputClass} min-h-24 ${props.className || ""}`} />
  );
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={`${inputClass} ${props.className || ""}`} />;
}

export function Button({
  variant = "primary",
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "outline" | "danger" | "ghost";
}) {
  const variants = {
    primary: "bg-ink text-white hover:bg-brand",
    outline: "border-2 border-ink text-ink hover:bg-ink hover:text-white",
    danger: "bg-brand text-white hover:bg-brand-dark",
    ghost: "text-ink-soft hover:text-ink",
  };
  return (
    <button
      {...props}
      className={`rounded-full px-5 py-2.5 text-[13px] font-bold uppercase tracking-wide transition-colors disabled:opacity-60 ${variants[variant]} ${className}`}
    />
  );
}

export function Notice({ type, children }: { type: "success" | "error"; children: ReactNode }) {
  if (!children) return null;
  return (
    <div
      className={`rounded-lg px-3 py-2 text-[13px] ${
        type === "success" ? "bg-green-50 text-green-700" : "bg-brand/10 text-brand"
      }`}
    >
      {children}
    </div>
  );
}
