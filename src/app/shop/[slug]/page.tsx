import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/shop/product-detail";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;

  try {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        brand: true,
        category: true,
        variants: { where: { isActive: true } },
        specs: { orderBy: { sortOrder: "asc" } },
        reviews: {
          where: { isApproved: true },
          include: { user: { select: { name: true } } },
        },
      },
    });

    if (!product || !product.isActive) notFound();

    // Increment views
    await prisma.product.update({
      where: { id: product.id },
      data: { views: { increment: 1 } },
    });

    const relatedProducts = await prisma.product.findMany({
      where: {
        isActive: true,
        categoryId: product.categoryId,
        id: { not: product.id },
      },
      include: {
        images: { take: 1 },
        brand: true,
        reviews: { where: { isApproved: true }, select: { rating: true } },
      },
      take: 4,
    });

    const serialized = {
      ...product,
      price: Number(product.price),
      comparePrice: product.comparePrice ? Number(product.comparePrice) : null,
      variants: product.variants.map((v) => ({
        ...v,
        price: v.price ? Number(v.price) : null,
      })),
      relatedProducts: relatedProducts.map((p) => ({
        ...p,
        price: Number(p.price),
        comparePrice: p.comparePrice ? Number(p.comparePrice) : null,
      })),
    };

    return <ProductDetail product={serialized} />;
  } catch {
    notFound();
  }
}
