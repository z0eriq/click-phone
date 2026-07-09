import { NextRequest } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { getAuthFromRequest, isAdmin } from "@/lib/auth";
import { apiResponse, apiError } from "@/lib/api-utils";

const couponSchema = z.object({
  code: z.string().min(3).max(20),
  description: z.string().optional(),
  discountType: z.enum(["percentage", "fixed"]).default("percentage"),
  discountValue: z.number().positive(),
  minOrder: z.number().optional().nullable(),
  maxDiscount: z.number().optional().nullable(),
  usageLimit: z.number().int().optional().nullable(),
  isActive: z.boolean().default(true),
});

export async function GET(request: NextRequest) {
  const session = await getAuthFromRequest(request);
  if (!session || !isAdmin(session.role)) return apiError("Unauthorized", 401);

  try {
    const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: "desc" } });
    return apiResponse({
      coupons: coupons.map((c) => ({
        ...c,
        discountValue: Number(c.discountValue),
        minOrder: c.minOrder ? Number(c.minOrder) : null,
        maxDiscount: c.maxDiscount ? Number(c.maxDiscount) : null,
      })),
    });
  } catch {
    return apiError("Failed to fetch coupons", 500);
  }
}

export async function POST(request: NextRequest) {
  const session = await getAuthFromRequest(request);
  if (!session || !isAdmin(session.role)) return apiError("Unauthorized", 401);

  try {
    const body = await request.json();
    const parsed = couponSchema.safeParse(body);
    if (!parsed.success) return apiError("Invalid data", 400);

    const coupon = await prisma.coupon.create({
      data: { ...parsed.data, code: parsed.data.code.toUpperCase() },
    });
    return apiResponse({ coupon });
  } catch {
    return apiError("Failed to create coupon", 500);
  }
}
