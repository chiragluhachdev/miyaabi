import { NextRequest } from "next/server";
import { route, json, requireAdmin } from "@/lib/api-helpers";
import { queryAllCollections } from "@/lib/queries";

export const dynamic = "force-dynamic";

// GET /api/collections/all (admin) — includes inactive
export const GET = route(async (req: NextRequest) => {
  await requireAdmin(req);
  const collections = await queryAllCollections();
  return json(collections);
});
