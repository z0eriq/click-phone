import prisma from "@/lib/prisma";
import { HomePage } from "@/components/home/home-page";

export const dynamic = "force-dynamic";

async function getHomeData() {
  try {
    const [banners, featuredProducts, latestProducts, saleProducts, brands, categories] =
      await Promise.all([
        prisma.banner.findMany({
          where: { isActive: true, position: "home" },
          orderBy: { sortOrder: "asc" },
          take: 5,
        }),
        prisma.product.findMany({
          where: { isActive: true, isFeatured: true },
          include: {
            images: { orderBy: { sortOrder: "asc" }, take: 1 },
            brand: true,
            reviews: { where: { isApproved: true }, select: { rating: true } },
          },
          take: 8,
        }),
        prisma.product.findMany({
          where: { isActive: true, isNew: true },
          include: {
            images: { orderBy: { sortOrder: "asc" }, take: 1 },
            brand: true,
            reviews: { where: { isApproved: true }, select: { rating: true } },
          },
          orderBy: { createdAt: "desc" },
          take: 8,
        }),
        prisma.product.findMany({
          where: { isActive: true, isOnSale: true },
          include: {
            images: { orderBy: { sortOrder: "asc" }, take: 1 },
            brand: true,
            reviews: { where: { isApproved: true }, select: { rating: true } },
          },
          take: 8,
        }),
        prisma.brand.findMany({
          where: { isActive: true },
          orderBy: { sortOrder: "asc" },
        }),
        prisma.category.findMany({
          where: { isActive: true, parentId: null },
          orderBy: { sortOrder: "asc" },
          take: 8,
        }),
      ]);

    return {
      banners,
      featuredProducts: featuredProducts.map(serializeProduct),
      latestProducts: latestProducts.map(serializeProduct),
      saleProducts: saleProducts.map(serializeProduct),
      brands,
      categories,
    };
  } catch {
    return {
      banners: [],
      featuredProducts: [],
      latestProducts: [],
      saleProducts: [],
      brands: [],
      categories: [],
    };
  }
}

function serializeProduct(product: {
  id: string;
  name: string;
  nameAr: string | null;
  slug: string;
  price: unknown;
  comparePrice: unknown;
  stock: number;
  isNew: boolean;
  isOnSale: boolean;
  images: { url: string; alt: string | null }[];
  brand: { name: string } | null;
  reviews: { rating: number }[];
}) {
  return {
    ...product,
    price: Number(product.price),
    comparePrice: product.comparePrice ? Number(product.comparePrice) : null,
  };
}

export default async function Home() {
  const data = await getHomeData();
  return <HomePage data={data} />;
}
