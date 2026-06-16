import { NextRequest } from "next/server";
import { route, json, requireAdmin, ApiError } from "@/lib/api-helpers";
import { dbConnect } from "@/lib/db";
import Collection from "@/models/Collection";
import { revalidate, TAGS } from "@/lib/cache";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

// PUT /api/collections/id/:id (admin)
export const PUT = route<Ctx>(async (req: NextRequest, { params }) => {
  await requireAdmin(req);
  await dbConnect();
  const { id } = await params;
  const body = await req.json();
  const collection = await Collection.findByIdAndUpdate(id, body, {
    new: true,
    runValidators: true,
  });
  if (!collection) throw new ApiError(404, "Collection not found");
  revalidate(TAGS.collections);
  return json(collection);
});

// DELETE /api/collections/id/:id (admin)
export const DELETE = route<Ctx>(async (req: NextRequest, { params }) => {
  await requireAdmin(req);
  await dbConnect();
  const { id } = await params;
  const collection = await Collection.findByIdAndDelete(id);
  if (!collection) throw new ApiError(404, "Collection not found");
  revalidate(TAGS.collections);
  return json({ message: "Collection deleted" });
});
