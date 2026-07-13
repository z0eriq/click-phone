"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  FolderTree,
  FileText,
  Settings,
  Image,
  Tag,
  Phone,
  BarChart3,
  Bell,
  Database,
  LogOut,
  Menu,
  X,
  ChevronLeft,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { AdminGuard } from "@/components/admin/admin-guard";
import { BrandLogo } from "@/components/ui/brand-logo";

const sidebarLinks = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard", labelAr: "لوحة التحكم" },
  { href: "/admin/products", icon: Package, label: "Products", labelAr: "المنتجات" },
  { href: "/admin/categories", icon: FolderTree, label: "Categories", labelAr: "التصنيفات" },
  { href: "/admin/orders", icon: ShoppingCart, label: "Orders", labelAr: "الطلبات" },
  { href: "/admin/customers", icon: Users, label: "Customers", labelAr: "العملاء" },
  { href: "/admin/banners", icon: Image, label: "Banners", labelAr: "البنرات" },
  { href: "/admin/phone-lines", icon: Phone, label: "Phone Lines", labelAr: "خطوط الاتصال" },
  { href: "/admin/coupons", icon: Tag, label: "Coupons", labelAr: "الكوبونات" },
  { href: "/admin/blog", icon: FileText, label: "Blog", labelAr: "المدونة" },
  { href: "/admin/analytics", icon: BarChart3, label: "Analytics", labelAr: "التحليلات" },
  { href: "/admin/notifications", icon: Bell, label: "Notifications", labelAr: "الإشعارات" },
  { href: "/admin/backup", icon: Database, label: "Backup", labelAr: "النسخ الاحتياطي" },
  { href: "/admin/settings", icon: Settings, label: "Settings", labelAr: "الإعدادات" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <AdminGuard>
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-950">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 start-0 z-50 w-64 transform bg-gray-900 text-white transition-transform lg:static lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-gray-800 px-6">
          <Link href="/admin" className="flex items-center gap-2">
            <BrandLogo height={32} className="rounded-md" />
          </Link>
          <button className="lg:hidden" onClick={() => setSidebarOpen(false)}>
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="space-y-1 p-4">
          {sidebarLinks.map((link) => {
            const isActive =
              link.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-brand-600 text-white"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                )}
              >
                <link.icon className="h-4 w-4" />
                {link.labelAr}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 w-full border-t border-gray-800 p-4">
          <Link
            href="/"
            className="mb-2 flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-gray-400 hover:bg-gray-800 hover:text-white"
          >
            <ChevronLeft className="h-4 w-4" />
            العودة للموقع
          </Link>
          <button
            onClick={async () => {
              await fetch("/api/auth", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "logout" }),
              });
              window.location.href = "/admin/login";
            }}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-red-400 hover:bg-red-900/20"
          >
            <LogOut className="h-4 w-4" />
            تسجيل الخروج
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main */}
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center gap-4 border-b bg-white px-6 dark:border-gray-800 dark:bg-gray-900">
          <button className="lg:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-6 w-6" />
          </button>
          <h1 className="text-lg font-bold">CLICK PHONE - لوحة التحكم</h1>
        </header>
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
    </AdminGuard>
  );
}
