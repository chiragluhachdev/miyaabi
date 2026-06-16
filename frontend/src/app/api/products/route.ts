import { NextRequest } from "next/server";
import { route, json, requireAdmin } from "@/lib/api-helpers";
import { getCachedProducts, revalidate, TAGS } from "@/lib/cache";
import { dbConnect } from "@/lib/db";
import Product from "@/models/Product";

export const dynamic = "force-dynamic";

// GET /api/products — ?collection= &search= &sort= &featured= &limit= &handles=
export const GET = route(async (req: NextRequest) => {
  const sp = req.nextUrl.searchParams;
  const products = await getCachedProducts({
    collection: sp.get("collection") || undefined,
    search: sp.get("search") || undefined,
    sort: sp.get("sort") || undefined,
    featured: sp.get("featured") === "true",
    limit: sp.get("limit") ? Number(sp.get("limit")) : undefined,
    handles: sp.get("handles") || undefined,
  });
  return json(products);
});

// POST /api/products (admin)
export const POST = route(async (req: NextRequest) => {
  await requireAdmin(req);
  await dbConnect();
  const body = await req.json();
  const count = await Product.estimatedDocumentCount();
  const product = await Product.create({ createdOrder: count + 1, ...body });
  revalidate(TAGS.products, TAGS.collections);
  return json(product, { status: 201 });
});
