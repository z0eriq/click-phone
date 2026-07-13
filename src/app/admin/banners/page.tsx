"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Plus, Pencil, Trash2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

interface Banner {
  id: string;
  title: string;
  titleAr?: string | null;
  subtitle?: string | null;
  subtitleAr?: string | null;
  image: string;
  link?: string | null;
  position: string;
  isActive: boolean;
  sortOrder: number;
  startsAt?: string | null;
  expiresAt?: string | null;
}

interface BannerForm {
  title: string;
  titleAr: string;
  subtitle: string;
  subtitleAr: string;
  image: string;
  link: string;
  position: string;
  isActive: boolean;
  sortOrder: string;
  startsAt: string;
  expiresAt: string;
}

const emptyForm: BannerForm = {
  title: "",
  titleAr: "",
  subtitle: "",
  subtitleAr: "",
  image: "",
  link: "",
  position: "home",
  isActive: true,
  sortOrder: "0",
  startsAt: "",
  expiresAt: "",
};

function toLocalDatetime(iso: string | null | undefined) {
  if (!iso) return "";
  const date = new Date(iso);
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60 * 1000);
  return local.toISOString().slice(0, 16);
}

function toIsoDatetime(local: string) {
  if (!local) return null;
  return new Date(local).toISOString();
}

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<BannerForm>(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchBanners = async () => {
    try {
      const res = await fetch("/api/admin/banners");
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "فشل تحميل البنرات");
        return;
      }
      setBanners(data.banners || []);
    } catch {
      toast.error("فشل تحميل البنرات");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
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

  const openEdit = (banner: Banner) => {
    setForm({
      title: banner.title,
      titleAr: banner.titleAr || "",
      subtitle: banner.subtitle || "",
      subtitleAr: banner.subtitleAr || "",
      image: banner.image,
      link: banner.link || "",
      position: banner.position,
      isActive: banner.isActive,
      sortOrder: String(banner.sortOrder),
      startsAt: toLocalDatetime(banner.startsAt),
      expiresAt: toLocalDatetime(banner.expiresAt),
    });
    setEditingId(banner.id);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.image) return;

    setSaving(true);
    try {
      const payload = {
        title: form.title,
        titleAr: form.titleAr || null,
        subtitle: form.subtitle || null,
        subtitleAr: form.subtitleAr || null,
        image: form.image,
        link: form.link || null,
        position: form.position,
        isActive: form.isActive,
        sortOrder: parseInt(form.sortOrder, 10) || 0,
        startsAt: toIsoDatetime(form.startsAt),
        expiresAt: toIsoDatetime(form.expiresAt),
      };

      const res = await fetch(
        editingId ? `/api/admin/banners/${editingId}` : "/api/admin/banners",
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

      toast.success(editingId ? "تم تحديث البنر" : "تم إضافة البنر");
      resetForm();
      fetchBanners();
    } catch {
      toast.error("حدث خطأ");
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (banner: Banner) => {
    try {
      const res = await fetch(`/api/admin/banners/${banner.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !banner.isActive }),
      });
      if (!res.ok) {
        toast.error("فشل تحديث الحالة");
        return;
      }
      toast.success(banner.isActive ? "تم تعطيل البنر" : "تم تفعيل البنر");
      fetchBanners();
    } catch {
      toast.error("حدث خطأ");
    }
  };

  const handleDelete = async (banner: Banner) => {
    if (!confirm(`هل تريد حذف البنر "${banner.titleAr || banner.title}"؟`)) return;

    try {
      const res = await fetch(`/api/admin/banners/${banner.id}`, { method: "DELETE" });
      if (!res.ok) {
        toast.error("فشل الحذف");
        return;
      }
      toast.success("تم حذف البنر");
      fetchBanners();
    } catch {
      toast.error("حدث خطأ");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">إدارة البنرات</h2>
          <p className="text-gray-500">{banners.length} بنر</p>
        </div>
        <Button size="sm" className="gap-2" onClick={openCreate}>
          <Plus className="h-4 w-4" />
          إضافة بنر
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardContent className="p-6">
            <h3 className="mb-4 text-lg font-semibold">
              {editingId ? "تعديل البنر" : "بنر جديد"}
            </h3>
            <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
              <Input
                label="العنوان (إنجليزي) *"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
              <Input
                label="العنوان (عربي)"
                value={form.titleAr}
                onChange={(e) => setForm({ ...form, titleAr: e.target.value })}
              />
              <Input
                label="العنوان الفرعي (إنجليزي)"
                value={form.subtitle}
                onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
              />
              <Input
                label="العنوان الفرعي (عربي)"
                value={form.subtitleAr}
                onChange={(e) => setForm({ ...form, subtitleAr: e.target.value })}
              />
              <div className="sm:col-span-2">
                <Input
                  label="رابط الصورة *"
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  placeholder="https://..."
                  required
                />
                {form.image && (
                  <div className="relative mt-3 h-32 w-full overflow-hidden rounded-xl border dark:border-gray-700">
                    <Image
                      src={form.image}
                      alt="معاينة"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                )}
              </div>
              <Input
                label="رابط التوجيه"
                value={form.link}
                onChange={(e) => setForm({ ...form, link: e.target.value })}
                placeholder="/shop"
              />
              <div>
                <label className="mb-1.5 block text-sm font-medium">الموقع</label>
                <select
                  value={form.position}
                  onChange={(e) => setForm({ ...form, position: e.target.value })}
                  className="h-11 w-full rounded-xl border px-3 text-sm dark:border-gray-700 dark:bg-gray-900"
                >
                  <option value="home">الصفحة الرئيسية</option>
                </select>
              </div>
              <Input
                label="ترتيب العرض"
                type="number"
                value={form.sortOrder}
                onChange={(e) => setForm({ ...form, sortOrder: e.target.value })}
              />
              <Input
                label="تاريخ البداية"
                type="datetime-local"
                value={form.startsAt}
                onChange={(e) => setForm({ ...form, startsAt: e.target.value })}
              />
              <Input
                label="تاريخ الانتهاء"
                type="datetime-local"
                value={form.expiresAt}
                onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
              />
              <label className="flex items-center gap-2 sm:col-span-2">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <span className="text-sm">بنر نشط</span>
              </label>
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
            <table className="w-full min-w-[800px] text-sm">
              <thead>
                <tr className="border-b bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
                  <th className="p-4 text-start">الصورة</th>
                  <th className="p-4 text-start">العنوان</th>
                  <th className="p-4 text-start">الرابط</th>
                  <th className="p-4 text-start">الترتيب</th>
                  <th className="p-4 text-start">الحالة</th>
                  <th className="p-4 text-start">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-500">
                      جاري التحميل...
                    </td>
                  </tr>
                ) : banners.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-500">
                      لا توجد بنرات — أضف بنراً جديداً للصفحة الرئيسية
                    </td>
                  </tr>
                ) : (
                  banners.map((banner) => (
                    <tr key={banner.id} className="border-b dark:border-gray-800">
                      <td className="p-4">
                        <div className="relative h-14 w-24 overflow-hidden rounded-lg border dark:border-gray-700">
                          <Image
                            src={banner.image}
                            alt={banner.titleAr || banner.title}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="font-medium">{banner.titleAr || banner.title}</p>
                        {banner.subtitleAr || banner.subtitle ? (
                          <p className="text-xs text-gray-500">
                            {banner.subtitleAr || banner.subtitle}
                          </p>
                        ) : null}
                      </td>
                      <td className="p-4">
                        {banner.link ? (
                          <a
                            href={banner.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-brand-600 hover:underline"
                          >
                            {banner.link}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="p-4">{banner.sortOrder}</td>
                      <td className="p-4">
                        <button
                          type="button"
                          onClick={() => toggleActive(banner)}
                          className={`rounded-full px-2 py-0.5 text-xs transition-colors ${
                            banner.isActive
                              ? "bg-green-100 text-green-700 hover:bg-green-200"
                              : "bg-red-100 text-red-700 hover:bg-red-200"
                          }`}
                        >
                          {banner.isActive ? "نشط" : "معطل"}
                        </button>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => openEdit(banner)}
                            title="تعديل"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleDelete(banner)}
                            title="حذف"
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
