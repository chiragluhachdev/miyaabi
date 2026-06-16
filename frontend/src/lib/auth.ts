import { SignJWT, jwtVerify } from "jose";

// JWT helpers built on `jose` (Web Crypto) so the SAME code runs in both the Node
// route-handler runtime AND the Edge middleware runtime (gotcha G5). The old
// Express backend signed HS256 tokens with `JWT_SECRET`; jose verifies those too.

export const ADMIN_COOKIE = "miyaabi_admin";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

function secretKey(): Uint8Array {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not set. Add it to .env.local (and to Vercel env).");
  }
  return new TextEncoder().encode(JWT_SECRET);
}

export interface AdminClaims {
  id: string;
  role?: string;
}

export async function signToken(claims: AdminClaims): Promise<string> {
  return new SignJWT({ id: claims.id, role: claims.role })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRES_IN)
    .sign(secretKey());
}

// Returns the claims, or null if the token is missing/invalid/expired.
export async function verifyToken(token?: string | null): Promise<AdminClaims | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey());
    return { id: String(payload.id), role: payload.role as string | undefined };
  } catch {
    return null;
  }
}
