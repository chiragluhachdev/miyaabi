import { NextRequest, NextResponse } from "next/server";
import { route, ApiError } from "@/lib/api-helpers";
import { dbConnect } from "@/lib/db";
import Admin from "@/models/Admin";
import { ADMIN_COOKIE, signToken } from "@/lib/auth";
import { rateLimit } from "@/lib/rateLimit";

export const dynamic = "force-dynamic";

const SEVEN_DAYS = 60 * 60 * 24 * 7;

// POST /api/auth/login — verify credentials, set httpOnly cookie
export const POST = route(async (req: NextRequest) => {
  const limited = await rateLimit(req, "login", 10, 60);
  if (limited) return limited;

  const { email, password } = await req.json().catch(() => ({}));
  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }
  await dbConnect();
  const admin = await Admin.findOne({ email: String(email).toLowerCase().trim() });
  if (!admin || !(await admin.matchPassword(password))) {
    throw new ApiError(401, "Invalid email or password");
  }

  const token = await signToken({ id: String(admin._id), role: admin.role });
  const res = NextResponse.json({
    admin: { id: String(admin._id), name: admin.name, email: admin.email, role: admin.role },
  });
  res.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SEVEN_DAYS,
  });
  return res;
});
