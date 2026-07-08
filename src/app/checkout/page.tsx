"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCartStore, useLocaleStore } from "@/store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice, TAX_RATE, SHIPPING_COST, FREE_SHIPPING_THRESHOLD } from "@/lib/utils";
import { t, getLocalizedField } from "@/lib/i18n";
import { toast } from "sonner";
import { CheckCircle } from "lucide-react";

export default function CheckoutPage() {
  const { locale } = useLocaleStore();
  const router = useRouter();
  const { items, couponCode, couponDiscount, getSubtotal, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [form, setForm] = useState({
    shippingName: "",
    shippingPhone: "",
    shippingAddress: "",
    notes: "",
  });

  const subtotal = getSubtotal();
  const discount = couponDiscount;
  const afterDiscount = subtotal - discount;
  const tax = afterDiscount * TAX_RATE;
  const shipping = afterDiscount >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = afterDiscount + tax + shipping;

  useEffect(() => {
    if (items.length === 0 && !completed) {
      router.push("/cart");
    }
  }, [items.length, completed, router]);

  if (items.length === 0 && !completed) {
    return null;
  }

  if (completed) {
    return (
      <div className="container flex min-h-[60vh] flex-col items-center justify-center py-20">
        <CheckCircle className="mb-4 h-16 w-16 text-green-500" />
        <h2 className="mb-2 text-2xl font-bold">
          {locale === "ar" ? "تم إنشاء طلبك بنجاح!" : "Order Placed Successfully!"}
        </h2>
        <p className="mb-4 text-gray-500">
          {locale === "ar" ? "رقم الطلب:" : "Order #"}: <strong>{orderNumber}</strong>
        </p>
        <Button onClick={() => router.push("/shop")}>
          {t(locale, "continueShopping")}
        </Button>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.productId,
            variantId: item.variantId,
            quantity: item.quantity,
            price: item.price,
            name: item.name,
            sku: item.productId,
          })),
          ...form,
          couponCode,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error);
        return;
      }
      setOrderNumber(data.order.orderNumber);
      setCompleted(true);
      clearCart();
      toast.success(locale === "ar" ? "تم إنشاء الطلب" : "Order placed");
    } catch {
      toast.error(locale === "ar" ? "حدث خطأ" : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-8">
      <h1 className="section-title mb-8">{t(locale, "checkout")}</h1>

      <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardContent className="space-y-4 p-6">
              <h2 className="text-lg font-bold">
                {locale === "ar" ? "معلومات التوصيل" : "Shipping Information"}
              </h2>
              <Input
                label={locale === "ar" ? "الاسم الكامل" : "Full Name"}
                value={form.shippingName}
                onChange={(e) => setForm({ ...form, shippingName: e.target.value })}
                required
              />
              <Input
                label={locale === "ar" ? "رقم الهاتف" : "Phone Number"}
                value={form.shippingPhone}
                onChange={(e) => setForm({ ...form, shippingPhone: e.target.value })}
                required
              />
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  {locale === "ar" ? "العنوان" : "Address"}
                </label>
                <textarea
                  value={form.shippingAddress}
                  onChange={(e) => setForm({ ...form, shippingAddress: e.target.value })}
                  rows={3}
                  required
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-900"
                />
              </div>
              <Input
                label={locale === "ar" ? "ملاحظات (اختياري)" : "Notes (optional)"}
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
              />
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="sticky top-24">
            <CardContent className="space-y-4 p-6">
              <h3 className="font-bold">{locale === "ar" ? "ملخص الطلب" : "Order Summary"}</h3>
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>{locale === "ar" && item.nameAr ? item.nameAr : item.name} x{item.quantity}</span>
                  <span>{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
              <div className="space-y-2 border-t pt-4 text-sm dark:border-gray-800">
                <div className="flex justify-between">
                  <span>{t(locale, "subtotal")}</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>{t(locale, "discount")}</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>{t(locale, "tax")}</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t(locale, "shipping")}</span>
                  <span>{shipping === 0 ? (locale === "ar" ? "مجاني" : "Free") : formatPrice(shipping)}</span>
                </div>
                <div className="flex justify-between border-t pt-2 text-lg font-bold dark:border-gray-800">
                  <span>{t(locale, "total")}</span>
                  <span className="text-brand-600">{formatPrice(total)}</span>
                </div>
              </div>
              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? t(locale, "loading") : t(locale, "checkout")}
              </Button>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}
