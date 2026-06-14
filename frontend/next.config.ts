import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Placeholder assets are locally-generated SVGs.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Admin can use Cloudinary uploads, seeded photo URLs, or paste any image URL.
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],
  },
};

export default nextConfig;
