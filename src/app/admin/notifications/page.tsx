"use client";

import { Card, CardContent } from "@/components/ui/card";

export default function AdminNotificationsPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">الإشعارات</h2>
      <Card>
        <CardContent className="p-6 text-center text-gray-500">
          <p>يتم إرسال إشعارات الطلبات تلقائياً للعملاء عند إنشاء طلب جديد.</p>
        </CardContent>
      </Card>
    </div>
  );
}
