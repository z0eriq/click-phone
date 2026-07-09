"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

interface Post {
  id: string;
  title: string;
  titleAr?: string | null;
  slug: string;
  isPublished: boolean;
  publishedAt: string | null;
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    fetch("/api/admin/blog")
      .then((r) => r.json())
      .then((d) => setPosts(d.posts || []))
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">إدارة المدونة</h2>
      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
                <th className="p-4 text-start">المقال</th>
                <th className="p-4 text-start">الحالة</th>
                <th className="p-4 text-start">الرابط</th>
              </tr>
            </thead>
            <tbody>
              {posts.length === 0 ? (
                <tr><td colSpan={3} className="p-8 text-center text-gray-500">لا توجد مقالات</td></tr>
              ) : (
                posts.map((p) => (
                  <tr key={p.id} className="border-b dark:border-gray-800">
                    <td className="p-4 font-medium">{p.titleAr || p.title}</td>
                    <td className="p-4">
                      <span className={`rounded-full px-2 py-0.5 text-xs ${p.isPublished ? "bg-green-100 text-green-700" : "bg-gray-100"}`}>
                        {p.isPublished ? "منشور" : "مسودة"}
                      </span>
                    </td>
                    <td className="p-4">
                      <Link href={`/blog/${p.slug}`} className="text-brand-600 hover:underline" target="_blank">
                        عرض
                      </Link>
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
