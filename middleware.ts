import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Simple in-memory store for rate limiting (Note: In production with multiple instances, use Redis)
const ipMap = new Map<string, { count: number; lastReset: number }>();

const RATE_LIMIT = 20; // Max requests
const WINDOW_MS = 60 * 1000; // Per 1 minute

export function middleware(request: NextRequest) {
  // Only apply to vehicle pages
  if (request.nextUrl.pathname.startsWith("/v/")) {
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const now = Date.now();

    const record = ipMap.get(ip) || { count: 0, lastReset: now };

    if (now - record.lastReset > WINDOW_MS) {
      record.count = 0;
      record.lastReset = now;
    }

    record.count++;
    ipMap.set(ip, record);

    if (record.count > RATE_LIMIT) {
      return new NextResponse("Too Many Requests", { status: 429 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/v/:path*",
};
