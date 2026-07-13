"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";

interface PhoneLine {
  id: string;
  number: string;
  operator: string;
  price: number;
  comparePrice: number | null;
  title?: string | null;
  titleAr?: string | null;
  description?: string | null;
  descriptionAr?: string | null;
  isFeatured: boolean;
  isOnSale: boolean;
  isAvailable: boolean;
  sortOrder: number;
}

interface LineForm {
  number: string;
  operator: string;
  price: string;
  comparePrice: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  isFeatured: boolean;
  isOnSale: boolean;
  isAvailable: boolean;
  sortOrder: string;
}

const emptyForm: LineForm = {
  number: "",
  operator: "zain",
  price: "",
  comparePrice: "",
  title: "",
  titleAr: "",
  description: "",
  descriptionAr: "",
  isFeatured: false,
  isOnSale: false,
  isAvailable: true,
  sortOrder: "0",
};

const operatorLabels: Record<string, string> = {
  zain: "زين",
  orange: "أورانج",
  umniah: "أمنية",
};

export default function AdminPhoneLinesPage() {
  const [lines, setLines] = useState<PhoneLine[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<LineForm>(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchLines = async () => {
    try {
      const res = await fetch("/api/admin/phone-lines");
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "فشل تحميل الخطوط");
        return;
      }
      setLines(data.lines || []);
    } catch {
      toast.error("فشل تحميل الخطوط");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLines();
  }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  const openCreate = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (line: PhoneLine) => {
    setForm({
      number: line.number,
      operator: line.operator,
      price: String(line.price),
      comparePrice: line.comparePrice != null ? String(line.comparePrice) : "",
      title: line.title || "",
      titleAr: line.titleAr || "",
      description: line.description || "",
      descriptionAr: line.descriptionAr || "",
      isFeatured: line.isFeatured,
      isOnSale: line.isOnSale,
      isAvailable: line.isAvailable,
      sortOrder: String(line.sortOrder),
    });
    setEditingId(line.id);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.number || !form.price) return;
    setSaving(true);
    try {
      const payload = {
        number: form.number,
        operator: form.operator,
        price: parseFloat(form.price),
        comparePrice: form.comparePrice ? parseFloat(form.comparePrice) : null,
        title: form.title || null,
        titleAr: form.titleAr || null,
        description: form.description || null,
        descriptionAr: form.descriptionAr || null,
        isFeatured: form.isFeatured,
        isOnSale: form.isOnSale,
        isAvailable: form.isAvailable,
        sortOrder: parseInt(form.sortOrder, 10) || 0,
      };

      const res = await fetch(
        editingId ? `/api/admin/phone-lines/${editingId}` : "/api/admin/phone-lines",
        {
          method: editingId ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "فشل الحفظ");
        return;
      }
      toast.success(editingId ? "تم تحديث الخط" : "تم إضافة الخط");
      resetForm();
      fetchLines();
    } catch {
      toast.error("حدث خطأ");
    } finally {
      setSaving(false);
    }
  };

  const toggleAvailable = async (line: PhoneLine) => {
    try {
      const res = await fetch(`/api/admin/phone-lines/${line.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isAvailable: !line.isAvailable }),
      });
      if (!res.ok) {
        toast.error("فشل تحديث الحالة");
        return;
      }
      toast.success(line.isAvailable ? "تم إخفاء الخط" : "تم تفعيل الخط");
      fetchLines();
    } catch {
      toast.error("حدث خطأ");
    }
  };

  const handleDelete = async (line: PhoneLine) => {
    if (!confirm(`هل تريد حذف الرقم ${line.number}؟`)) return;
    try {
      const res = await fetch(`/api/admin/phone-lines/${line.id}`, { method: "DELETE" });
      if (!res.ok) {
        toast.error("فشل الحذف");
        return;
      }
      toast.success("تم حذف الخط");
      fetchLines();
    } catch {
      toast.error("حدث خطأ");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">إدارة خطوط الاتصال</h2>
          <p className="text-gray-500">{lines.length} خط</p>
        </div>
        <Button size="sm" className="gap-2" onClick={openCreate}>
          <Plus className="h-4 w-4" />
          إضافة خط
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardContent className="p-6">
            <h3 className="mb-4 text-lg font-semibold">
              {editingId ? "تعديل الخط" : "خط جديد"}
            </h3>
            <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
              <Input
                label="رقم الخط *"
                value={form.number}
                onChange={(e) => setForm({ ...form, number: e.target.value })}
                placeholder="0791234567"
                required
              />
              <div>
                <label className="mb-1.5 block text-sm font-medium">المشغّل *</label>
                <select
                  value={form.operator}
                  onChange={(e) => setForm({ ...form, operator: e.target.value })}
                  className="h-11 w-full rounded-xl border px-3 text-sm dark:border-gray-700 dark:bg-gray-900"
                >
                  <option value="zain">زين</option>
                  <option value="orange">أورانج</option>
                  <option value="umniah">أمنية</option>
                </select>
              </div>
              <Input
                label="السعر (د.أ) *"
                type="number"
                step="0.01"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                required
              />
              <Input
                label="السعر قبل الخصم"
                type="number"
                step="0.01"
                value={form.comparePrice}
                onChange={(e) => setForm({ ...form, comparePrice: e.target.value })}
              />
              <Input
                label="العنوان (إنجليزي)"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
              <Input
                label="العنوان (عربي)"
                value={form.titleAr}
                onChange={(e) => setForm({ ...form, titleAr: e.target.value })}
              />
              <Input
                label="الوصف (إنجليزي)"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
              <Input
                label="الوصف (عربي)"
                value={form.descriptionAr}
                onChange={(e) => setForm({ ...form, descriptionAr: e.target.value })}
              />
              <Input
                label="الترتيب"
                type="number"
                value={form.sortOrder}
                onChange={(e) => setForm({ ...form, sortOrder: e.target.value })}
              />
              <div className="flex flex-wrap gap-4 sm:col-span-2">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.isAvailable}
                    onChange={(e) => setForm({ ...form, isAvailable: e.target.checked })}
                  />
                  متاح للبيع
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.isOnSale}
                    onChange={(e) => setForm({ ...form, isOnSale: e.target.checked })}
                  />
                  عرض
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.isFeatured}
                    onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                  />
                  مميز
                </label>
              </div>
              <div className="flex gap-2 sm:col-span-2">
                <Button type="submit" disabled={saving}>
                  {saving ? "جاري الحفظ..." : editingId ? "تحديث" : "حفظ"}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  إلغاء
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-sm">
              <thead>
                <tr className="border-b bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
                  <th className="p-4 text-start">الرقم</th>
                  <th className="p-4 text-start">المشغّل</th>
                  <th className="p-4 text-start">السعر</th>
                  <th className="p-4 text-start">الحالة</th>
                  <th className="p-4 text-start">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-500">
                      جاري التحميل...
                    </td>
                  </tr>
                ) : lines.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-500">
                      لا توجد خطوط — أضف أرقاماً للبيع
                    </td>
                  </tr>
                ) : (
                  lines.map((line) => (
                    <tr key={line.id} className="border-b dark:border-gray-800">
                      <td className="p-4">
                        <p className="font-mono font-bold">{line.number}</p>
                        <p className="text-xs text-gray-500">{line.titleAr || line.title}</p>
                      </td>
                      <td className="p-4">{operatorLabels[line.operator] || line.operator}</td>
                      <td className="p-4">
                        <span className="font-semibold">{formatPrice(line.price)}</span>
                        {line.comparePrice ? (
                          <span className="ms-2 text-xs text-gray-400 line-through">
                            {formatPrice(line.comparePrice)}
                          </span>
                        ) : null}
                        {line.isOnSale ? (
                          <span className="ms-2 rounded bg-red-100 px-1.5 py-0.5 text-[10px] text-red-700">
                            عرض
                          </span>
                        ) : null}
                      </td>
                      <td className="p-4">
                        <button
                          type="button"
                          onClick={() => toggleAvailable(line)}
                          className={`rounded-full px-2 py-0.5 text-xs ${
                            line.isAvailable
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {line.isAvailable ? "متاح" : "غير متاح"}
                        </button>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost" onClick={() => openEdit(line)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-red-600"
                            onClick={() => handleDelete(line)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
