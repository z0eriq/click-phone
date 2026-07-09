"use client";

import { Card, CardContent } from "@/components/ui/card";

export default function AdminBannersPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">إدارة البنرات</h2>
      <Card>
        <CardContent className="p-6 text-center text-gray-500">
          <p>البنرات الحالية تُدار من قاعدة البيانات.</p>
          <p className="mt-2 text-sm">يمكنك إضافة بنرات جديدة من لوحة التحكم قريباً أو عبر قاعدة البيانات مباشرة.</p>
        </CardContent>
      </Card>
    </div>
  );
}
