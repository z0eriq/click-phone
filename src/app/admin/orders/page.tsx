"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  shippingName: string | null;
  shippingPhone: string | null;
  createdAt: string;
  user?: { name: string; email: string };
  items: Array<{ name: string; quantity: number; price: number }>;
}

const statusOptions = [
  { value: "PENDING", label: "جديد" },
  { value: "CONFIRMED", label: "مؤكد" },
  { value: "PROCESSING", label: "قيد التجهيز" },
  { value: "SHIPPED", label: "تم الشحن" },
  { value: "DELIVERED", label: "تم التسليم" },
  { value: "CANCELLED", label: "ملغي" },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/admin/orders");
      const data = await res.json();
      setOrders(data.orders || []);
    } catch {
      // handle error
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId: string, status: string) => {
    try {
      await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      fetchOrders();
    } catch {
      // handle error
    }
  };

  const filtered =
    filter === "ALL" ? orders : orders.filter((o) => o.status === filter);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">إدارة الطلبات</h2>

      <div className="flex flex-wrap gap-2">
        <Button
          variant={filter === "ALL" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("ALL")}
        >
          الكل ({orders.length})
        </Button>
        {statusOptions.map((s) => (
          <Button
            key={s.value}
            variant={filter === s.value ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(s.value)}
          >
            {s.label} ({orders.filter((o) => o.status === s.value).length})
          </Button>
        ))}
      </div>

      <div className="space-y-4">
        {loading ? (
          <p className="text-center py-10 text-gray-500">جاري التحميل...</p>
        ) : filtered.length === 0 ? (
          <p className="text-center py-10 text-gray-500">لا توجد طلبات</p>
        ) : (
          filtered.map((order) => (
            <Card key={order.id}>
              <CardContent className="p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="font-mono font-bold">{order.orderNumber}</p>
                    <p className="text-sm text-gray-500">
                      {order.shippingName} • {order.shippingPhone}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(order.createdAt).toLocaleString("ar-IQ")}
                    </p>
                  </div>
                  <div className="text-end">
                    <p className="text-lg font-bold text-brand-600">
                      {formatPrice(order.total)}
                    </p>
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order.id, e.target.value)}
                      className="mt-2 rounded-lg border px-3 py-1 text-sm dark:border-gray-700 dark:bg-gray-900"
                    >
                      {statusOptions.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="mt-4 border-t pt-4 dark:border-gray-800">
                  {order.items?.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span>{item.name} x{item.quantity}</span>
                      <span>{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
