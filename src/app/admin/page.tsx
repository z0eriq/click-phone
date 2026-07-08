"use client";

import { useEffect, useState } from "react";
import {
  ShoppingCart,
  Users,
  Package,
  DollarSign,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { formatPrice } from "@/lib/utils";

interface DashboardData {
  stats: {
    totalOrders: number;
    totalCustomers: number;
    totalProducts: number;
    todayOrders: number;
    monthOrders: number;
    todayRevenue: number;
    monthRevenue: number;
    lastMonthRevenue: number;
    profit: number;
  };
  topProducts: Array<{ name: string; quantity: number; revenue: number }>;
  recentOrders: Array<{
    id: string;
    orderNumber: string;
    total: number;
    status: string;
    createdAt: string;
    user?: { name: string };
  }>;
  salesChart: Array<{ month: string; revenue: number; orders: number }>;
  lowStockProducts: Array<{ id: string; name: string; stock: number; sku: string }>;
  ordersByStatus: Array<{ status: string; _count: number }>;
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/dashboard")
      .then((r) => r.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-600 border-t-transparent" />
      </div>
    );
  }

  if (!data) {
    return <div className="text-center py-20 text-gray-500">فشل تحميل البيانات</div>;
  }

  const { stats } = data;
  const revenueGrowth =
    stats.lastMonthRevenue > 0
      ? ((stats.monthRevenue - stats.lastMonthRevenue) / stats.lastMonthRevenue) * 100
      : 0;

  const statCards = [
    {
      title: "إجمالي الطلبات",
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: "text-blue-600 bg-blue-100",
    },
    {
      title: "العملاء",
      value: stats.totalCustomers,
      icon: Users,
      color: "text-green-600 bg-green-100",
    },
    {
      title: "المنتجات",
      value: stats.totalProducts,
      icon: Package,
      color: "text-purple-600 bg-purple-100",
    },
    {
      title: "مبيعات اليوم",
      value: formatPrice(stats.todayRevenue),
      icon: DollarSign,
      color: "text-yellow-600 bg-yellow-100",
    },
    {
      title: "مبيعات الشهر",
      value: formatPrice(stats.monthRevenue),
      icon: TrendingUp,
      color: "text-brand-600 bg-brand-100",
      change: `${revenueGrowth >= 0 ? "+" : ""}${revenueGrowth.toFixed(1)}%`,
    },
    {
      title: "الأرباح (تقديري)",
      value: formatPrice(stats.profit),
      icon: DollarSign,
      color: "text-emerald-600 bg-emerald-100",
    },
  ];

  const statusLabels: Record<string, string> = {
    PENDING: "جديد",
    CONFIRMED: "مؤكد",
    PROCESSING: "قيد التجهيز",
    SHIPPED: "تم الشحن",
    DELIVERED: "تم التسليم",
    CANCELLED: "ملغي",
    REFUNDED: "مسترد",
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">لوحة التحكم</h2>
        <p className="text-gray-500">مرحباً بك في لوحة تحكم كليك فون</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">{stat.title}</p>
                  <p className="text-xl font-bold">{stat.value}</p>
                  {stat.change && (
                    <p className={`text-xs ${revenueGrowth >= 0 ? "text-green-600" : "text-red-600"}`}>
                      {stat.change}
                    </p>
                  )}
                </div>
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>المبيعات الشهرية</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.salesChart}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value: number) => formatPrice(value)} />
                <Bar dataKey="revenue" fill="#2563eb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>عدد الطلبات</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.salesChart}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="orders" stroke="#2563eb" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Orders */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>أحدث الطلبات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b dark:border-gray-800">
                    <th className="pb-3 text-start font-medium">رقم الطلب</th>
                    <th className="pb-3 text-start font-medium">العميل</th>
                    <th className="pb-3 text-start font-medium">المبلغ</th>
                    <th className="pb-3 text-start font-medium">الحالة</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recentOrders.map((order) => (
                    <tr key={order.id} className="border-b dark:border-gray-800">
                      <td className="py-3 font-mono text-xs">{order.orderNumber}</td>
                      <td className="py-3">{order.user?.name || "ضيف"}</td>
                      <td className="py-3 font-medium">{formatPrice(order.total)}</td>
                      <td className="py-3">
                        <span className="rounded-full bg-brand-100 px-2 py-0.5 text-xs text-brand-700">
                          {statusLabels[order.status] || order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle>أفضل المنتجات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.topProducts.map((product, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-600">
                      {i + 1}
                    </span>
                    <span className="text-sm truncate max-w-[150px]">{product.name}</span>
                  </div>
                  <span className="text-xs text-gray-500">{product.quantity} مبيع</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Alert */}
      {data.lowStockProducts.length > 0 && (
        <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-700">
              <AlertTriangle className="h-5 w-5" />
              تنبيه مخزون منخفض
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {data.lowStockProducts.map((p) => (
                <div key={p.id} className="flex items-center justify-between rounded-lg bg-white p-3 dark:bg-gray-900">
                  <span className="text-sm font-medium">{p.name}</span>
                  <span className="text-sm font-bold text-red-600">{p.stock} متبقي</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
