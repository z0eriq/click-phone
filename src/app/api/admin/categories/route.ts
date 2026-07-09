import { NextRequest } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { getAuthFromRequest, isAdmin } from "@/lib/auth";
import { apiResponse, apiError } from "@/lib/api-utils";
import { slugify } from "@/lib/utils";

const categorySchema = z.object({
  name: z.string().min(2),
  nameAr: z.string().optional(),
  slug: z.string().optional(),
  description: z.string().optional(),
  icon: z.string().optional(),
  sortOrder: z.number().int().optional(),
});

export async function GET(request: NextRequest) {
  const session = await getAuthFromRequest(request);
  if (!session || !isAdmin(session.role)) return apiError("Unauthorized", 401);

  try {
    const categories = await prisma.category.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: { sortOrder: "asc" },
    });
    return apiResponse({ categories });
  } catch {
    return apiError("Failed to fetch categories", 500);
  }
}

export async function POST(request: NextRequest) {
  const session = await getAuthFromRequest(request);
  if (!session || !isAdmin(session.role)) return apiError("Unauthorized", 401);

  try {
    const body = await request.json();
    const parsed = categorySchema.safeParse(body);
    if (!parsed.success) return apiError("Invalid data", 400);

    const slug = parsed.data.slug || slugify(parsed.data.name);
    const category = await prisma.category.create({
      data: { ...parsed.data, slug },
    });
    return apiResponse({ category });
  } catch {
    return apiError("Failed to create category", 500);
  }
}
