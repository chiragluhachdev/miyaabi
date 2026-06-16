"use client";

import { useEffect, useState } from "react";
import { adminFetch } from "@/lib/adminApi";
import { Collection, HomeSection, Product, SiteSettings, Tile } from "@/data/types";
import ImageUploader from "./ImageUploader";
import { Card, Field, Input, Textarea, Select, Button, Notice } from "./ui";

const uid = () =>
  (typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `s_${Date.now()}_${Math.random().toString(36).slice(2)}`);

const TYPE_LABELS: Record<HomeSection["type"], string> = {
  "product-carousel": "Product Row",
  "tile-grid": "Category Tiles (grid)",
  "tile-carousel": "Category Tiles (carousel)",
  promo: "Promo Banner",
};

export default function HomeSectionsForm() {
  const [sections, setSections] = useState<HomeSection[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(
    null
  );

  useEffect(() => {
    Promise.all([
      adminFetch<SiteSettings>("/settings", { auth: false }),
      adminFetch<Product[]>("/products", { auth: false }),
      adminFetch<Collection[]>("/collections", { auth: false }),
    ])
      .then(([s, p, c]) => {
        setSections(s.homeSections || []);
        setProducts(p);
        setCollections(c);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const update = (id: string, patch: Partial<HomeSection>) =>
    setSections((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));

  const move = (id: string, dir: -1 | 1) =>
    setSections((prev) => {
      const i = prev.findIndex((s) => s.id === id);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= prev.length) return prev;
      const next = [...prev];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });

  const remove = (id: string) =>
    setSections((prev) => prev.filter((s) => s.id !== id));

  const add = (type: HomeSection["type"]) => {
    const base: HomeSection = { id: uid(), type, enabled: true, title: "New section" };
    if (type === "product-carousel")
      Object.assign(base, { source: "trending", limit: 8, viewAllHref: "/collections" });
    if (type === "tile-grid" || type === "tile-carousel")
      base.tiles = [{ label: "New tile", image: "", href: "/collections" }];
    if (type === "promo")
      Object.assign(base, {
        eyebrow: "New Season",
        title: "Headline",
        text: "Supporting text",
        cta: "Shop now",
        href: "/collections",
      });
    setSections((prev) => [...prev, base]);
  };

  const save = async () => {
    setSaving(true);
    setMsg(null);
    try {
      await adminFetch("/settings", { method: "PUT", body: { homeSections: sections } });
      setMsg({ type: "success", text: "Homepage saved. Refresh the storefront to see it." });
    } catch (e) {
      setMsg({ type: "error", text: e instanceof Error ? e.message : "Save failed" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-ink-soft">Loading…</div>;

  return (
    <div className="space-y-5">
      <div className="sticky top-16 z-10 flex flex-wrap items-center gap-2 rounded-xl border border-line bg-white/95 p-3 backdrop-blur">
        <Button onClick={save} disabled={saving}>
          {saving ? "Saving…" : "Save homepage"}
        </Button>
        <span className="text-[12px] text-ink-soft">Add section:</span>
        {(Object.keys(TYPE_LABELS) as HomeSection["type"][]).map((t) => (
          <button
            key={t}
            onClick={() => add(t)}
            className="rounded-full border border-line px-3 py-1.5 text-[12px] font-semibold hover:border-ink"
          >
            + {TYPE_LABELS[t]}
          </button>
        ))}
        {msg && <Notice type={msg.type}>{msg.text}</Notice>}
      </div>

      {!sections.length && (
        <Card>
          <p className="text-sm text-ink-soft">
            No sections yet. Use “Add section” above to build your homepage.
          </p>
        </Card>
      )}

      {sections.map((s, i) => (
        <Card key={s.id} className="space-y-4">
          <div className="flex items-center justify-between gap-3 border-b border-line pb-3">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-shade px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-ink-soft">
                {TYPE_LABELS[s.type]}
              </span>
              <label className="flex items-center gap-1.5 text-[12px] text-ink-soft">
                <input
                  type="checkbox"
                  checked={s.enabled !== false}
                  onChange={(e) => update(s.id, { enabled: e.target.checked })}
                  className="h-4 w-4 accent-brand"
                />
                Visible
              </label>
            </div>
            <div className="flex items-center gap-1">
              <IconBtn disabled={i === 0} onClick={() => move(s.id, -1)} label="Move up">
                ↑
              </IconBtn>
              <IconBtn
                disabled={i === sections.length - 1}
                onClick={() => move(s.id, 1)}
                label="Move down"
              >
                ↓
              </IconBtn>
              <button
                onClick={() => remove(s.id)}
                className="rounded-lg px-2 py-1 text-[13px] font-semibold text-brand hover:bg-brand/5"
              >
                Delete
              </button>
            </div>
          </div>

          {s.type === "product-carousel" && (
            <ProductCarouselEditor
              section={s}
              products={products}
              collections={collections}
              onChange={(patch) => update(s.id, patch)}
            />
          )}
          {(s.type === "tile-grid" || s.type === "tile-carousel") && (
            <TilesEditor section={s} onChange={(patch) => update(s.id, patch)} />
          )}
          {s.type === "promo" && (
            <PromoEditor section={s} onChange={(patch) => update(s.id, patch)} />
          )}
        </Card>
      ))}

      {sections.length > 2 && (
        <Button onClick={save} disabled={saving}>
          {saving ? "Saving…" : "Save homepage"}
        </Button>
      )}
    </div>
  );
}

function IconBtn({
  children,
  onClick,
  disabled,
  label,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="flex h-7 w-7 items-center justify-center rounded-lg border border-line text-sm hover:border-ink disabled:opacity-30"
    >
      {children}
    </button>
  );
}

function ProductCarouselEditor({
  section,
  products,
  collections,
  onChange,
}: {
  section: HomeSection;
  products: Product[];
  collections: Collection[];
  onChange: (patch: Partial<HomeSection>) => void;
}) {
  const toggleProduct = (handle: string) => {
    const cur = section.productHandles || [];
    onChange({
      productHandles: cur.includes(handle)
        ? cur.filter((h) => h !== handle)
        : [...cur, handle],
    });
  };
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Section title">
          <Input value={section.title || ""} onChange={(e) => onChange({ title: e.target.value })} />
        </Field>
        <Field label="Source">
          <Select
            value={section.source || "trending"}
            onChange={(e) => onChange({ source: e.target.value as HomeSection["source"] })}
          >
            <option value="trending">Trending (auto)</option>
            <option value="best-selling">Best selling (auto)</option>
            <option value="new">Newest (auto)</option>
            <option value="collection">From a collection</option>
            <option value="manual">Hand-picked products</option>
          </Select>
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Max products">
          <Input
            type="number"
            value={section.limit ?? 8}
            onChange={(e) => onChange({ limit: Number(e.target.value) })}
          />
        </Field>
        <Field label="“View all” link">
          <Input
            value={section.viewAllHref || ""}
            onChange={(e) => onChange({ viewAllHref: e.target.value })}
            placeholder="/collections"
          />
        </Field>
      </div>

      {section.source === "collection" && (
        <Field label="Collection">
          <Select
            value={section.collectionHandle || ""}
            onChange={(e) => onChange({ collectionHandle: e.target.value })}
          >
            <option value="">Select a collection…</option>
            {collections.map((c) => (
              <option key={c.handle} value={c.handle}>
                {c.title}
              </option>
            ))}
          </Select>
        </Field>
      )}

      {section.source === "manual" && (
        <div>
          <span className="mb-1 block text-[12px] font-semibold text-ink-soft">
            Pick products ({(section.productHandles || []).length} selected)
          </span>
          <div className="max-h-56 space-y-1 overflow-y-auto rounded-lg border border-line p-2">
            {products.map((p) => (
              <label key={p.handle} className="flex items-center gap-2 text-[13px]">
                <input
                  type="checkbox"
                  checked={(section.productHandles || []).includes(p.handle)}
                  onChange={() => toggleProduct(p.handle)}
                  className="h-4 w-4 accent-brand"
                />
                {p.title}
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function TilesEditor({
  section,
  onChange,
}: {
  section: HomeSection;
  onChange: (patch: Partial<HomeSection>) => void;
}) {
  const tiles = section.tiles || [];
  const setTile = (i: number, patch: Partial<Tile>) =>
    onChange({ tiles: tiles.map((t, idx) => (idx === i ? { ...t, ...patch } : t)) });
  const removeTile = (i: number) =>
    onChange({ tiles: tiles.filter((_, idx) => idx !== i) });
  const addTile = () =>
    onChange({ tiles: [...tiles, { label: "New tile", image: "", href: "/collections" }] });

  return (
    <div className="space-y-4">
      <Field label="Section title">
        <Input value={section.title || ""} onChange={(e) => onChange({ title: e.target.value })} />
      </Field>
      <div className="space-y-4">
        {tiles.map((t, i) => (
          <div key={i} className="rounded-lg border border-line p-3">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-[12px] font-semibold text-ink-soft">Tile {i + 1}</span>
              <button
                onClick={() => removeTile(i)}
                className="text-[12px] font-semibold text-brand hover:underline"
              >
                Remove
              </button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Label">
                <Input value={t.label} onChange={(e) => setTile(i, { label: e.target.value })} />
              </Field>
              <Field label="Link">
                <Input value={t.href} onChange={(e) => setTile(i, { href: e.target.value })} />
              </Field>
            </div>
            <div className="mt-3">
              <ImageUploader
                label="Tile image"
                multiple={false}
                value={t.image ? [{ url: t.image, publicId: "" }] : []}
                onChange={(imgs) => setTile(i, { image: imgs[0]?.url || "" })}
              />
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={addTile}
        className="text-[13px] font-semibold text-brand hover:underline"
      >
        + Add tile
      </button>
    </div>
  );
}

function PromoEditor({
  section,
  onChange,
}: {
  section: HomeSection;
  onChange: (patch: Partial<HomeSection>) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Eyebrow (small top text)">
          <Input value={section.eyebrow || ""} onChange={(e) => onChange({ eyebrow: e.target.value })} />
        </Field>
        <Field label="Headline">
          <Input value={section.title || ""} onChange={(e) => onChange({ title: e.target.value })} />
        </Field>
      </div>
      <Field label="Body text">
        <Textarea value={section.text || ""} onChange={(e) => onChange({ text: e.target.value })} />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Button text">
          <Input value={section.cta || ""} onChange={(e) => onChange({ cta: e.target.value })} />
        </Field>
        <Field label="Button link">
          <Input value={section.href || ""} onChange={(e) => onChange({ href: e.target.value })} />
        </Field>
      </div>
    </div>
  );
}
