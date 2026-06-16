import { NextRequest } from "next/server";
import mongoose from "mongoose";
import { route, json, requireAdmin, ApiError } from "@/lib/api-helpers";
import { dbConnect } from "@/lib/db";
import Order from "@/models/Order";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

// GET /api/orders/:id (public) — order confirmation / tracking
export const GET = route<Ctx>(async (_req, { params }) => {
  await dbConnect();
  const { id } = await params;
  if (!mongoose.isValidObjectId(id)) throw new ApiError(404, "Order not found");
  const order = await Order.findById(id).lean();
  if (!order) throw new ApiError(404, "Order not found");
  return json(order);
});

// PUT /api/orders/:id (admin) — update status / notes
export const PUT = route<Ctx>(async (req: NextRequest, { params }) => {
  await requireAdmin(req);
  await dbConnect();
  const { id } = await params;
  const body = await req.json();
  const update: Record<string, unknown> = {};
  if (body.status !== undefined) update.status = body.status;
  if (body.notes !== undefined) update.notes = body.notes;
  const order = await Order.findByIdAndUpdate(id, update, { new: true });
  if (!order) throw new ApiError(404, "Order not found");
  return json(order);
});
