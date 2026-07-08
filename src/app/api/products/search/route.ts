import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { apiResponse, apiError } from "@/lib/api-utils";

export async function GET(request: NextRequest) {
  const q = new URL(request.url).searchParams.get("q") || "";
  if (q.length < 2) return apiResponse({ products: [] });

  try {
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        OR: [
          { name: { contains: q } },
          { nameAr: { contains: q } },
          { sku: { contains: q } },
        ],
      },
      include: {
        images: { orderBy: { sortOrder: "asc" }, take: 1 },
      },
      take: 8,
    });

    return apiResponse({
      products: products.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        price: Number(p.price),
        image: p.images[0]?.url,
      })),
    });
  } catch {
    return apiResponse({ products: [] });
  }
}
