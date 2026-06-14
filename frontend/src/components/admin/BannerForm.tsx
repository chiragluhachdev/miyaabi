"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminFetch } from "@/lib/adminApi";
import { Banner } from "@/data/types";
import ImageUploader from "./ImageUploader";
import { Card, Field, Input, Button, Notice } from "./ui";

export default function BannerForm({ initial }: { initial?: Banner }) {
  const router = useRouter();
  const [data, setData] = useState<Banner>(
    initial || {
      image: "",
      eyebrow: "",
      title: "",
      cta: "Shop Now",
      href: "/collections",
    }
  );
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const isEdit = Boolean(initial?._id);

  const set = <K extends keyof Banner>(key: K, val: Banner[K]) =>
    setData((d) => ({ ...d, [key]: val }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      if (isEdit) {
        await adminFetch(`/banners/${data._id}`, { method: "PUT", body: data });
      } else {
        await adminFetch("/banners", { method: "POST", body: data });
      }
      router.push("/admin/banners");
      router.refresh();
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
          <Field label="Eyebrow (Small Top Text)">
            <Input
              value={data.eyebrow}
              onChange={(e) => set("eyebrow", e.target.value)}
              placeholder="e.g. mi-ya-bi × Gujarat Titans"
            />
          </Field>
          <Field label="Title (Main Text)">
            <Input
              required
              value={data.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="e.g. Official Merchandise Partner"
            />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="CTA Button Text">
              <Input
                required
                value={data.cta}
                onChange={(e) => set("cta", e.target.value)}
              />
            </Field>
            <Field label="Link URL">
              <Input
                required
                value={data.href}
                onChange={(e) => set("href", e.target.value)}
              />
            </Field>
          </div>
        </Card>

        <Card>
          <h3 className="mb-3 text-sm font-extrabold uppercase tracking-wide">
            Banner Image
          </h3>
          <ImageUploader
            value={data.image ? [{ url: data.image, publicId: "" }] : []}
            onChange={(imgs) => set("image", imgs[0]?.url || "")}
          />
        </Card>
      </div>

      <div className="space-y-5">
        <Card className="space-y-4">
          {error && <Notice type="error">{error}</Notice>}
          <Button type="submit" disabled={saving} className="w-full">
            {saving ? "Saving…" : isEdit ? "Update banner" : "Create banner"}
          </Button>
        </Card>
      </div>
    </form>
  );
}
