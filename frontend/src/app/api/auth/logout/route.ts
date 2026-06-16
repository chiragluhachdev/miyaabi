import { NextResponse } from "next/server";
import { route } from "@/lib/api-helpers";
import { ADMIN_COOKIE } from "@/lib/auth";

export const dynamic = "force-dynamic";

// POST /api/auth/logout — clear the admin cookie
export const POST = route(async () => {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, "", { path: "/", maxAge: 0 });
  return res;
});
