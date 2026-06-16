import { NextRequest } from "next/server";
import { route, json, requireAdmin, ApiError } from "@/lib/api-helpers";
import { dbConnect } from "@/lib/db";
import Product from "@/models/Product";
import { revalidate, TAGS } from "@/lib/cache";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

// PUT /api/products/id/:id (admin)
export const PUT = route<Ctx>(async (req: NextRequest, { params }) => {
  await requireAdmin(req);
  await dbConnect();
  const { id } = await params;
  const body = await req.json();
  const product = await Product.findByIdAndUpdate(id, body, {
    new: true,
    runValidators: true,
  });
  if (!product) throw new ApiError(404, "Product not found");
  revalidate(TAGS.products, TAGS.collections);
  return json(product);
});

// DELETE /api/products/id/:id (admin)
export const DELETE = route<Ctx>(async (req: NextRequest, { params }) => {
  await requireAdmin(req);
  await dbConnect();
  const { id } = await params;
  const product = await Product.findByIdAndDelete(id);
  if (!product) throw new ApiError(404, "Product not found");
  revalidate(TAGS.products, TAGS.collections);
  return json({ message: "Product deleted" });
});
