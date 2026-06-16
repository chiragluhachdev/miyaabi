import { NextRequest } from "next/server";
import { route, json, ApiError } from "@/lib/api-helpers";
import { getOrCreateSettings } from "@/lib/queries";
import { rateLimit } from "@/lib/rateLimit";

export const dynamic = "force-dynamic";

// Strip the secret access code before returning gated content to the client.
function publicPartner(partner: unknown) {
  if (!partner) return null;
  const obj =
    typeof (partner as { toObject?: () => object }).toObject === "function"
      ? (partner as { toObject: () => object }).toObject()
      : partner;
  const { accessCode, ...safe } = obj as Record<string, unknown>;
  void accessCode;
  return safe;
}

// POST /api/partner/access (public) — verify the passcode, return gated content
export const POST = route(async (req: NextRequest) => {
  const limited = await rateLimit(req, "partner-access", 10, 60);
  if (limited) return limited;

  const { code } = await req.json().catch(() => ({}));
  const settings = await getOrCreateSettings();
  const partner = settings.partner;

  if (!partner || partner.enabled === false) {
    throw new ApiError(404, "Partner area is not available");
  }
  if (!code || String(code).trim() !== (partner.accessCode || "")) {
    throw new ApiError(401, "Invalid access code");
  }
  return json({ ok: true, partner: publicPartner(partner) });
});
