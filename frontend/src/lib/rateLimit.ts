import "server-only";
import { NextRequest, NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Distributed rate limiting via Upstash Redis (durable across serverless
// instances, unlike in-memory). If the UPSTASH_* env vars are absent we fail OPEN
// (no limiting) so local/dev without Upstash still works.

const hasUpstash = Boolean(
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
);
const redis = hasUpstash ? Redis.fromEnv() : null;
const limiters = new Map<string, Ratelimit>();

function getLimiter(name: string, max: number, windowSec: number): Ratelimit | null {
  if (!redis) return null;
  let limiter = limiters.get(name);
  if (!limiter) {
    limiter = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(max, `${windowSec} s`),
      prefix: `rl:${name}`,
      analytics: false,
    });
    limiters.set(name, limiter);
  }
  return limiter;
}

function clientIp(req: NextRequest): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "127.0.0.1";
}

// Returns a 429 NextResponse if the caller is over the limit, otherwise null.
export async function rateLimit(
  req: NextRequest,
  name: string,
  max: number,
  windowSec: number
): Promise<NextResponse | null> {
  const limiter = getLimiter(name, max, windowSec);
  if (!limiter) return null; // not configured -> fail open
  const { success } = await limiter.limit(`${name}:${clientIp(req)}`);
  if (!success) {
    return NextResponse.json(
      { message: "Too many requests. Please slow down and try again shortly." },
      { status: 429 }
    );
  }
  return null;
}
