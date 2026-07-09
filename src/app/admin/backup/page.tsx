"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function AdminBackupPage() {
  const handleBackup = () => {
    toast.success("النسخ الاحتياطي يتم عبر Neon PostgreSQL تلقائياً");
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">النسخ الاحتياطي</h2>
      <Card>
        <CardContent className="p-6 space-y-4">
          <p className="text-gray-500">
            قاعدة البيانات مستضافة على Neon وتدعم النسخ الاحتياطي التلقائي.
          </p>
          <Button onClick={handleBackup}>معلومات النسخ الاحتياطي</Button>
        </CardContent>
      </Card>
    </div>
  );
}
