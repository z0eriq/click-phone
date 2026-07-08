"use client";

import { useLocaleStore, useWishlistStore } from "@/store";
import { t } from "@/lib/i18n";
import { Heart } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function WishlistPage() {
  const { locale } = useLocaleStore();
  const { items } = useWishlistStore();

  return (
    <div className="container py-12">
      <h1 className="section-title mb-8">{t(locale, "wishlist")}</h1>
      {items.length === 0 ? (
        <div className="flex flex-col items-center py-20">
          <Heart className="mb-4 h-16 w-16 text-gray-300" />
          <p className="mb-4 text-gray-500">
            {locale === "ar" ? "قائمة المفضلة فارغة" : "Your wishlist is empty"}
          </p>
          <Link href="/shop">
            <Button>{t(locale, "continueShopping")}</Button>
          </Link>
        </div>
      ) : (
        <p className="text-gray-500">
          {items.length} {locale === "ar" ? "منتج في المفضلة" : "items in wishlist"}
        </p>
      )}
    </div>
  );
}
