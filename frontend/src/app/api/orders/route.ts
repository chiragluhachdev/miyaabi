import { NextRequest } from "next/server";
import { route, json, requireAdmin, ApiError } from "@/lib/api-helpers";
import { dbConnect } from "@/lib/db";
import Order from "@/models/Order";
import { rateLimit } from "@/lib/rateLimit";

export const dynamic = "force-dynamic";

interface Line {
  price?: number;
  qty?: number;
}

// POST /api/orders (public) — place a Cash-on-Delivery order
export const POST = route(async (req: NextRequest) => {
  const limited = await rateLimit(req, "order-create", 20, 60);
  if (limited) return limited;

  await dbConnect();
  const { items, customer, paymentMethod } = await req.json();
  if (!items?.length) throw new ApiError(400, "Your cart is empty");
  if (!customer?.name || !customer?.phone || !customer?.address) {
    throw new ApiError(400, "Name, phone and address are required");
  }
  const subtotal = (items as Line[]).reduce(
    (n, l) => n + (l.price || 0) * (l.qty || 1),
    0
  );
  const shipping = subtotal >= 1499 ? 0 : subtotal > 0 ? 49 : 0;
  const order = await Order.create({
    items,
    customer,
    paymentMethod: paymentMethod || "COD",
    subtotal,
    shipping,
    total: subtotal + shipping,
    status: "placed",
  });
  return json(order, { status: 201 });
});

// GET /api/orders (admin)
export const GET = route(async (req: NextRequest) => {
  await requireAdmin(req);
  await dbConnect();
  const orders = await Order.find().sort({ createdAt: -1 }).lean();
  return json(orders);
});
