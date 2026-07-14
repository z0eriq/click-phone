"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Star,
  ShoppingCart,
  Heart,
  Share2,
  Truck,
  Shield,
  Minus,
  Plus,
  Check,
} from "lucide-react";
import { ProductCard, type ProductCardData } from "@/components/shop/product-card";
import { Button } from "@/components/ui/button";
import { useCartStore, useLocaleStore, useWishlistStore } from "@/store";
import { formatPrice, calculateDiscount } from "@/lib/utils";
import { t, getLocalizedField } from "@/lib/i18n";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ProductDetailProps {
  product: {
    id: string;
    name: string;
    nameAr: string | null;
    slug: string;
    description: string | null;
    descriptionAr: string | null;
    price: number;
    comparePrice: number | null;
    stock: number;
    sku: string;
    barcode: string | null;
    videoUrl: string | null;
    images: Array<{ url: string; alt: string | null }>;
    brand: { name: string } | null;
    category: { name: string; nameAr: string | null } | null;
    variants: Array<{
      id: string;
      name: string;
      color: string | null;
      colorHex: string | null;
      storage: string | null;
      price: number | null;
      stock: number;
      sku: string;
    }>;
    specs: Array<{
      group: string;
      groupAr: string | null;
      key: string;
      keyAr: string | null;
      value: string;
      valueAr: string | null;
    }>;
    reviews: Array<{
      id: string;
      rating: number;
      title: string | null;
      comment: string | null;
      user: { name: string };
    }>;
    relatedProducts: ProductCardData[];
  };
}

