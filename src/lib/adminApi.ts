// Admin API client. Auth is via the httpOnly `miyaabi_admin` cookie, which the
// browser sends automatically on same-origin requests — no Bearer token, no
// localStorage. All calls go to the same-origin /api routes.

const API_PREFIX = "/api";

interface FetchOpts {
  method?: string;
  body?: unknown;
  // Kept for call-site compatibility; the cookie is always sent and public routes
  // simply ignore it, so this flag is now a no-op.
  auth?: boolean;
}

export async function adminFetch<T = unknown>(
  path: string,
  { method = "GET", body }: FetchOpts = {}
): Promise<T> {
  const res = await fetch(`${API_PREFIX}${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(
      (data as { message?: string }).message || `Request failed (${res.status})`
    );
  }
  return data as T;
}

interface SignedUpload {
  cloudName: string;
  apiKey: string;
  timestamp: number;
  folder: string;
  signature: string;
}

// Upload images straight to Cloudinary using a server-signed signature. The file
// bytes never pass through our serverless function (avoids the ~4.5 MB body cap).
export async function uploadImages(
  files: FileList | File[],
  folder?: string
): Promise<{ url: string; publicId: string }[]> {
  const signRes = await fetch(
    `${API_PREFIX}/upload/sign${folder ? `?folder=${encodeURIComponent(folder)}` : ""}`
  );
  const sign = (await signRes.json().catch(() => ({}))) as Partial<SignedUpload> & {
    message?: string;
  };
  if (!signRes.ok) throw new Error(sign.message || "Could not start upload");

  const uploaded: { url: string; publicId: string }[] = [];
  for (const file of Array.from(files)) {
    const form = new FormData();
    form.append("file", file);
    form.append("api_key", sign.apiKey as string);
    form.append("timestamp", String(sign.timestamp));
    form.append("folder", sign.folder as string);
    form.append("signature", sign.signature as string);
    const up = await fetch(
      `https://api.cloudinary.com/v1_1/${sign.cloudName}/image/upload`,
      { method: "POST", body: form }
    );
    const data = await up.json().catch(() => ({}));
    if (!up.ok) throw new Error(data?.error?.message || "Upload failed");
    uploaded.push({ url: data.secure_url, publicId: data.public_id });
  }
  return uploaded;
}
