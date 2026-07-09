import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { apiResponse, apiError } from "@/lib/api-utils";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q") || "";
    const category = searchParams.get("category");
    const brand = searchParams.get("brand");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const color = searchParams.get("color");
    const storage = searchParams.get("storage");
    const rating = searchParams.get("rating");
    const featured = searchParams.get("featured");
    const onSale = searchParams.get("onSale");
    const isNew = searchParams.get("isNew");
    const sort = searchParams.get("sort") || "newest";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");

    // Live search
    if (q && q.length >= 2 && !category && !brand) {
      const products = await prisma.product.findMany({
        where: {
          isActive: true,
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { nameAr: { contains: q, mode: "insensitive" } },
            { sku: { contains: q, mode: "insensitive" } },
          ],
        },
        include: {
          images: { orderBy: { sortOrder: "asc" }, take: 1 },
        },
        take: 10,
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
    }

    const where: Record<string, unknown> = { isActive: true };

    if (q) {
      where.OR = [
        { name: { contains: q } },
        { nameAr: { contains: q } },
        { description: { contains: q } },
      ];
    }

    if (category) {
      const cat = await prisma.category.findUnique({ where: { slug: category } });
      if (cat) where.categoryId = cat.id;
    }

    if (brand) {
      const b = await prisma.brand.findUnique({ where: { slug: brand } });
      if (b) where.brandId = b.id;
    }

    if (minPrice) where.price = { ...(where.price as object), gte: parseFloat(minPrice) };
    if (maxPrice) where.price = { ...(where.price as object), lte: parseFloat(maxPrice) };
    if (featured === "true") where.isFeatured = true;
    if (onSale === "true") where.isOnSale = true;
    if (isNew === "true") where.isNew = true;

    const orderBy: Record<string, string> =
      sort === "price-asc"
        ? { price: "asc" }
        : sort === "price-desc"
          ? { price: "desc" }
          : sort === "popular"
            ? { salesCount: "desc" }
            : { createdAt: "desc" };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          images: { orderBy: { sortOrder: "asc" }, take: 1 },
          brand: true,
          category: true,
          reviews: { where: { isApproved: true }, select: { rating: true } },
          variants: color || storage
            ? { where: { ...(color && { color }), ...(storage && { storage }) } }
            : false,
        },
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    let filtered = products;
    if (rating) {
      const minRating = parseInt(rating);
      filtered = products.filter((p) => {
        if (p.reviews.length === 0) return false;
        const avg = p.reviews.reduce((a, r) => a + r.rating, 0) / p.reviews.length;
        return avg >= minRating;
      });
    }

    return apiResponse({
      products: filtered.map((p) => ({
        ...p,
        price: Number(p.price),
        comparePrice: p.comparePrice ? Number(p.comparePrice) : null,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Products API error:", error);
    return apiError("Failed to fetch products", 500);
  }
}
