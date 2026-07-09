"use client";

import { cn, formatPrice, calculateDiscount, LOCALE_AR, LOCALE_EN } from "@/lib/utils";
import { getLocalizedField, t, type Locale } from "@/lib/i18n";
import { useLocaleStore, useCartStore, useWishlistStore } from "@/store";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart, Star, Eye } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "sonner";

export interface ProductCardData {
  id: string;
  name: string;
  nameAr?: string | null;
  slug: string;
  price: number | string;
  comparePrice?: number | string | null;
  stock: number;
  isNew?: boolean;
  isOnSale?: boolean;
  images?: { url: string; alt?: string | null }[];
  brand?: { name: string } | null;
  reviews?: { rating: number }[];
}

interface ProductCardProps {
  product: ProductCardData;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { locale } = useLocaleStore();
  const { addItem } = useCartStore();
  const { toggleItem, isInWishlist } = useWishlistStore();

  const price = Number(product.price);
  const comparePrice = product.comparePrice ? Number(product.comparePrice) : null;
  const discount = comparePrice ? calculateDiscount(price, comparePrice) : 0;
  const name = getLocalizedField(product, "name", locale);
  const image = product.images?.[0]?.url || "/images/placeholder-product.jpg";
  const avgRating =
    product.reviews && product.reviews.length > 0
      ? product.reviews.reduce((a, r) => a + r.rating, 0) / product.reviews.length
      : 0;
  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (product.stock <= 0) {
      toast.error(locale === "ar" ? "المنتج غير متوفر" : "Product out of stock");
      return;
    }
    addItem({
      id: `${product.id}-default`,
      productId: product.id,
      name: product.name,
      nameAr: product.nameAr || undefined,
      image,
      price,
      quantity: 1,
      stock: product.stock,
    });
    toast.success(locale === "ar" ? "تمت الإضافة للسلة" : "Added to cart");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
    >
      <Link href={`/shop/${product.slug}`} className="group block">
        <div className="relative overflow-hidden rounded-2xl border border-gray-200/50 bg-white transition-all duration-500 hover:border-brand-500/30 hover:shadow-2xl hover:shadow-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-brand-500/30">
          {/* Badges */}
          <div className="absolute start-3 top-3 z-10 flex flex-col gap-1.5">
            {product.isNew && (
              <span className="rounded-full bg-brand-600 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                NEW
              </span>
            )}
            {discount > 0 && (
              <span className="rounded-full bg-red-500 px-2.5 py-0.5 text-[10px] font-bold text-white">
                -{discount}%
              </span>
            )}
          </div>

          {/* Wishlist */}
          <button
            onClick={(e) => {
              e.preventDefault();
              toggleItem(product.id);
            }}
            className={cn(
              "absolute end-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full backdrop-blur-md transition-all",
              inWishlist
                ? "bg-red-500 text-white"
                : "bg-white/80 text-gray-600 hover:bg-white dark:bg-gray-800/80 dark:text-gray-300"
            )}
          >
            <Heart className={cn("h-4 w-4", inWishlist && "fill-current")} />
          </button>

          {/* Image */}
          <div className="relative aspect-square overflow-hidden bg-gray-50 dark:bg-gray-800">
            <Image
              src={image}
              alt={name}
              fill
              className="object-contain p-4 transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
            <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/0 opacity-0 transition-all group-hover:bg-black/5 group-hover:opacity-100">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg dark:bg-gray-800">
                <Eye className="h-4 w-4" />
              </span>
            </div>
          </div>

          {/* Info */}
          <div className="p-4">
            {product.brand && (
              <p className="mb-1 text-xs font-medium uppercase tracking-wider text-brand-600">
                {product.brand.name}
              </p>
            )}
            <h3 className="mb-2 line-clamp-2 text-sm font-semibold text-gray-900 dark:text-white">
              {name}
            </h3>

            {avgRating > 0 && (
              <div className="mb-2 flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-3 w-3",
                      i < Math.round(avgRating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    )}
                  />
                ))}
                <span className="ms-1 text-xs text-gray-500">
                  ({product.reviews?.length})
                </span>
              </div>
            )}

            <div className="mb-3 flex items-baseline gap-2">
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                {formatPrice(price, locale === "ar" ? LOCALE_AR : LOCALE_EN)}
              </span>
              {comparePrice && comparePrice > price && (
                <span className="text-sm text-gray-400 line-through">
                  {formatPrice(comparePrice, locale === "ar" ? LOCALE_AR : LOCALE_EN)}
                </span>
              )}
            </div>

            <Button
              onClick={handleAddToCart}
              className="w-full"
              size="sm"
              disabled={product.stock <= 0}
            >
              <ShoppingCart className="h-4 w-4" />
              {product.stock <= 0 ? t(locale, "outOfStock") : t(locale, "addToCart")}
            </Button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
