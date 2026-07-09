"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  isActive: boolean;
  isBanned: boolean;
  createdAt: string;
  _count?: { orders: number };
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/customers")
      .then((r) => r.json())
      .then((d) => setCustomers(d.customers || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">إدارة العملاء</h2>
        <p className="text-gray-500">{customers.length} عميل</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
                <th className="p-4 text-start">الاسم</th>
                <th className="p-4 text-start">البريد</th>
                <th className="p-4 text-start">الهاتف</th>
                <th className="p-4 text-start">الطلبات</th>
                <th className="p-4 text-start">الحالة</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="p-8 text-center text-gray-500">جاري التحميل...</td></tr>
              ) : customers.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-gray-500">لا يوجد عملاء</td></tr>
              ) : (
                customers.map((c) => (
                  <tr key={c.id} className="border-b dark:border-gray-800">
                    <td className="p-4 font-medium">{c.name}</td>
                    <td className="p-4">{c.email}</td>
                    <td className="p-4">{c.phone || "—"}</td>
                    <td className="p-4">{c._count?.orders || 0}</td>
                    <td className="p-4">
                      <span className={`rounded-full px-2 py-0.5 text-xs ${
                        c.isBanned ? "bg-red-100 text-red-700" :
                        c.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                      }`}>
                        {c.isBanned ? "محظور" : c.isActive ? "نشط" : "معطل"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
