import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, verifyToken } from "@/lib/auth";

// Protects the /admin dashboard (Next 16 "proxy" convention, formerly middleware).
// Runs on the Node.js runtime. Admin /api routes are additionally guarded in-handler
// via requireAdmin(), so this only handles page redirects for a clean UX.
export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // The login page must stay reachable while unauthenticated.
  if (pathname === "/admin/login") return NextResponse.next();

  const token = req.cookies.get(ADMIN_COOKIE)?.value;
  const claims = await verifyToken(token);
  if (!claims) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
