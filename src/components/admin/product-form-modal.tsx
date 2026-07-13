"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export interface ProductFormData {
  id?: string;
  name: string;
  nameAr: string;
  sku: string;
  barcode: string;
  price: string;
  comparePrice: string;
  stock: string;
  brandId: string;
  categoryId: string;
  imageUrl: string;
  description: string;
  descriptionAr: string;
  isActive: boolean;
  isFeatured: boolean;
  isNew: boolean;
  isOnSale: boolean;
}

const emptyForm: ProductFormData = {
  name: "",
  nameAr: "",
  sku: "",
  barcode: "",
  price: "",
  comparePrice: "",
  stock: "0",
  brandId: "",
  categoryId: "",
  imageUrl: "",
  description: "",
  descriptionAr: "",
  isActive: true,
  isFeatured: false,
  isNew: false,
  isOnSale: false,
};

interface Brand {
  id: string;
  name: string;
}

interface Category {
  id: string;
  name: string;
  nameAr?: string | null;
}

interface ProductFormModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  productId?: string | null;
}

export function ProductFormModal({
  open,
  onClose,
  onSuccess,
  productId,
}: ProductFormModalProps) {
  const [form, setForm] = useState<ProductFormData>(emptyForm);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isEdit = !!productId;

  useEffect(() => {
    if (!open) return;

    Promise.all([
      fetch("/api/admin/brands").then((r) => r.json()),
      fetch("/api/admin/categories").then((r) => r.json()),
    ]).then(([brandsRes, catsRes]) => {
      setBrands(brandsRes.brands || []);
      setCategories(catsRes.categories || []);
    });

    if (productId) {
      setLoading(true);
      fetch(`/api/admin/products/${productId}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.product) {
            const p = data.product;
            setForm({
              id: p.id,
              name: p.name,
              nameAr: p.nameAr || "",
              sku: p.sku,
              barcode: p.barcode || "",
              price: String(p.price),
              comparePrice: p.comparePrice ? String(p.comparePrice) : "",
              stock: String(p.stock),
              brandId: p.brandId || "",
              categoryId: p.categoryId || "",
              imageUrl: p.images?.[0]?.url || "",
              description: p.description || "",
              descriptionAr: p.descriptionAr || "",
              isActive: p.isActive,
              isFeatured: p.isFeatured,
              isNew: p.isNew,
              isOnSale: p.isOnSale,
            });
          }
        })
        .finally(() => setLoading(false));
    } else {
      setForm(emptyForm);
    }
  }, [open, productId]);

  const uploadImage = async (file: File) => {
    setUploading(true);
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "فشل رفع الصورة");
        return;
      }
      setForm((prev) => ({ ...prev, imageUrl: data.url }));
      toast.success("تم رفع الصورة");
    } catch {
      toast.error("فشل رفع الصورة");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("اختر ملف صورة فقط");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("حجم الصورة يجب أن يكون أقل من 5 ميجابايت");
      return;
    }
    uploadImage(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.sku || !form.price) {
      toast.error("الاسم وSKU والسعر مطلوبة");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: form.name,
        nameAr: form.nameAr || undefined,
        sku: form.sku,
        barcode: form.barcode || undefined,
        price: parseFloat(form.price),
        comparePrice: form.comparePrice ? parseFloat(form.comparePrice) : null,
        stock: parseInt(form.stock, 10) || 0,
        brandId: form.brandId || null,
        categoryId: form.categoryId || null,
        imageUrl: form.imageUrl || undefined,
        description: form.description || undefined,
        descriptionAr: form.descriptionAr || undefined,
        isActive: form.isActive,
        isFeatured: form.isFeatured,
        isNew: form.isNew,
        isOnSale: form.isOnSale,
      };

      const res = await fetch(
        isEdit ? `/api/admin/products/${productId}` : "/api/admin/products",
        {
          method: isEdit ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "فشل الحفظ");
        return;
      }
      toast.success(isEdit ? "تم تحديث المنتج" : "تم إضافة المنتج");
      onSuccess();
      onClose();
    } catch {
      toast.error("حدث خطأ");
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 dark:bg-gray-900">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-xl font-bold">
            {isEdit ? "تعديل المنتج" : "إضافة منتج"}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-600 border-t-transparent" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
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
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="SKU *"
                value={form.sku}
                onChange={(e) => setForm({ ...form, sku: e.target.value })}
                required
              />
              <Input
                label="الباركود"
                value={form.barcode}
                onChange={(e) => setForm({ ...form, barcode: e.target.value })}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <Input
                label="السعر *"
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
                label="المخزون"
                type="number"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium">الشركة</label>
                <select
                  value={form.brandId}
                  onChange={(e) => setForm({ ...form, brandId: e.target.value })}
                  className="h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm dark:border-gray-700 dark:bg-gray-900"
                >
                  <option value="">-- اختر الشركة --</option>
                  {brands.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">التصنيف</label>
                <select
                  value={form.categoryId}
                  onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                  className="h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm dark:border-gray-700 dark:bg-gray-900"
                >
                  <option value="">-- اختر التصنيف --</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nameAr || c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">صورة المنتج</label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
                onChange={handleFileChange}
              />
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="gap-2"
                  disabled={uploading}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-4 w-4" />
                  {uploading ? "جاري الرفع..." : "اختر صورة من الجهاز"}
                </Button>
                {form.imageUrl ? (
                  <Button
                    type="button"
                    variant="ghost"
                    className="text-red-600"
                    onClick={() => setForm({ ...form, imageUrl: "" })}
                  >
                    إزالة الصورة
                  </Button>
                ) : null}
              </div>
              <p className="mt-1.5 text-xs text-gray-500">
                JPG أو PNG أو WEBP — حد أقصى 5 ميجابايت
              </p>
              {form.imageUrl ? (
                <div className="relative mt-3 h-40 w-40 overflow-hidden rounded-xl border dark:border-gray-700">
                  <Image
                    src={form.imageUrl}
                    alt="معاينة المنتج"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              ) : null}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">الوصف (عربي)</label>
              <textarea
                value={form.descriptionAr}
                onChange={(e) => setForm({ ...form, descriptionAr: e.target.value })}
                rows={3}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm dark:border-gray-700 dark:bg-gray-900"
              />
            </div>

            <div className="flex flex-wrap gap-4">
              {[
                { key: "isActive" as const, label: "نشط" },
                { key: "isFeatured" as const, label: "مميز" },
                { key: "isNew" as const, label: "جديد" },
                { key: "isOnSale" as const, label: "عرض" },
              ].map((item) => (
                <label key={item.key} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form[item.key]}
                    onChange={(e) => setForm({ ...form, [item.key]: e.target.checked })}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  {item.label}
                </label>
              ))}
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={saving || uploading} className="flex-1">
                {saving ? "جاري الحفظ..." : isEdit ? "حفظ التعديلات" : "إضافة المنتج"}
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                إلغاء
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
