import { NextRequest } from "next/server";
import { route, json, requireAdmin } from "@/lib/api-helpers";
import { getCachedCollections, revalidate, TAGS } from "@/lib/cache";
import { dbConnect } from "@/lib/db";
import Collection from "@/models/Collection";

export const dynamic = "force-dynamic";

// GET /api/collections — ?withCounts=true to include product counts
export const GET = route(async (req: NextRequest) => {
  const withCounts = req.nextUrl.searchParams.get("withCounts") === "true";
  const collections = await getCachedCollections(withCounts);
  return json(collections);
});

// POST /api/collections (admin)
export const POST = route(async (req: NextRequest) => {
  await requireAdmin(req);
  await dbConnect();
  const body = await req.json();
  const collection = await Collection.create(body);
  revalidate(TAGS.collections);
  return json(collection, { status: 201 });
});