export function ProductDetail({ product }: ProductDetailProps) {
  const { locale } = useLocaleStore();
  const { addItem } = useCartStore();
  const { toggleItem, isInWishlist } = useWishlistStore();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0] || null);
  const [quantity, setQuantity] = useState(1);

  const name = getLocalizedField(product, "name", locale);
  const description = getLocalizedField(product, "description", locale) || "";
  const price = selectedVariant?.price || product.price;
  const stock = selectedVariant?.stock ?? product.stock;
  const discount = product.comparePrice ? calculateDiscount(price, product.comparePrice) : 0;
  const avgRating =
    product.reviews.length > 0
      ? product.reviews.reduce((a, r) => a + r.rating, 0) / product.reviews.length
      : 0;

  const specGroups = product.specs.reduce(
    (acc, spec) => {
      const group = locale === "ar" && spec.groupAr ? spec.groupAr : spec.group;
      if (!acc[group]) acc[group] = [];
      acc[group].push(spec);
      return acc;
    },
    {} as Record<string, typeof product.specs>
  );

  const handleAddToCart = () => {
    if (stock <= 0) {
      toast.error(t(locale, "outOfStock"));
      return;
    }
    const image = product.images[0]?.url || "";
    addItem({
      id: `${product.id}-${selectedVariant?.id || "default"}`,
      productId: product.id,
      variantId: selectedVariant?.id,
      name: product.name,
      nameAr: product.nameAr || undefined,
      image,
      price,
      quantity,
      color: selectedVariant?.color || undefined,
      storage: selectedVariant?.storage || undefined,
      stock,
    });
    toast.success(locale === "ar" ? "تمت الإضافة للسلة" : "Added to cart");
  };

  return (
    <div className="container py-8">
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Images */}
        <div>
          <div className="relative mb-4 aspect-square overflow-hidden rounded-2xl bg-gray-50 dark:bg-gray-900">
            <Image
              src={product.images[selectedImage]?.url || "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600"}
              alt={name}
              fill
              className="object-contain p-8"
              priority
              unoptimized={(product.images[selectedImage]?.url || "").startsWith("data:")}
            />
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={cn(
                    "relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2",
                    selectedImage === i ? "border-brand-600" : "border-transparent"
                  )}
                >
                  <Image
                    src={img.url}
                    alt=""
                    fill
                    className="object-contain p-1"
                    unoptimized={img.url.startsWith("data:")}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          {product.brand && (
            <p className="mb-1 text-sm font-medium uppercase tracking-wider text-brand-600">
              {product.brand.name}
            </p>
          )}
          <h1 className="mb-2 text-3xl font-black">{name}</h1>

          {avgRating > 0 && (
            <div className="mb-4 flex items-center gap-2">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-4 w-4",
                      i < Math.round(avgRating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    )}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500">
                ({product.reviews.length} {t(locale, "reviews")})
              </span>
            </div>
          )}

          <div className="mb-6 flex items-baseline gap-3">
            <span className="text-3xl font-black text-brand-600">
              {formatPrice(price)}
            </span>
            {product.comparePrice && product.comparePrice > price && (
              <>
                <span className="text-lg text-gray-400 line-through">
                  {formatPrice(product.comparePrice)}
                </span>
                <span className="rounded-full bg-red-100 px-2 py-0.5 text-sm font-bold text-red-600">
                  -{discount}%
                </span>
              </>
            )}
          </div>

          {/* Variants */}
          {product.variants.length > 0 && (
            <div className="mb-6 space-y-4">
              {product.variants.some((v) => v.color) && (
                <div>
                  <p className="mb-2 text-sm font-medium">{t(locale, "color")}</p>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((variant) => (
                      <button
                        key={variant.id}
                        onClick={() => setSelectedVariant(variant)}
                        className={cn(
                          "flex items-center gap-2 rounded-xl border px-4 py-2 text-sm transition-all",
                          selectedVariant?.id === variant.id
                            ? "border-brand-600 bg-brand-50"
                            : "hover:border-gray-300"
                        )}
                      >
                        {variant.colorHex && (
                          <span
                            className="h-4 w-4 rounded-full border"
                            style={{ backgroundColor: variant.colorHex }}
                          />
                        )}
                        {variant.color}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {product.variants.some((v) => v.storage) && (
                <div>
                  <p className="mb-2 text-sm font-medium">{t(locale, "storage")}</p>
                  <div className="flex flex-wrap gap-2">
                    {[...new Set(product.variants.map((v) => v.storage).filter(Boolean))].map(
                      (storage) => (
                        <button
                          key={storage}
                          onClick={() => {
                            const v = product.variants.find(
                              (v) =>
                                v.storage === storage &&
                                (!selectedVariant?.color || v.color === selectedVariant.color)
                            );
                            if (v) setSelectedVariant(v);
                          }}
                          className={cn(
                            "rounded-xl border px-4 py-2 text-sm",
                            selectedVariant?.storage === storage
                              ? "border-brand-600 bg-brand-50"
                              : "hover:border-gray-300"
                          )}
                        >
                          {storage}
                        </button>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Quantity */}
          <div className="mb-6 flex items-center gap-4">
            <div className="flex items-center gap-2 rounded-xl border px-2 dark:border-gray-700">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-8 text-center font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(stock, quantity + 1))}
                className="p-2"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <span className={cn("text-sm", stock > 0 ? "text-green-600" : "text-red-600")}>
              {stock > 0 ? (
                <><Check className="me-1 inline h-4 w-4" />{t(locale, "inStock")} ({stock})</>
              ) : (
                t(locale, "outOfStock")
              )}
            </span>
          </div>

          {/* Actions */}
          <div className="mb-6 flex gap-3">
            <Button size="lg" className="flex-1 gap-2" onClick={handleAddToCart} disabled={stock <= 0}>
              <ShoppingCart className="h-5 w-5" />
              {t(locale, "addToCart")}
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => toggleItem(product.id)}
            >
              <Heart className={cn("h-5 w-5", isInWishlist(product.id) && "fill-red-500 text-red-500")} />
            </Button>
            <Button size="lg" variant="outline">
              <Share2 className="h-5 w-5" />
            </Button>
          </div>

          {/* Features */}
          <div className="mb-6 grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 rounded-xl bg-gray-50 p-3 text-sm dark:bg-gray-900">
              <Truck className="h-4 w-4 text-brand-600" />
              {t(locale, "freeShipping")}
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-gray-50 p-3 text-sm dark:bg-gray-900">
              <Shield className="h-4 w-4 text-brand-600" />
              {t(locale, "warranty")}
            </div>
          </div>

          <p className="text-xs text-gray-500">
            SKU: {selectedVariant?.sku || product.sku}
            {product.barcode && ` | Barcode: ${product.barcode}`}
          </p>
        </div>
      </div>

      {/* Description */}
      {description && (
        <section className="mt-12">
          <h2 className="mb-4 text-xl font-bold">
            {locale === "ar" ? "الوصف" : "Description"}
          </h2>
          <p className="leading-relaxed text-gray-600 dark:text-gray-400">{description}</p>
        </section>
      )}

      {/* Specs */}
      {Object.keys(specGroups).length > 0 && (
        <section className="mt-12">
          <h2 className="mb-4 text-xl font-bold">{t(locale, "specifications")}</h2>
          {Object.entries(specGroups).map(([group, specs]) => (
            <div key={group} className="mb-6">
              <h3 className="mb-2 font-semibold text-brand-600">{group}</h3>
              <div className="overflow-hidden rounded-xl border dark:border-gray-800">
                {specs.map((spec, i) => (
                  <div
                    key={i}
                    className={cn(
                      "flex justify-between px-4 py-3 text-sm",
                      i % 2 === 0 ? "bg-gray-50 dark:bg-gray-900" : ""
                    )}
                  >
                    <span className="text-gray-500">
                      {getLocalizedField(spec, "key", locale)}
                    </span>
                    <span className="font-medium">
                      {getLocalizedField(spec, "value", locale)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Reviews */}
      {product.reviews.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-4 text-xl font-bold">{t(locale, "reviews")}</h2>
          <div className="space-y-4">
            {product.reviews.map((review) => (
              <div key={review.id} className="rounded-xl border p-4 dark:border-gray-800">
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-medium">{review.user.name}</span>
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "h-3 w-3",
                          i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                        )}
                      />
                    ))}
                  </div>
                </div>
                {review.comment && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">{review.comment}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Related Products */}
      {product.relatedProducts.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-6 text-xl font-bold">{t(locale, "relatedProducts")}</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {product.relatedProducts.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
