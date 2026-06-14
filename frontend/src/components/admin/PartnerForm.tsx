"use client";

import { useEffect, useState } from "react";
import { adminFetch } from "@/lib/adminApi";
import { Partner } from "@/data/types";
import ImageUploader from "./ImageUploader";
import { Card, Field, Input, Textarea, Button, Notice } from "./ui";

const BLANK: Partner = {
  enabled: true,
  accessCode: "",
  hero: { title: "", subtitle: "", image: "" },
  intro: "",
  process: [],
  gallery: [],
  video: { url: "", caption: "" },
};

export default function PartnerForm() {
  const [data, setData] = useState<Partner>(BLANK);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(
    null
  );

  useEffect(() => {
    adminFetch<Partner>("/partner")
      .then((p) => setData({ ...BLANK, ...p }))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const set = <K extends keyof Partner>(key: K, val: Partner[K]) =>
    setData((d) => ({ ...d, [key]: val }));

  const setStep = (i: number, patch: Partial<Partner["process"][number]>) =>
    set(
      "process",
      data.process.map((s, idx) => (idx === i ? { ...s, ...patch } : s))
    );

  const save = async () => {
    setSaving(true);
    setMsg(null);
    try {
      await adminFetch("/partner", { method: "PUT", body: data });
      setMsg({ type: "success", text: "Partner page saved." });
    } catch (e) {
      setMsg({ type: "error", text: e instanceof Error ? e.message : "Save failed" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-ink-soft">Loading…</div>;

  return (
    <div className="space-y-5">
      <div className="sticky top-16 z-10 flex flex-wrap items-center gap-3 rounded-xl border border-line bg-white/95 p-3 backdrop-blur">
        <Button onClick={save} disabled={saving}>
          {saving ? "Saving…" : "Save partner page"}
        </Button>
        <a
          href="/partner"
          target="_blank"
          className="text-[13px] font-semibold text-ink-soft hover:text-ink"
        >
          ↗ Preview /partner
        </a>
        {msg && <Notice type={msg.type}>{msg.text}</Notice>}
      </div>

      {/* Access */}
      <Card className="space-y-4">
        <h3 className="text-sm font-extrabold uppercase tracking-wide">Access</h3>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={data.enabled !== false}
            onChange={(e) => set("enabled", e.target.checked)}
            className="h-4 w-4 accent-brand"
          />
          Partner area enabled
        </label>
        <Field label="Access code (passcode)" hint="Share this code with partners along with the /partner link.">
          <Input
            value={data.accessCode || ""}
            onChange={(e) => set("accessCode", e.target.value)}
          />
        </Field>
      </Card>

      {/* Hero */}
      <Card className="space-y-4">
        <h3 className="text-sm font-extrabold uppercase tracking-wide">Hero</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Title">
            <Input
              value={data.hero.title}
              onChange={(e) => set("hero", { ...data.hero, title: e.target.value })}
            />
          </Field>
          <Field label="Subtitle">
            <Input
              value={data.hero.subtitle}
              onChange={(e) =>
                set("hero", { ...data.hero, subtitle: e.target.value })
              }
            />
          </Field>
        </div>
        <ImageUploader
          label="Hero image"
          multiple={false}
          value={data.hero.image ? [{ url: data.hero.image, publicId: "" }] : []}
          onChange={(imgs) =>
            set("hero", { ...data.hero, image: imgs[0]?.url || "" })
          }
        />
        <Field label="Intro paragraph">
          <Textarea value={data.intro} onChange={(e) => set("intro", e.target.value)} />
        </Field>
      </Card>

      {/* Process steps */}
      <Card className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-extrabold uppercase tracking-wide">
            Manufacturing Process
          </h3>
          <button
            onClick={() =>
              set("process", [...data.process, { title: "", description: "", image: "" }])
            }
            className="text-[13px] font-semibold text-brand hover:underline"
          >
            + Add step
          </button>
        </div>
        {data.process.map((step, i) => (
          <div key={i} className="rounded-lg border border-line p-3">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-[12px] font-semibold text-ink-soft">
                Step {i + 1}
              </span>
              <div className="flex gap-2 text-[12px] font-semibold">
                <button
                  disabled={i === 0}
                  onClick={() => {
                    const next = [...data.process];
                    [next[i - 1], next[i]] = [next[i], next[i - 1]];
                    set("process", next);
                  }}
                  className="text-ink-soft hover:text-ink disabled:opacity-30"
                >
                  ↑
                </button>
                <button
                  disabled={i === data.process.length - 1}
                  onClick={() => {
                    const next = [...data.process];
                    [next[i + 1], next[i]] = [next[i], next[i + 1]];
                    set("process", next);
                  }}
                  className="text-ink-soft hover:text-ink disabled:opacity-30"
                >
                  ↓
                </button>
                <button
                  onClick={() =>
                    set("process", data.process.filter((_, idx) => idx !== i))
                  }
                  className="text-brand hover:underline"
                >
                  Remove
                </button>
              </div>
            </div>
            <div className="space-y-3">
              <Field label="Title">
                <Input value={step.title} onChange={(e) => setStep(i, { title: e.target.value })} />
              </Field>
              <Field label="Description">
                <Textarea
                  value={step.description}
                  onChange={(e) => setStep(i, { description: e.target.value })}
                />
              </Field>
              <ImageUploader
                label="Step image"
                multiple={false}
                value={step.image ? [{ url: step.image, publicId: "" }] : []}
                onChange={(imgs) => setStep(i, { image: imgs[0]?.url || "" })}
              />
            </div>
          </div>
        ))}
      </Card>

      {/* Gallery */}
      <Card className="space-y-3">
        <h3 className="text-sm font-extrabold uppercase tracking-wide">Factory Gallery</h3>
        <ImageUploader
          label="Gallery images"
          value={(data.gallery || []).map((url) => ({ url, publicId: "" }))}
          onChange={(imgs) => set("gallery", imgs.map((im) => im.url))}
        />
      </Card>

      {/* Video */}
      <Card className="space-y-4">
        <h3 className="text-sm font-extrabold uppercase tracking-wide">Video Walkthrough</h3>
        <Field label="Video URL" hint="Paste a YouTube or Vimeo link. Leave blank to hide the section.">
          <Input
            value={data.video.url}
            onChange={(e) => set("video", { ...data.video, url: e.target.value })}
            placeholder="https://www.youtube.com/watch?v=…"
          />
        </Field>
        <Field label="Caption">
          <Input
            value={data.video.caption}
            onChange={(e) => set("video", { ...data.video, caption: e.target.value })}
          />
        </Field>
      </Card>

      <Button onClick={save} disabled={saving}>
        {saving ? "Saving…" : "Save partner page"}
      </Button>
    </div>
  );
}
