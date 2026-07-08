"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { ProductCard, type ProductCardData } from "@/components/shop/product-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLocaleStore } from "@/store";
import { t } from "@/lib/i18n";
import { SlidersHorizontal, Grid3X3, Loader2 } from "lucide-react";

export default function ShopPage() {
  const searchParams = useSearchParams();
  const { locale } = useLocaleStore();
  const [products, setProducts] = useState<ProductCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    minPrice: "",
    maxPrice: "",
    sort: "newest",
    rating: "",
  });
  const [showFilters, setShowFilters] = useState(false);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    const category = searchParams.get("category");
    const brand = searchParams.get("brand");
    const featured = searchParams.get("featured");
    const onSale = searchParams.get("onSale");
    const isNew = searchParams.get("isNew");
    const q = searchParams.get("q");

    if (category) params.set("category", category);
    if (brand) params.set("brand", brand);
    if (featured) params.set("featured", featured);
    if (onSale) params.set("onSale", onSale);
    if (isNew) params.set("isNew", isNew);
    if (q) params.set("q", q);
    if (filters.minPrice) params.set("minPrice", filters.minPrice);
    if (filters.maxPrice) params.set("maxPrice", filters.maxPrice);
    if (filters.sort) params.set("sort", filters.sort);
    if (filters.rating) params.set("rating", filters.rating);

    try {
      const res = await fetch(`/api/products?${params}`);
      const data = await res.json();
      setProducts(data.products || []);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [searchParams, filters]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="section-title">{t(locale, "shop")}</h1>
        <p className="section-subtitle">
          {locale === "ar" ? "تصفح مجموعتنا الكاملة" : "Browse our full collection"}
        </p>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className="gap-2"
        >
          <SlidersHorizontal className="h-4 w-4" />
          {t(locale, "filter")}
        </Button>

        <select
          value={filters.sort}
          onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
          className="h-9 rounded-lg border border-gray-200 bg-white px-3 text-sm dark:border-gray-700 dark:bg-gray-900"
        >
          <option value="newest">{locale === "ar" ? "الأحدث" : "Newest"}</option>
          <option value="price-asc">{locale === "ar" ? "السعر: الأقل" : "Price: Low to High"}</option>
          <option value="price-desc">{locale === "ar" ? "السعر: الأعلى" : "Price: High to Low"}</option>
          <option value="popular">{locale === "ar" ? "الأكثر مبيعاً" : "Best Selling"}</option>
        </select>

        <span className="text-sm text-gray-500">
          <Grid3X3 className="me-1 inline h-4 w-4" />
          {products.length} {locale === "ar" ? "منتج" : "products"}
        </span>
      </div>

      {showFilters && (
        <div className="mb-6 grid gap-4 rounded-2xl border p-6 sm:grid-cols-4 dark:border-gray-800">
          <Input
            label={locale === "ar" ? "السعر من" : "Min Price"}
            type="number"
            value={filters.minPrice}
            onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
          />
          <Input
            label={locale === "ar" ? "السعر إلى" : "Max Price"}
            type="number"
            value={filters.maxPrice}
            onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
          />
          <div>
            <label className="mb-1.5 block text-sm font-medium">
              {t(locale, "rating")}
            </label>
            <select
              value={filters.rating}
              onChange={(e) => setFilters({ ...filters, rating: e.target.value })}
              className="h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm dark:border-gray-700 dark:bg-gray-900"
            >
              <option value="">{locale === "ar" ? "الكل" : "All"}</option>
              <option value="4">4+ ⭐</option>
              <option value="3">3+ ⭐</option>
            </select>
          </div>
          <div className="flex items-end">
            <Button onClick={fetchProducts} className="w-full">
              {locale === "ar" ? "تطبيق" : "Apply"}
            </Button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
        </div>
      ) : products.length === 0 ? (
        <div className="py-20 text-center text-gray-500">{t(locale, "noResults")}</div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
