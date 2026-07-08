"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Package, Heart, MapPin, Bell, User, LogOut } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocaleStore } from "@/store";
import { t } from "@/lib/i18n";
import { formatPrice } from "@/lib/utils";

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  createdAt: string;
}

export default function AccountDashboard() {
  const { locale } = useLocaleStore();
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    fetch("/api/auth")
      .then((r) => {
        if (!r.ok) throw new Error("Not auth");
        return r.json();
      })
      .then((data) => setUser(data.user))
      .catch(() => router.push("/account"));

    fetch("/api/orders")
      .then((r) => r.json())
      .then((data) => setOrders(data.orders?.slice(0, 5) || []))
      .catch(() => {});
  }, [router]);

  const handleLogout = async () => {
    await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "logout" }),
    });
    router.push("/account");
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-600 border-t-transparent" />
      </div>
    );
  }

  const menuItems = [
    { icon: Package, label: t(locale, "myOrders"), href: "/account/orders" },
    { icon: Heart, label: t(locale, "wishlist"), href: "/wishlist" },
    { icon: MapPin, label: t(locale, "addresses"), href: "/account/addresses" },
    { icon: Bell, label: t(locale, "notifications"), href: "/account/notifications" },
  ];

  const statusLabels: Record<string, string> = {
    PENDING: locale === "ar" ? "قيد الانتظار" : "Pending",
    CONFIRMED: locale === "ar" ? "مؤكد" : "Confirmed",
    PROCESSING: locale === "ar" ? "قيد التجهيز" : "Processing",
    SHIPPED: locale === "ar" ? "تم الشحن" : "Shipped",
    DELIVERED: locale === "ar" ? "تم التسليم" : "Delivered",
    CANCELLED: locale === "ar" ? "ملغي" : "Cancelled",
  };

  return (
    <div className="container py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="section-title">{t(locale, "myAccount")}</h1>
          <p className="text-gray-500">{user.name} - {user.email}</p>
        </div>
        <Button variant="outline" onClick={handleLogout} className="gap-2">
          <LogOut className="h-4 w-4" />
          {t(locale, "logout")}
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {menuItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <Card className="transition-all hover:shadow-lg hover:-translate-y-1">
              <CardContent className="flex items-center gap-3 p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100 text-brand-600">
                  <item.icon className="h-5 w-5" />
                </div>
                <span className="font-semibold">{item.label}</span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Card>
        <CardContent className="p-6">
          <h2 className="mb-4 text-lg font-bold">{t(locale, "myOrders")}</h2>
          {orders.length === 0 ? (
            <p className="text-gray-500">{locale === "ar" ? "لا توجد طلبات" : "No orders yet"}</p>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => (
                <div key={order.id} className="flex items-center justify-between rounded-xl border p-4 dark:border-gray-800">
                  <div>
                    <p className="font-mono text-sm font-medium">{order.orderNumber}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString(locale === "ar" ? "ar-IQ" : "en-US")}
                    </p>
                  </div>
                  <div className="text-end">
                    <p className="font-bold">{formatPrice(order.total)}</p>
                    <span className="text-xs text-brand-600">{statusLabels[order.status]}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
