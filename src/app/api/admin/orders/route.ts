import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthFromRequest, isAdmin } from "@/lib/auth";
import { apiResponse, apiError } from "@/lib/api-utils";

export async function GET(request: NextRequest) {
  try {
    const session = await getAuthFromRequest(request);
    if (!session || !isAdmin(session.role)) {
      return apiError("Unauthorized", 401);
    }

    const orders = await prisma.order.findMany({
      include: {
        user: { select: { name: true, email: true } },
        items: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return apiResponse({
      orders: orders.map((o) => ({
        ...o,
        subtotal: Number(o.subtotal),
        discount: Number(o.discount),
        tax: Number(o.tax),
        shipping: Number(o.shipping),
        total: Number(o.total),
        items: o.items.map((i) => ({
          ...i,
          price: Number(i.price),
          total: Number(i.total),
        })),
      })),
    });
  } catch {
    return apiError("Failed to fetch orders", 500);
  }
}
