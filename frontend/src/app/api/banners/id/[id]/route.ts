import { NextRequest } from "next/server";
import { route, json, requireAdmin, ApiError } from "@/lib/api-helpers";
import { dbConnect } from "@/lib/db";
import Banner from "@/models/Banner";
import { revalidate, TAGS } from "@/lib/cache";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

// PUT /api/banners/id/:id (admin)
export const PUT = route<Ctx>(async (req: NextRequest, { params }) => {
  await requireAdmin(req);
  await dbConnect();
  const { id } = await params;
  const body = await req.json();
  const banner = await Banner.findByIdAndUpdate(id, body, {
    new: true,
    runValidators: true,
  });
  if (!banner) throw new ApiError(404, "Banner not found");
  revalidate(TAGS.banners);
  return json(banner);
});

// DELETE /api/banners/id/:id (admin)
export const DELETE = route<Ctx>(async (req: NextRequest, { params }) => {
  await requireAdmin(req);
  await dbConnect();
  const { id } = await params;
  const banner = await Banner.findByIdAndDelete(id);
  if (!banner) throw new ApiError(404, "Banner not found");
  revalidate(TAGS.banners);
  return json({ message: "Banner deleted" });
});
