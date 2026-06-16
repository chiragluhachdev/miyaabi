import { route, json, ApiError } from "@/lib/api-helpers";
import { getCachedProductByHandle } from "@/lib/cache";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ handle: string }> };

// GET /api/products/:handle
export const GET = route<Ctx>(async (_req, { params }) => {
  const { handle } = await params;
  const product = await getCachedProductByHandle(handle);
  if (!product) throw new ApiError(404, "Product not found");
  return json(product);
});
