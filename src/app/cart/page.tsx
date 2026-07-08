"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag, Tag } from "lucide-react";
import { useCartStore, useLocaleStore } from "@/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice, TAX_RATE, SHIPPING_COST, FREE_SHIPPING_THRESHOLD } from "@/lib/utils";
import { t, getLocalizedField } from "@/lib/i18n";
import { useState } from "react";
import { toast } from "sonner";

export default function CartPage() {
  const { locale } = useLocaleStore();
  const {
    items,
    removeItem,
    updateQuantity,
    couponCode,
    couponDiscount,
    setCoupon,
    removeCoupon,
    getSubtotal,
    clearCart,
  } = useCartStore();
  const [couponInput, setCouponInput] = useState("");
  const [applying, setApplying] = useState(false);

  const subtotal = getSubtotal();
  const discount = couponDiscount;
  const afterDiscount = subtotal - discount;
  const tax = afterDiscount * TAX_RATE;
  const shipping = afterDiscount >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = afterDiscount + tax + shipping;

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    setApplying(true);
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponInput, subtotal }),
      });
      const data = await res.json();
      if (data.valid) {
        setCoupon(couponInput, data.discount);
        toast.success(locale === "ar" ? "تم تطبيق الكوبون" : "Coupon applied");
      } else {
        toast.error(data.error || (locale === "ar" ? "كوبون غير صالح" : "Invalid coupon"));
      }
    } catch {
      toast.error(locale === "ar" ? "حدث خطأ" : "An error occurred");
    } finally {
      setApplying(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container flex min-h-[60vh] flex-col items-center justify-center py-20">
        <ShoppingBag className="mb-4 h-16 w-16 text-gray-300" />
        <h2 className="mb-2 text-xl font-bold">{t(locale, "emptyCart")}</h2>
        <Link href="/shop">
          <Button>{t(locale, "continueShopping")}</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <h1 className="section-title mb-8">{t(locale, "cart")}</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {items.map((item) => (
            <Card key={item.id}>
              <CardContent className="flex gap-4 p-4">
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-gray-50 dark:bg-gray-800">
                  <Image src={item.image} alt={item.name} fill className="object-contain p-2" />
                </div>
                <div className="flex flex-1 flex-col justify-between">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">
                        {locale === "ar" && item.nameAr ? item.nameAr : item.name}
                      </h3>
                      {item.color && (
                        <p className="text-xs text-gray-500">{item.color}</p>
                      )}
                      <p className="mt-1 font-bold text-brand-600">
                        {formatPrice(item.price, locale === "ar" ? "ar-IQ" : "en-US")}
                      </p>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div>
          <Card className="sticky top-24">
            <CardContent className="space-y-4 p-6">
              <h3 className="text-lg font-bold">
                {locale === "ar" ? "ملخص الطلب" : "Order Summary"}
              </h3>

              <div className="flex gap-2">
                <Input
                  placeholder={t(locale, "coupon")}
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  disabled={!!couponCode}
                />
                {couponCode ? (
                  <Button variant="outline" onClick={removeCoupon} size="sm">
                    ✕
                  </Button>
                ) : (
                  <Button onClick={handleApplyCoupon} disabled={applying} size="sm">
                    <Tag className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <div className="space-y-2 border-t pt-4 text-sm dark:border-gray-800">
                <div className="flex justify-between">
                  <span className="text-gray-500">{t(locale, "subtotal")}</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>{t(locale, "discount")}</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-500">{t(locale, "tax")}</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">{t(locale, "shipping")}</span>
                  <span>{shipping === 0 ? (locale === "ar" ? "مجاني" : "Free") : formatPrice(shipping)}</span>
                </div>
                <div className="flex justify-between border-t pt-2 text-lg font-bold dark:border-gray-800">
                  <span>{t(locale, "total")}</span>
                  <span className="text-brand-600">{formatPrice(total)}</span>
                </div>
              </div>

              <Link href="/checkout">
                <Button className="w-full" size="lg">
                  {t(locale, "checkout")}
                </Button>
              </Link>

              <Link href="/shop">
                <Button variant="outline" className="w-full">
                  {t(locale, "continueShopping")}
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
