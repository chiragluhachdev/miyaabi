import { route, json, ApiError } from "@/lib/api-helpers";
import { getCachedCollectionByHandle } from "@/lib/cache";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ handle: string }> };

// GET /api/collections/:handle — collection + its products
export const GET = route<Ctx>(async (_req, { params }) => {
  const { handle } = await params;
  const data = await getCachedCollectionByHandle(handle);
  if (!data) throw new ApiError(404, "Collection not found");
  return json(data);
});
