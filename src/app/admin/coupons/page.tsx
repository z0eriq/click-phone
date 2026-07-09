"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";

interface Coupon {
  id: string;
  code: string;
  description: string | null;
  discountType: string;
  discountValue: number;
  minOrder: number | null;
  usedCount: number;
  usageLimit: number | null;
  isActive: boolean;
}

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    code: "",
    description: "",
    discountType: "percentage",
    discountValue: "",
    minOrder: "",
  });
  const [saving, setSaving] = useState(false);

  const fetchCoupons = async () => {
    try {
      const res = await fetch("/api/admin/coupons");
      const data = await res.json();
      setCoupons(data.coupons || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: form.code,
          description: form.description,
          discountType: form.discountType,
          discountValue: parseFloat(form.discountValue),
          minOrder: form.minOrder ? parseFloat(form.minOrder) : null,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "فشل الإضافة");
        return;
      }
      toast.success("تم إضافة الكوبون");
      setShowForm(false);
      setForm({ code: "", description: "", discountType: "percentage", discountValue: "", minOrder: "" });
      fetchCoupons();
    } catch {
      toast.error("حدث خطأ");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">إدارة الكوبونات</h2>
          <p className="text-gray-500">{coupons.length} كوبون</p>
        </div>
        <Button size="sm" className="gap-2" onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4" />
          إضافة كوبون
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
              <Input label="كود الكوبون *" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} required />
              <Input label="الوصف" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              <div>
                <label className="mb-1.5 block text-sm font-medium">نوع الخصم</label>
                <select
                  value={form.discountType}
                  onChange={(e) => setForm({ ...form, discountType: e.target.value })}
                  className="h-11 w-full rounded-xl border px-3 text-sm dark:border-gray-700 dark:bg-gray-900"
                >
                  <option value="percentage">نسبة مئوية %</option>
                  <option value="fixed">مبلغ ثابت (د.أ)</option>
                </select>
              </div>
              <Input label="قيمة الخصم *" type="number" step="0.01" value={form.discountValue} onChange={(e) => setForm({ ...form, discountValue: e.target.value })} required />
              <Input label="الحد الأدنى للطلب (د.أ)" type="number" step="0.01" value={form.minOrder} onChange={(e) => setForm({ ...form, minOrder: e.target.value })} />
              <div className="sm:col-span-2 flex gap-2">
                <Button type="submit" disabled={saving}>{saving ? "جاري الحفظ..." : "حفظ"}</Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>إلغاء</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
                <th className="p-4 text-start">الكود</th>
                <th className="p-4 text-start">الخصم</th>
                <th className="p-4 text-start">الاستخدام</th>
                <th className="p-4 text-start">الحالة</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4} className="p-8 text-center">جاري التحميل...</td></tr>
              ) : coupons.map((c) => (
                <tr key={c.id} className="border-b dark:border-gray-800">
                  <td className="p-4 font-mono font-bold">{c.code}</td>
                  <td className="p-4">
                    {c.discountType === "percentage" ? `${c.discountValue}%` : formatPrice(c.discountValue)}
                  </td>
                  <td className="p-4">{c.usedCount}{c.usageLimit ? ` / ${c.usageLimit}` : ""}</td>
                  <td className="p-4">
                    <span className={`rounded-full px-2 py-0.5 text-xs ${c.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {c.isActive ? "نشط" : "معطل"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
