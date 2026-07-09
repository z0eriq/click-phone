"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

interface Category {
  id: string;
  name: string;
  nameAr?: string | null;
  slug: string;
  isActive: boolean;
  _count?: { products: number };
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", nameAr: "", icon: "" });
  const [saving, setSaving] = useState(false);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/admin/categories");
      const data = await res.json();
      setCategories(data.categories || []);
    } catch {
      toast.error("فشل تحميل التصنيفات");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "فشل الإضافة");
        return;
      }
      toast.success("تم إضافة التصنيف");
      setForm({ name: "", nameAr: "", icon: "" });
      setShowForm(false);
      fetchCategories();
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
          <h2 className="text-2xl font-bold">إدارة التصنيفات</h2>
          <p className="text-gray-500">{categories.length} تصنيف</p>
        </div>
        <Button size="sm" className="gap-2" onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4" />
          إضافة تصنيف
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-3">
              <Input
                label="الاسم (إنجليزي) *"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
              <Input
                label="الاسم (عربي)"
                value={form.nameAr}
                onChange={(e) => setForm({ ...form, nameAr: e.target.value })}
              />
              <Input
                label="أيقونة"
                value={form.icon}
                onChange={(e) => setForm({ ...form, icon: e.target.value })}
                placeholder="smartphone"
              />
              <div className="sm:col-span-3 flex gap-2">
                <Button type="submit" disabled={saving}>
                  {saving ? "جاري الحفظ..." : "حفظ"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  إلغاء
                </Button>
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
                <th className="p-4 text-start">التصنيف</th>
                <th className="p-4 text-start">Slug</th>
                <th className="p-4 text-start">المنتجات</th>
                <th className="p-4 text-start">الحالة</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4} className="p-8 text-center text-gray-500">جاري التحميل...</td></tr>
              ) : categories.length === 0 ? (
                <tr><td colSpan={4} className="p-8 text-center text-gray-500">لا توجد تصنيفات</td></tr>
              ) : (
                categories.map((cat) => (
                  <tr key={cat.id} className="border-b dark:border-gray-800">
                    <td className="p-4 font-medium">{cat.nameAr || cat.name}</td>
                    <td className="p-4 font-mono text-xs">{cat.slug}</td>
                    <td className="p-4">{cat._count?.products || 0}</td>
                    <td className="p-4">
                      <span className={`rounded-full px-2 py-0.5 text-xs ${cat.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {cat.isActive ? "نشط" : "معطل"}
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
