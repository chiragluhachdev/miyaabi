import { NextRequest } from "next/server";
import { route, json, requireAdmin } from "@/lib/api-helpers";
import { getOrCreateSettings } from "@/lib/queries";

export const dynamic = "force-dynamic";

// GET /api/partner (admin) — full partner object incl. access code
export const GET = route(async (req: NextRequest) => {
  await requireAdmin(req);
  const settings = await getOrCreateSettings();
  return json(settings.partner || {});
});

// PUT /api/partner (admin) — update partner content
export const PUT = route(async (req: NextRequest) => {
  await requireAdmin(req);
  const settings = await getOrCreateSettings();
  const body = await req.json();
  const current = settings.partner as unknown as { toObject?: () => object } | undefined;
  const base = current?.toObject ? current.toObject() : current || {};
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  settings.partner = { ...base, ...body } as any;
  settings.markModified("partner");
  await settings.save();
  return json(settings.partner);
});
