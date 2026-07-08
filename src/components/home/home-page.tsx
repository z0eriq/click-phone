"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Smartphone,
  Tablet,
  Watch,
  Headphones,
  Shield,
  Truck,
  Wrench,
  ArrowLeft,
  ArrowRight,
  Zap,
} from "lucide-react";
import { ProductCard, type ProductCardData } from "@/components/shop/product-card";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/card";
import { useLocaleStore } from "@/store";
import { t, getLocalizedField } from "@/lib/i18n";
import { CONTACT } from "@/lib/utils";

interface HomePageProps {
  data: {
    banners: Array<{
      id: string;
      title: string;
      titleAr?: string | null;
      subtitle?: string | null;
      subtitleAr?: string | null;
      image: string;
      link?: string | null;
    }>;
    featuredProducts: ProductCardData[];
    latestProducts: ProductCardData[];
    saleProducts: ProductCardData[];
    brands: Array<{ id: string; name: string; slug: string; logo?: string | null }>;
    categories: Array<{
      id: string;
      name: string;
      nameAr?: string | null;
      slug: string;
      image?: string | null;
      icon?: string | null;
    }>;
  };
}

const categoryIcons: Record<string, React.ReactNode> = {
  phones: <Smartphone className="h-8 w-8" />,
  tablets: <Tablet className="h-8 w-8" />,
  watches: <Watch className="h-8 w-8" />,
  accessories: <Headphones className="h-8 w-8" />,
};

const features = [
  { icon: Shield, key: "warranty" as const },
  { icon: Truck, key: "freeShipping" as const },
  { icon: Wrench, key: "support" as const },
  { icon: Zap, key: "shopNow" as const },
];

