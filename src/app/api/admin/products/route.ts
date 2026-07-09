import { NextRequest } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { getAuthFromRequest, isAdmin, logActivity } from "@/lib/auth";
import { apiResponse, apiError, rateLimit } from "@/lib/api-utils";
import { slugify } from "@/lib/utils";

const productSchema = z.object({
  name: z.string().min(2).max(200),
  nameAr: z.string().optional(),
  slug: z.string().optional(),
  description: z.string().optional(),
  descriptionAr: z.string().optional(),
  sku: z.string().min(2).max(50),
  barcode: z.string().optional(),
  price: z.number().positive(),
  comparePrice: z.number().optional().nullable(),
  costPrice: z.number().optional().nullable(),
  stock: z.number().int().min(0).default(0),
  brandId: z.string().optional().nullable(),
  categoryId: z.string().optional().nullable(),
  imageUrl: z.string().optional(),
  videoUrl: z.string().optional(),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  isNew: z.boolean().default(false),
  isOnSale: z.boolean().default(false),
});

async function requireAdmin(request: NextRequest) {
  const session = await getAuthFromRequest(request);
  if (!session || !isAdmin(session.role)) return null;
  return session;
}

export async function GET(request: NextRequest) {
  const session = await requireAdmin(request);
  if (!session) return apiError("Unauthorized", 401);

  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");

    const where = q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" as const } },
            { nameAr: { contains: q, mode: "insensitive" as const } },
            { sku: { contains: q, mode: "insensitive" as const } },
          ],
        }
      : {};

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          images: { orderBy: { sortOrder: "asc" }, take: 1 },
          brand: true,
          category: true,
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    return apiResponse({
      products: products.map((p) => ({
        ...p,
        price: Number(p.price),
        comparePrice: p.comparePrice ? Number(p.comparePrice) : null,
        costPrice: p.costPrice ? Number(p.costPrice) : null,
      })),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("Admin products GET:", error);
    return apiError("Failed to fetch products", 500);
  }
}

export async function POST(request: NextRequest) {
  const limited = rateLimit(request, 30, 60000);
  if (limited) return limited;

  const session = await requireAdmin(request);
  if (!session) return apiError("Unauthorized", 401);

  try {
    const body = await request.json();
    const parsed = productSchema.safeParse(body);
    if (!parsed.success) {
      return apiError(parsed.error.errors[0]?.message || "Invalid data", 400);
    }

    const data = parsed.data;
    const slug = data.slug || slugify(data.name) || slugify(data.sku);

    const existingSlug = await prisma.product.findUnique({ where: { slug } });
    const finalSlug = existingSlug ? `${slug}-${Date.now()}` : slug;

    const existingSku = await prisma.product.findUnique({ where: { sku: data.sku } });
    if (existingSku) return apiError("SKU already exists", 409);

    const product = await prisma.product.create({
      data: {
        name: data.name,
        nameAr: data.nameAr,
        slug: finalSlug,
        description: data.description,
        descriptionAr: data.descriptionAr,
        sku: data.sku,
        barcode: data.barcode,
        price: data.price,
        comparePrice: data.comparePrice,
        costPrice: data.costPrice,
        stock: data.stock,
        brandId: data.brandId || null,
        categoryId: data.categoryId || null,
        videoUrl: data.videoUrl,
        isActive: data.isActive,
        isFeatured: data.isFeatured,
        isNew: data.isNew,
        isOnSale: data.isOnSale || (data.comparePrice ? data.comparePrice > data.price : false),
        images: data.imageUrl
          ? { create: [{ url: data.imageUrl, isPrimary: true, sortOrder: 0 }] }
          : undefined,
      },
      include: { images: true, brand: true, category: true },
    });

    await logActivity(session.userId, "CREATE_PRODUCT", "Product", product.id, data.name, request);

    return apiResponse({
      product: {
        ...product,
        price: Number(product.price),
        comparePrice: product.comparePrice ? Number(product.comparePrice) : null,
      },
    });
  } catch (error) {
    console.error("Admin products POST:", error);
    return apiError("Failed to create product", 500);
  }
}
