import { NextRequest } from "next/server";
import { route, json, ApiError } from "@/lib/api-helpers";
import { getCachedRelated } from "@/lib/cache";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ handle: string }> };

// GET /api/products/:handle/related — ?limit=
export const GET = route<Ctx>(async (req: NextRequest, { params }) => {
  const { handle } = await params;
  const limit = Number(req.nextUrl.searchParams.get("limit")) || 4;
  const related = await getCachedRelated(handle, limit);
  if (related === null) throw new ApiError(404, "Product not found");
  return json(related);
});
