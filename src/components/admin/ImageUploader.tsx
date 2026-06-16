"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { uploadImages } from "@/lib/adminApi";

export interface UploadedImage {
  url: string;
  publicId?: string;
}

export default function ImageUploader({
  value,
  onChange,
  multiple = true,
  label = "Images",
}: {
  value: UploadedImage[];
  onChange: (images: UploadedImage[]) => void;
  multiple?: boolean;
  label?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const handleFiles = async (files: FileList | null) => {
    if (!files || !files.length) return;
    setBusy(true);
    setError("");
    try {
      const uploaded = await uploadImages(files);
      onChange(multiple ? [...value, ...uploaded] : uploaded.slice(0, 1));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const removeAt = (i: number) => onChange(value.filter((_, idx) => idx !== i));

  const [url, setUrl] = useState("");
  const addUrl = () => {
    const u = url.trim();
    if (!u) return;
    onChange(multiple ? [...value, { url: u }] : [{ url: u }]);
    setUrl("");
  };

  return (
    <div>
      <span className="mb-1 block text-[12px] font-semibold text-ink-soft">{label}</span>
      <div className="flex flex-wrap gap-3">
        {value.map((img, i) => (
          <div
            key={`${img.url}-${i}`}
            className="group relative h-24 w-20 overflow-hidden rounded-lg border border-line bg-cream"
          >
            <Image src={img.url} alt="" fill sizes="80px" className="object-cover" />
            <button
              type="button"
              onClick={() => removeAt(i)}
              className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-[11px] text-white opacity-0 transition-opacity group-hover:opacity-100"
              aria-label="Remove image"
            >
              ✕
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="flex h-24 w-20 flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-line text-[11px] font-semibold text-ink-soft hover:border-ink hover:text-ink disabled:opacity-60"
        >
          {busy ? "…" : "＋ Upload"}
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        hidden
        onChange={(e) => handleFiles(e.target.files)}
      />

      {/* Or add an image by URL (e.g. a Google / Unsplash image link) */}
      <div className="mt-3 flex gap-2">
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addUrl();
            }
          }}
          placeholder="Paste image URL…"
          className="flex-1 rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-ink"
        />
        <button
          type="button"
          onClick={addUrl}
          className="rounded-lg border border-line px-3 py-2 text-[12px] font-semibold hover:border-ink"
        >
          Add URL
        </button>
      </div>

      {error && <p className="mt-1 text-[12px] text-brand">{error}</p>}
      <p className="mt-1 text-[11px] text-ink-soft">
        Upload (→ Cloudinary, needs CLOUDINARY_* keys) or paste any image URL.
      </p>
    </div>
  );
}
