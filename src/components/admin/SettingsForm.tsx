"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminFetch } from "@/lib/adminApi";
import { SiteSettings } from "@/data/types";
import ImageUploader from "./ImageUploader";
import { Card, Field, Input, Textarea, Button, Notice } from "./ui";

export default function SettingsForm({ initial }: { initial: SiteSettings }) {
  const router = useRouter();
  const [data, setData] = useState<SiteSettings>(initial);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const setBrand = (key: keyof SiteSettings["brand"], val: string) =>
    setData((d) => ({ ...d, brand: { ...d.brand, [key]: val } }));

  const setWhatsapp = (key: keyof SiteSettings["whatsapp"], val: any) =>
    setData((d) => ({ ...d, whatsapp: { ...d.whatsapp, [key]: val } }));

  const setAnnouncements = (text: string) =>
    setData((d) => ({
      ...d,
      announcementMessages: text.split("\n").map((s) => s.trim()).filter(Boolean),
    }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      await adminFetch("/settings", { method: "PUT", body: data });
      router.refresh();
      // Show success briefly? we'll just let the button state indicate it
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="grid gap-5 lg:grid-cols-3">
      <div className="space-y-5 lg:col-span-2">
        <Card className="space-y-4">
          <h3 className="mb-3 text-sm font-extrabold uppercase tracking-wide">
            Brand
          </h3>
          <Field label="Brand Name">
            <Input
              required
              value={data.brand.name}
              onChange={(e) => setBrand("name", e.target.value)}
            />
          </Field>
          <Field label="Logo Image">
            <ImageUploader
              value={data.brand.logoUrl ? [{ url: data.brand.logoUrl, publicId: "" }] : []}
              onChange={(imgs) => setBrand("logoUrl", imgs[0]?.url || "")}
            />
          </Field>
        </Card>

        <Card className="space-y-4">
          <h3 className="mb-3 text-sm font-extrabold uppercase tracking-wide">
            Announcement Bar
          </h3>
          <Field label="Messages" hint="One message per line. They will rotate automatically.">
            <Textarea
              rows={4}
              value={data.announcementMessages.join("\n")}
              onChange={(e) => setAnnouncements(e.target.value)}
              placeholder={"Message 1\nMessage 2"}
            />
          </Field>
        </Card>

        <Card className="space-y-4">
          <h3 className="mb-3 text-sm font-extrabold uppercase tracking-wide">
            WhatsApp Integration
          </h3>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={data.whatsapp.enabled}
              onChange={(e) => setWhatsapp("enabled", e.target.checked)}
              className="h-4 w-4 accent-brand"
            />
            Enable WhatsApp floating button
          </label>
          {data.whatsapp.enabled && (
            <div className="grid grid-cols-2 gap-4 mt-2">
              <Field label="Phone Number" hint="Include country code, e.g. 919891829976">
                <Input
                  value={data.whatsapp.number}
                  onChange={(e) => setWhatsapp("number", e.target.value)}
                />
              </Field>
              <Field label="Default Message">
                <Input
                  value={data.whatsapp.message}
                  onChange={(e) => setWhatsapp("message", e.target.value)}
                />
              </Field>
            </div>
          )}
        </Card>
        
        <Card className="space-y-4">
          <h3 className="mb-3 text-sm font-extrabold uppercase tracking-wide">
            Footer Tagline
          </h3>
          <Field label="Tagline">
            <Textarea
              value={data.footer.tagline}
              onChange={(e) =>
                setData((d) => ({
                  ...d,
                  footer: { ...d.footer, tagline: e.target.value },
                }))
              }
            />
          </Field>
        </Card>
      </div>

      <div className="space-y-5">
        <Card className="space-y-4 sticky top-6">
          {error && <Notice type="error">{error}</Notice>}
          <Button type="submit" disabled={saving} className="w-full">
            {saving ? "Saving…" : "Save all settings"}
          </Button>
          <p className="text-[12px] text-ink-soft text-center mt-2">
            These settings update your storefront immediately.
          </p>
        </Card>
      </div>
    </form>
  );
}
