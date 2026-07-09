"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ProductFormModal } from "@/components/admin/product-form-modal";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  nameAr?: string | null;
  sku: string;
  price: number;
  stock: number;
  isActive: boolean;
  slug: string;
  brand?: { name: string };
  category?: { name: string; nameAr?: string | null };
  images?: { url: string }[];
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/products?limit=100");
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "فشل تحميل المنتجات");
        return;
      }
      setProducts(data.products || []);
    } catch {
      toast.error("فشل تحميل المنتجات");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`هل تريد حذف "${name}"؟`)) return;
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || "فشل الحذف");
        return;
      }
      toast.success("تم حذف المنتج");
      fetchProducts();
    } catch {
      toast.error("حدث خطأ");
    }
  };

  const openAdd = () => {
    setEditId(null);
    setModalOpen(true);
  };

  const openEdit = (id: string) => {
    setEditId(id);
    setModalOpen(true);
  };

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.nameAr || "").includes(search) ||
      p.sku.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">إدارة المنتجات</h2>
          <p className="text-gray-500">{products.length} منتج</p>
        </div>
        <Button size="sm" className="gap-2" onClick={openAdd}>
          <Plus className="h-4 w-4" />
          إضافة منتج
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="بحث بالاسم أو SKU..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="ps-10"
        />
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
                  <th className="p-4 text-start font-medium">المنتج</th>
                  <th className="p-4 text-start font-medium">SKU</th>
                  <th className="p-4 text-start font-medium">السعر</th>
                  <th className="p-4 text-start font-medium">المخزون</th>
                  <th className="p-4 text-start font-medium">الحالة</th>
                  <th className="p-4 text-start font-medium">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-500">
                      جاري التحميل...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center">
                      <p className="text-gray-500 mb-4">لا توجد منتجات</p>
                      <Button size="sm" onClick={openAdd}>
                        <Plus className="h-4 w-4 me-2" />
                        أضف أول منتج
                      </Button>
                    </td>
                  </tr>
                ) : (
                  filtered.map((product) => (
                    <tr key={product.id} className="border-b dark:border-gray-800">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {product.images?.[0]?.url && (
                            <img
                              src={product.images[0].url}
                              alt=""
                              className="h-10 w-10 rounded-lg object-cover"
                            />
                          )}
                          <div>
                            <p className="font-medium">{product.nameAr || product.name}</p>
                            <p className="text-xs text-gray-500">
                              {product.brand?.name} • {product.category?.nameAr || product.category?.name}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 font-mono text-xs">{product.sku}</td>
                      <td className="p-4 font-medium">{formatPrice(product.price)}</td>
                      <td className="p-4">
                        <span className={product.stock <= 5 ? "text-red-600 font-bold" : ""}>
                          {product.stock}
                        </span>
                      </td>
                      <td className="p-4">
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs ${
                            product.isActive
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {product.isActive ? "نشط" : "معطل"}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" onClick={() => openEdit(product.id)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500"
                            onClick={() => handleDelete(product.id, product.nameAr || product.name)}
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

      <ProductFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={fetchProducts}
        productId={editId}
      />
    </div>
  );
}
