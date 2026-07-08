import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthFromRequest, isAdmin, logActivity } from "@/lib/auth";
import { apiResponse, apiError } from "@/lib/api-utils";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAuthFromRequest(request);
    if (!session || !isAdmin(session.role)) {
      return apiError("Unauthorized", 401);
    }

    const { id } = await params;
    const { status } = await request.json();

    const order = await prisma.order.update({
      where: { id },
      data: { status },
    });

    await logActivity(
      session.userId,
      "UPDATE_ORDER_STATUS",
      "Order",
      id,
      `Status changed to ${status}`,
      request
    );

    return apiResponse({ order });
  } catch {
    return apiError("Failed to update order", 500);
  }
}
