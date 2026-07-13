import { NextRequest } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { getAuthFromRequest, isAdmin } from "@/lib/auth";
import { apiResponse, apiError } from "@/lib/api-utils";

const phoneLineSchema = z.object({
  number: z.string().min(7).max(20),
  operator: z.enum(["zain", "orange", "umniah"]),
  price: z.number().positive(),
  comparePrice: z.number().positive().optional().nullable(),
  title: z.string().optional().nullable(),
  titleAr: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  descriptionAr: z.string().optional().nullable(),
  isFeatured: z.boolean().default(false),
  isOnSale: z.boolean().default(false),
  isAvailable: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
  startsAt: z.string().datetime().optional().nullable(),
  expiresAt: z.string().datetime().optional().nullable(),
});

function parseDate(value: string | null | undefined) {
  return value ? new Date(value) : null;
}

function serialize(line: {
  price: { toString(): string } | number;
  comparePrice: { toString(): string } | number | null;
  [key: string]: unknown;
}) {
  return {
    ...line,
    price: Number(line.price),
    comparePrice: line.comparePrice != null ? Number(line.comparePrice) : null,
  };
}

export async function GET(request: NextRequest) {
  const session = await getAuthFromRequest(request);
  if (!session || !isAdmin(session.role)) return apiError("Unauthorized", 401);

  try {
    const lines = await prisma.phoneLine.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });
    return apiResponse({ lines: lines.map(serialize) });
  } catch {
    return apiError("Failed to fetch phone lines", 500);
  }
}

export async function POST(request: NextRequest) {
  const session = await getAuthFromRequest(request);
  if (!session || !isAdmin(session.role)) return apiError("Unauthorized", 401);

  try {
    const body = await request.json();
    const parsed = phoneLineSchema.safeParse(body);
    if (!parsed.success) return apiError("Invalid data", 400);

    const { startsAt, expiresAt, ...data } = parsed.data;
    const existing = await prisma.phoneLine.findUnique({
      where: { number: data.number },
    });
    if (existing) return apiError("Number already exists", 409);

    const line = await prisma.phoneLine.create({
      data: {
        ...data,
        startsAt: parseDate(startsAt),
        expiresAt: parseDate(expiresAt),
      },
    });
    return apiResponse({ line: serialize(line) });
  } catch {
    return apiError("Failed to create phone line", 500);
  }
}
