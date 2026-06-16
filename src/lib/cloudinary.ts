import { v2 as cloudinary } from "cloudinary";

// Cloudinary config. Uploads are done CLIENT-SIDE via a signed signature (the
// browser uploads straight to Cloudinary, so file bytes never pass through a Vercel
// function and we avoid the ~4.5 MB request-body cap — gotcha G3). The server only
// (a) signs upload params and (b) deletes by publicId.

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const API_KEY = process.env.CLOUDINARY_API_KEY;
const API_SECRET = process.env.CLOUDINARY_API_SECRET;

cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: API_SECRET,
});

export function isCloudinaryConfigured(): boolean {
  return Boolean(CLOUD_NAME && API_KEY && API_SECRET);
}

export interface SignedUpload {
  cloudName: string;
  apiKey: string;
  timestamp: number;
  folder: string;
  signature: string;
}

// Produce a signature the browser uses to upload directly to Cloudinary.
// The signed params (folder + timestamp) must match what the client sends.
export function signUpload(folder = "miyaabi"): SignedUpload {
  if (!isCloudinaryConfigured()) {
    throw new Error("Cloudinary is not configured. Set CLOUDINARY_* env vars.");
  }
  const timestamp = Math.round(Date.now() / 1000);
  const signature = cloudinary.utils.api_sign_request(
    { timestamp, folder },
    API_SECRET as string
  );
  return { cloudName: CLOUD_NAME as string, apiKey: API_KEY as string, timestamp, folder, signature };
}

export async function destroyImage(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId);
}

export { cloudinary };
