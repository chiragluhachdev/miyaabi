import { NextRequest } from "next/server";
import { route, json, requireAdmin } from "@/lib/api-helpers";
import { queryBanners } from "@/lib/queries";
import { getCachedBanners, revalidate, TAGS } from "@/lib/cache";
import { dbConnect } from "@/lib/db";
import Banner from "@/models/Banner";

export const dynamic = "force-dynamic";

// GET /api/banners — active only (cached); ?all=true (admin) returns inactive, fresh
export const GET = route(async (req: NextRequest) => {
  const includeInactive = req.nextUrl.searchParams.get("all") === "true";
  const banners = includeInactive
    ? await queryBanners(true)
    : await getCachedBanners();
  return json(banners);
});

// POST /api/banners (admin)
export const POST = route(async (req: NextRequest) => {
  await requireAdmin(req);
  await dbConnect();
  const body = await req.json();
  const count = await Banner.estimatedDocumentCount();
  const banner = await Banner.create({ order: count, ...body });
  revalidate(TAGS.banners);
  return json(banner, { status: 201 });
});
