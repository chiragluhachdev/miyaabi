import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, verifyToken, type AdminClaims } from "@/lib/auth";

// Replacements for the Express plumbing (express-async-handler + error.js + protect).

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

interface MongoLikeError {
  code?: number;
  name?: string;
  keyValue?: Record<string, unknown>;
  errors?: Record<string, { message: string }>;
  message?: string;
}

// Convert any thrown error into a JSON response, mirroring the old errorHandler:
// duplicate-key -> 409, Mongoose ValidationError -> 400, ApiError -> its status.
export function toErrorResponse(err: unknown): NextResponse {
  if (err instanceof ApiError) {
    return NextResponse.json({ message: err.message }, { status: err.status });
  }
  const e = err as MongoLikeError;
  if (e?.code === 11000) {
    const field = Object.keys(e.keyValue || {})[0] || "field";
    return NextResponse.json({ message: `Duplicate value for ${field}` }, { status: 409 });
  }
  if (e?.name === "ValidationError" && e.errors) {
    const message = Object.values(e.errors).map((x) => x.message).join(", ");
    return NextResponse.json({ message }, { status: 400 });
  }
  console.error("[api] unhandled error:", err);
  return NextResponse.json({ message: e?.message || "Server error" }, { status: 500 });
}

type Handler<Ctx> = (req: NextRequest, ctx: Ctx) => Promise<NextResponse> | NextResponse;

// Wrap a route handler so thrown errors become clean JSON responses.
export function route<Ctx = unknown>(handler: Handler<Ctx>): Handler<Ctx> {
  return async (req, ctx) => {
    try {
      return await handler(req, ctx);
    } catch (err) {
      return toErrorResponse(err);
    }
  };
}

// In-handler auth guard (defense in depth alongside middleware). Reads the httpOnly
// cookie, verifies it, and returns the admin claims — or throws ApiError(401).
export async function requireAdmin(req: NextRequest): Promise<AdminClaims> {
  const token = req.cookies.get(ADMIN_COOKIE)?.value;
  const claims = await verifyToken(token);
  if (!claims) throw new ApiError(401, "Not authorized");
  return claims;
}

export const json = NextResponse.json;
