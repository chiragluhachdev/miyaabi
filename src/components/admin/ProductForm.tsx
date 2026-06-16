"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { adminFetch } from "@/lib/adminApi";
import { Collection } from "@/data/types";
import ImageUploader, { UploadedImage } from "./ImageUploader";
import { Card, Field, Input, Textarea, Select, Button, Notice } from "./ui";

interface ProductData {
  _id?: string;
  handle: string;
  title: string;
  description: string;
  price: number;
  compareAtPrice?: number | null;
  images: UploadedImage[];
  sizes: string[];
  colors: { name: string; hex: string }[];
  brand: string;
  collectionHandles: string[];
  available: boolean;
  badge: string;
  featured: boolean;
  popularity: number;
}

const blank: ProductData = {
  handle: "",
  title: "",
  description: "",
  price: 0,
  compareAtPrice: null,
  images: [],
  sizes: ["S", "M", "L", "XL"],
  colors: [{ name: "Black", hex: "#16181d" }],
  brand: "miyaabi",
  collectionHandles: [],
  available: true,
  badge: "",
  featured: false,
  popularity: 50,
};

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export default function ProductForm({ initial }: { initial?: ProductData }) {
  const router = useRouter();
  const [data, setData] = useState<ProductData>(initial || blank);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [sizesText, setSizesText] = useState((initial || blank).sizes.join(", "));
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const isEdit = Boolean(initial?._id);

  useEffect(() => {
    adminFetch<Collection[]>("/collections", { auth: false })
      .then(setCollections)
      .catch(() => {});
  }, []);

  const set = <K extends keyof ProductData>(key: K, val: ProductData[K]) =>
    setData((d) => ({ ...d, [key]: val }));

  const toggleCollection = (handle: string) =>
    setData((d) => ({
      ...d,
      collectionHandles: d.collectionHandles.includes(handle)
        ? d.collectionHandles.filter((h) => h !== handle)
        : [...d.collectionHandles, handle],
    }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    const payload = {
      ...data,
      handle: data.handle || slugify(data.title),
      sizes: sizesText.split(",").map((s) => s.trim()).filter(Boolean),
      compareAtPrice: data.compareAtPrice || null,
      // model stores plain URL strings
      images: data.images.map((i) => i.url),
    };
    try {
      if (isEdit) {
        await adminFetch(`/products/id/${data._id}`, { method: "PUT", body: payload });
      } else {
        await adminFetch("/products", { method: "POST", body: payload });
      }
      router.push("/admin/products");
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
          <ImageUploader
            value={data.images}
            onChange={(imgs) => set("images", imgs)}
          />
        </Card>

        <Card className="space-y-4">
          <h3 className="text-sm font-extrabold uppercase tracking-wide">Variants</h3>
          <Field label="Sizes" hint="Comma-separated, e.g. S, M, L, XL">
            <Input value={sizesText} onChange={(e) => setSizesText(e.target.value)} />
          </Field>
          <ColorEditor
            colors={data.colors}
            onChange={(colors) => set("colors", colors)}
          />
        </Card>
      </div>

      <div className="space-y-5">
        <Card className="space-y-4">
          {error && <Notice type="error">{error}</Notice>}
          <Button type="submit" disabled={saving} className="w-full">
            {saving ? "Saving…" : isEdit ? "Update product" : "Create product"}
          </Button>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Price (₹)">
              <Input
                type="number"
                required
                value={data.price}
                onChange={(e) => set("price", Number(e.target.value))}
              />
            </Field>
            <Field label="Compare at (₹)">
              <Input
                type="number"
                value={data.compareAtPrice ?? ""}
                onChange={(e) =>
                  set("compareAtPrice", e.target.value ? Number(e.target.value) : null)
                }
              />
            </Field>
          </div>
          <Field label="Brand">
            <Input value={data.brand} onChange={(e) => set("brand", e.target.value)} />
          </Field>
          <Field label="Badge">
            <Select value={data.badge} onChange={(e) => set("badge", e.target.value)}>
              <option value="">None</option>
              <option value="Sale">Sale</option>
              <option value="New">New</option>
              <option value="Sold out">Sold out</option>
            </Select>
          </Field>
          <Field label="Popularity (0–100)" hint="Higher shows first in Trending / Best selling.">
            <Input
              type="number"
              value={data.popularity}
              onChange={(e) => set("popularity", Number(e.target.value))}
            />
          </Field>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={data.available}
              onChange={(e) => set("available", e.target.checked)}
              className="h-4 w-4 accent-brand"
            />
            In stock / available
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={data.featured}
              onChange={(e) => set("featured", e.target.checked)}
              className="h-4 w-4 accent-brand"
            />
            Featured
          </label>
        </Card>

        <Card>
          <h3 className="mb-3 text-sm font-extrabold uppercase tracking-wide">
            Collections
          </h3>
          <div className="max-h-64 space-y-1.5 overflow-y-auto pr-1">
            {collections.map((c) => (
              <label key={c.handle} className="flex items-center gap-2 text-[13px]">
                <input
                  type="checkbox"
                  checked={data.collectionHandles.includes(c.handle)}
                  onChange={() => toggleCollection(c.handle)}
                  className="h-4 w-4 accent-brand"
                />
                {c.title}
              </label>
            ))}
            {!collections.length && (
              <p className="text-[12px] text-ink-soft">No collections yet.</p>
            )}
          </div>
        </Card>
      </div>
    </form>
  );
}

function ColorEditor({
  colors,
  onChange,
}: {
  colors: { name: string; hex: string }[];
  onChange: (c: { name: string; hex: string }[]) => void;
}) {
  const update = (i: number, key: "name" | "hex", val: string) =>
    onChange(colors.map((c, idx) => (idx === i ? { ...c, [key]: val } : c)));
  return (
    <div>
      <span className="mb-1 block text-[12px] font-semibold text-ink-soft">Colors</span>
      <div className="space-y-2">
        {colors.map((c, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              type="color"
              value={c.hex}
              onChange={(e) => update(i, "hex", e.target.value)}
              className="h-9 w-9 cursor-pointer rounded border border-line"
            />
            <input
              value={c.name}
              onChange={(e) => update(i, "name", e.target.value)}
              placeholder="Color name"
              className="flex-1 rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-ink"
            />
            <button
              type="button"
              onClick={() => onChange(colors.filter((_, idx) => idx !== i))}
              className="px-2 text-ink-soft hover:text-brand"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => onChange([...colors, { name: "", hex: "#000000" }])}
        className="mt-2 text-[12px] font-semibold text-brand hover:underline"
      >
        + Add color
      </button>
    </div>
  );
}
