"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminFetch } from "@/lib/adminApi";
import { Collection } from "@/data/types";
import ImageUploader from "./ImageUploader";
import { Card, Field, Input, Textarea, Select, Button, Notice } from "./ui";

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export default function CollectionForm({ initial }: { initial?: Collection }) {
  const router = useRouter();
  const [data, setData] = useState<Collection>(
    initial || {
      handle: "",
      title: "",
      group: "shop",
      bannerImage: "",
      description: "",
    }
  );
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const isEdit = Boolean(initial?._id);

  const set = <K extends keyof Collection>(key: K, val: Collection[K]) =>
    setData((d) => ({ ...d, [key]: val }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    const payload = {
      ...data,
      handle: data.handle || slugify(data.title),
    };
    try {
      if (isEdit) {
        await adminFetch(`/collections/id/${data._id}`, { method: "PUT", body: payload });
      } else {
        await adminFetch("/collections", { method: "POST", body: payload });
      }
      router.push("/admin/collections");
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
          <Field label="Title">
            <Input
              required
              value={data.title}
              onChange={(e) => {
                const v = e.target.value;
                set("title", v);
                if (!isEdit) set("handle", slugify(v));
              }}
            />
          </Field>
          <Field label="Handle (URL slug)" hint="Auto-generated from title; must be unique.">
            <Input
              required
              value={data.handle}
              onChange={(e) => set("handle", slugify(e.target.value))}
            />
          </Field>
          <Field label="Description">
            <Textarea
              value={data.description}
              onChange={(e) => set("description", e.target.value)}
            />
          </Field>
        </Card>

        <Card>
          <h3 className="mb-3 text-sm font-extrabold uppercase tracking-wide">
            Banner Image
          </h3>
          <ImageUploader
            value={data.bannerImage ? [{ url: data.bannerImage, publicId: "" }] : []}
            onChange={(imgs) => set("bannerImage", imgs[0]?.url || "")}
          />
        </Card>
      </div>

      <div className="space-y-5">
        <Card className="space-y-4">
          {error && <Notice type="error">{error}</Notice>}
          <Button type="submit" disabled={saving} className="w-full">
            {saving ? "Saving…" : isEdit ? "Update collection" : "Create collection"}
          </Button>

          <Field label="Group">
            <Select
              value={data.group}
              onChange={(e) => set("group", e.target.value as any)}
            >
              <option value="shop">Shop</option>
              <option value="brand">Brand</option>
              <option value="sport">Sport</option>
              <option value="feature">Feature</option>
            </Select>
          </Field>
        </Card>
      </div>
    </form>
  );
}
