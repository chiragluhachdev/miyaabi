import { NextRequest } from "next/server";
import { route, json, requireAdmin, ApiError } from "@/lib/api-helpers";
import { dbConnect } from "@/lib/db";
import Admin from "@/models/Admin";

export const dynamic = "force-dynamic";

// GET /api/auth/me — current admin from the cookie
export const GET = route(async (req: NextRequest) => {
  const claims = await requireAdmin(req);
  await dbConnect();
  const admin = await Admin.findById(claims.id).select("-passwordHash").lean();
  if (!admin) throw new ApiError(401, "Not authorized — admin not found");
  return json({
    admin: {
      id: String(admin._id),
      name: admin.name,
      email: admin.email,
      role: admin.role,
    },
  });
});
