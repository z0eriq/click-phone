import { NextRequest } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { getAuthFromRequest, isAdmin } from "@/lib/auth";
import { apiResponse, apiError } from "@/lib/api-utils";

const bannerSchema = z.object({
  title: z.string().min(1).max(200),
  titleAr: z.string().optional().nullable(),
  subtitle: z.string().optional().nullable(),
  subtitleAr: z.string().optional().nullable(),
  image: z.string().url(),
  link: z.string().optional().nullable(),
  position: z.string().default("home"),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
  startsAt: z.string().datetime().optional().nullable(),
  expiresAt: z.string().datetime().optional().nullable(),
});

function parseDate(value: string | null | undefined) {
  return value ? new Date(value) : null;
}

export async function GET(request: NextRequest) {
  const session = await getAuthFromRequest(request);
  if (!session || !isAdmin(session.role)) return apiError("Unauthorized", 401);

  try {
    const banners = await prisma.banner.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });
    return apiResponse({ banners });
  } catch {
    return apiError("Failed to fetch banners", 500);
  }
}

export async function POST(request: NextRequest) {
  const session = await getAuthFromRequest(request);
  if (!session || !isAdmin(session.role)) return apiError("Unauthorized", 401);

  try {
    const body = await request.json();
    const parsed = bannerSchema.safeParse(body);
    if (!parsed.success) return apiError("Invalid data", 400);

    const { startsAt, expiresAt, ...data } = parsed.data;
    const banner = await prisma.banner.create({
      data: {
        ...data,
        startsAt: parseDate(startsAt),
        expiresAt: parseDate(expiresAt),
      },
    });
    return apiResponse({ banner });
  } catch {
    return apiError("Failed to create banner", 500);
  }
}
