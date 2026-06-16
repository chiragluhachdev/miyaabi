import { NextRequest } from "next/server";
import { route, json, requireAdmin } from "@/lib/api-helpers";
import { getOrCreateSettings } from "@/lib/queries";
import { getCachedSettings, revalidate, TAGS } from "@/lib/cache";

export const dynamic = "force-dynamic";

// GET /api/settings — public; never exposes the gated partner area
export const GET = route(async () => {
  const settings = await getCachedSettings();
  return json(settings);
});

const UPDATABLE = [
  "brand",
  "announcementMessages",
  "whatsapp",
  "featureStrip",
  "footer",
  "currency",
  "homeSections",
] as const;

// PUT /api/settings (admin) — merge top-level keys (nested objects replaced wholesale)
export const PUT = route(async (req: NextRequest) => {
  await requireAdmin(req);
  const settings = await getOrCreateSettings();
  const body = await req.json();
  for (const key of UPDATABLE) {
    if (body[key] !== undefined) {
      (settings as unknown as Record<string, unknown>)[key] = body[key];
    }
  }
  await settings.save();
  revalidate(TAGS.settings);
  return json(settings);
});
