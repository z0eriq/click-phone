import { NextRequest } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { getAuthFromRequest, isAdmin, logActivity } from "@/lib/auth";
import { apiResponse, apiError } from "@/lib/api-utils";
import { slugify } from "@/lib/utils";

const updateSchema = z.object({
  name: z.string().min(2).max(200).optional(),
  nameAr: z.string().optional().nullable(),
  slug: z.string().optional(),
  description: z.string().optional().nullable(),
  descriptionAr: z.string().optional().nullable(),
  sku: z.string().min(2).max(50).optional(),
  barcode: z.string().optional().nullable(),
  price: z.number().positive().optional(),
  comparePrice: z.number().optional().nullable(),
  costPrice: z.number().optional().nullable(),
  stock: z.number().int().min(0).optional(),
  brandId: z.string().optional().nullable(),
  categoryId: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  videoUrl: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  isNew: z.boolean().optional(),
  isOnSale: z.boolean().optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAuthFromRequest(request);
  if (!session || !isAdmin(session.role)) return apiError("Unauthorized", 401);

  const { id } = await params;
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        brand: true,
        category: true,
        variants: true,
        specs: true,
      },
    });
    if (!product) return apiError("Product not found", 404);

    return apiResponse({
      product: {
        ...product,
        price: Number(product.price),
        comparePrice: product.comparePrice ? Number(product.comparePrice) : null,
        costPrice: product.costPrice ? Number(product.costPrice) : null,
      },
    });
  } catch {
    return apiError("Failed to fetch product", 500);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAuthFromRequest(request);
  if (!session || !isAdmin(session.role)) return apiError("Unauthorized", 401);

  const { id } = await params;
  try {
    const body = await request.json();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) return apiError("Invalid data", 400);

    const data = parsed.data;
    const { imageUrl, ...updateData } = data;

    if (updateData.sku) {
      const dup = await prisma.product.findFirst({
        where: { sku: updateData.sku, NOT: { id } },
      });
      if (dup) return apiError("SKU already exists", 409);
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...updateData,
        slug: updateData.slug || (updateData.name ? slugify(updateData.name) : undefined),
      },
      include: { images: true, brand: true, category: true },
    });

    if (imageUrl) {
      await prisma.productImage.deleteMany({ where: { productId: id } });
      await prisma.productImage.create({
        data: { productId: id, url: imageUrl, isPrimary: true, sortOrder: 0 },
      });
    }

    await logActivity(session.userId, "UPDATE_PRODUCT", "Product", id, undefined, request);

    return apiResponse({
      product: {
        ...product,
        price: Number(product.price),
        comparePrice: product.comparePrice ? Number(product.comparePrice) : null,
      },
    });
  } catch {
    return apiError("Failed to update product", 500);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAuthFromRequest(request);
  if (!session || !isAdmin(session.role)) return apiError("Unauthorized", 401);

  const { id } = await params;
  try {
    await prisma.review.deleteMany({ where: { productId: id } });
    await prisma.wishlistItem.deleteMany({ where: { productId: id } });
    await prisma.cartItem.deleteMany({ where: { productId: id } });
    await prisma.product.delete({ where: { id } });

    await logActivity(session.userId, "DELETE_PRODUCT", "Product", id, undefined, request);
    return apiResponse({ success: true });
  } catch {
    return apiError("Failed to delete product", 500);
  }
}
