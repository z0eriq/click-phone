import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { apiResponse, apiError } from "@/lib/api-utils";

export async function POST(request: NextRequest) {
  try {
    const { code, subtotal } = await request.json();
    if (!code) return apiError("Coupon code required", 400);

    const coupon = await prisma.coupon.findUnique({ where: { code: code.toUpperCase() } });
    if (!coupon || !coupon.isActive) {
      return apiResponse({ valid: false, error: "Invalid coupon" });
    }

    if (coupon.expiresAt && new Date() > coupon.expiresAt) {
      return apiResponse({ valid: false, error: "Coupon expired" });
    }

    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return apiResponse({ valid: false, error: "Coupon usage limit reached" });
    }

    if (coupon.minOrder && subtotal < Number(coupon.minOrder)) {
      return apiResponse({
        valid: false,
        error: `Minimum order: ${Number(coupon.minOrder)}`,
      });
    }

    let discount = 0;
    if (coupon.discountType === "percentage") {
      discount = subtotal * (Number(coupon.discountValue) / 100);
      if (coupon.maxDiscount) discount = Math.min(discount, Number(coupon.maxDiscount));
    } else {
      discount = Number(coupon.discountValue);
    }

    return apiResponse({ valid: true, discount, code: coupon.code });
  } catch {
    return apiError("Validation failed", 500);
  }
}
