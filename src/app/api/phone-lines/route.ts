import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { apiResponse, apiError } from "@/lib/api-utils";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const operator = searchParams.get("operator");
    const onSale = searchParams.get("onSale");

    const now = new Date();
    const lines = await prisma.phoneLine.findMany({
      where: {
        isAvailable: true,
        AND: [
          {
            OR: [{ startsAt: null }, { startsAt: { lte: now } }],
          },
          {
            OR: [{ expiresAt: null }, { expiresAt: { gte: now } }],
          },
          ...(operator && operator !== "all" ? [{ operator }] : []),
          ...(onSale === "1" ? [{ isOnSale: true }] : []),
        ],
      },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });

    return apiResponse({
      lines: lines.map((line) => ({
        ...line,
        price: Number(line.price),
        comparePrice: line.comparePrice ? Number(line.comparePrice) : null,
      })),
    });
  } catch {
    return apiError("Failed to fetch phone lines", 500);
  }
}