export function HomePage({ data }: HomePageProps) {
  const { locale } = useLocaleStore();
  const Arrow = locale === "ar" ? ArrowLeft : ArrowRight;

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] bg-gradient-to-br from-gray-950 via-gray-900 to-brand-950">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-brand-600/20 via-transparent to-transparent" />
          <div className="absolute bottom-0 start-0 h-96 w-96 rounded-full bg-brand-600/10 blur-3xl" />
          <div className="absolute end-0 top-1/4 h-64 w-64 rounded-full bg-brand-400/10 blur-3xl" />
        </div>

        <div className="container relative flex min-h-[85vh] items-center py-20">
          <div className="grid w-full items-center gap-12 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: locale === "ar" ? 50 : -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="mb-4 inline-block rounded-full border border-brand-500/30 bg-brand-500/10 px-4 py-1.5 text-xs font-medium text-brand-400">
                {locale === "ar" ? "✨ أحدث التقنيات" : "✨ Latest Technology"}
              </span>
              <h1 className="mb-4 text-5xl font-black leading-tight tracking-tight text-white md:text-7xl">
                {t(locale, "heroTitle")}
              </h1>
              <p className="mb-2 text-xl font-medium text-brand-400">
                {t(locale, "heroSubtitle")}
              </p>
              <p className="mb-8 max-w-lg text-gray-400">
                {t(locale, "heroDescription")}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/shop">
                  <Button size="lg" className="gap-2">
                    {t(locale, "shopNow")}
                    <Arrow className="h-4 w-4" />
                  </Button>
                </Link>
                <a href={`tel:${CONTACT.phone}`}>
                  <Button variant="glass" size="lg">
                    {t(locale, "callUs")}: {CONTACT.phone}
                  </Button>
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="relative mx-auto h-[500px] w-[500px]">
                <div className="absolute inset-0 animate-float rounded-full bg-gradient-to-br from-brand-600/30 to-brand-400/10 blur-2xl" />
                <Image
                  src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=600&fit=crop"
                  alt="Smartphone"
                  fill
                  className="relative z-10 object-contain drop-shadow-2xl"
                  priority
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-b bg-gray-50 py-8 dark:bg-gray-900/50">
        <div className="container grid grid-cols-2 gap-4 md:grid-cols-4">
          {features.map((feature, i) => (
            <motion.div
              key={feature.key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-3 rounded-xl p-4"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-100 text-brand-600 dark:bg-brand-900/50">
                <feature.icon className="h-6 w-6" />
              </div>
              <span className="text-sm font-semibold">{t(locale, feature.key)}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Categories */}
      {data.categories.length > 0 && (
        <section className="py-16">
          <div className="container">
            <div className="mb-10 text-center">
              <h2 className="section-title">{locale === "ar" ? "تصفح الفئات" : "Browse Categories"}</h2>
              <p className="section-subtitle">{locale === "ar" ? "اختر ما يناسبك" : "Find what you need"}</p>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {data.categories.map((cat, i) => (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link href={`/shop?category=${cat.slug}`}>
                    <GlassCard className="group flex flex-col items-center gap-3 p-6 text-center transition-all hover:bg-brand-600/10 dark:bg-gray-900/50">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-100 text-brand-600 transition-colors group-hover:bg-brand-600 group-hover:text-white dark:bg-brand-900/50">
                        {categoryIcons[cat.slug] || <Smartphone className="h-8 w-8" />}
                      </div>
                      <span className="font-semibold">
                        {getLocalizedField(cat, "name", locale)}
                      </span>
                    </GlassCard>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      <ProductSection
        title={locale === "ar" ? "منتجات مميزة" : "Featured Products"}
        subtitle={locale === "ar" ? "أفضل اختياراتنا" : "Our top picks"}
        products={data.featuredProducts}
        viewAllHref="/shop?featured=true"
        locale={locale}
      />

      {/* Sale Products */}
      {data.saleProducts.length > 0 && (
        <section className="bg-gradient-to-r from-red-600 to-orange-600 py-16 text-white">
          <div className="container">
            <div className="mb-10 text-center">
              <h2 className="text-3xl font-black md:text-4xl">
                {locale === "ar" ? "🔥 عروض حصرية" : "🔥 Exclusive Deals"}
              </h2>
              <p className="mt-2 text-white/80">
                {locale === "ar" ? "خصومات لا تفوت" : "Don't miss these deals"}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {data.saleProducts.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link href="/offers">
                <Button variant="glass" size="lg">
                  {t(locale, "viewAll")}
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Latest Products */}
      <ProductSection
        title={locale === "ar" ? "أحدث الهواتف" : "Latest Phones"}
        subtitle={locale === "ar" ? "وصل حديثاً" : "Just arrived"}
        products={data.latestProducts}
        viewAllHref="/latest-phones"
        locale={locale}
      />

      {/* Brands */}
      {data.brands.length > 0 && (
        <section className="border-t py-16 dark:border-gray-800">
          <div className="container">
            <h2 className="section-title mb-10 text-center">
              {locale === "ar" ? "علاماتنا التجارية" : "Our Brands"}
            </h2>
            <div className="flex flex-wrap items-center justify-center gap-8">
              {data.brands.map((brand) => (
                <Link
                  key={brand.id}
                  href={`/shop?brand=${brand.slug}`}
                  className="text-2xl font-black text-gray-400 transition-colors hover:text-brand-600"
                >
                  {brand.name}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-gray-950 py-20">
        <div className="container text-center">
          <h2 className="mb-4 text-3xl font-black text-white md:text-5xl">
            {locale === "ar" ? "هل تحتاج صيانة؟" : "Need Repair?"}
          </h2>
          <p className="mx-auto mb-8 max-w-lg text-gray-400">
            {locale === "ar"
              ? "فريقنا المتخصص جاهز لصيانة جميع أنواع الهواتف بقطع غيار أصلية"
              : "Our expert team is ready to repair all phone types with original parts"}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/maintenance">
              <Button size="lg">{locale === "ar" ? "خدمة الصيانة" : "Repair Service"}</Button>
            </Link>
            <a href={`https://wa.me/${CONTACT.whatsapp}`} target="_blank" rel="noopener noreferrer">
              <Button variant="glass" size="lg">{t(locale, "whatsapp")}</Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

function ProductSection({
  title,
  subtitle,
  products,
  viewAllHref,
  locale,
}: {
  title: string;
  subtitle: string;
  products: ProductCardData[];
  viewAllHref: string;
  locale: "ar" | "en";
}) {
  if (products.length === 0) return null;

  return (
    <section className="py-16">
      <div className="container">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h2 className="section-title">{title}</h2>
            <p className="section-subtitle">{subtitle}</p>
          </div>
          <Link href={viewAllHref}>
            <Button variant="outline" size="sm">
              {t(locale, "viewAll")}
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
