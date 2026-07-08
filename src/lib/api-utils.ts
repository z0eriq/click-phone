import { NextRequest, NextResponse } from "next/server";

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function rateLimit(
  request: NextRequest,
  limit: number = 100,
  windowMs: number = 60000
): NextResponse | null {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0] ||
    request.headers.get("x-real-ip") ||
    "unknown";

  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return null;
  }

  if (record.count >= limit) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  record.count++;
  return null;
}

export function apiResponse<T>(
  data: T,
  status: number = 200
): NextResponse {
  return NextResponse.json(data, { status });
}

export function apiError(
  message: string,
  status: number = 400
): NextResponse {
  return NextResponse.json({ error: message }, { status });
}

export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, "")
    .trim()
    .slice(0, 10000);
}
