import { NextRequest } from "next/server";
import { route, json, requireAdmin } from "@/lib/api-helpers";
import { signUpload } from "@/lib/cloudinary";

export const dynamic = "force-dynamic";

// GET /api/upload/sign?folder=products (admin) — signature for direct-to-Cloudinary
// upload. The browser uploads the file straight to Cloudinary using this, so file
// bytes never pass through the serverless function (no 4.5 MB body cap).
export const GET = route(async (req: NextRequest) => {
  await requireAdmin(req);
  const folderParam = req.nextUrl.searchParams.get("folder");
  const folder = folderParam ? `miyaabi/${folderParam}` : "miyaabi";
  return json(signUpload(folder));
});
