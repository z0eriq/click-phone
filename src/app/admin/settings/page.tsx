"use client";

import { Card, CardContent } from "@/components/ui/card";
import { CONTACT } from "@/lib/utils";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">إعدادات الموقع</h2>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardContent className="p-6 space-y-3">
            <h3 className="font-bold">معلومات المتجر</h3>
            <p className="text-sm"><span className="text-gray-500">الاسم:</span> CLICK PHONE - كليك فون</p>
            <p className="text-sm"><span className="text-gray-500">الهاتف:</span> {CONTACT.phone}</p>
            <p className="text-sm"><span className="text-gray-500">واتساب:</span> +{CONTACT.whatsapp}</p>
            <p className="text-sm"><span className="text-gray-500">البريد:</span> {CONTACT.email}</p>
            <p className="text-sm"><span className="text-gray-500">العنوان:</span> {CONTACT.address}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-3">
            <h3 className="font-bold">إعدادات التجارة (الأردن)</h3>
            <p className="text-sm"><span className="text-gray-500">العملة:</span> دينار أردني (JOD)</p>
            <p className="text-sm"><span className="text-gray-500">الضريبة:</span> 16%</p>
            <p className="text-sm"><span className="text-gray-500">الشحن:</span> 5 د.أ</p>
            <p className="text-sm"><span className="text-gray-500">شحن مجاني فوق:</span> 100 د.أ</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-3">
            <h3 className="font-bold">روابط التواصل</h3>
            <p className="text-sm break-all"><span className="text-gray-500">فيسبوك:</span> {CONTACT.facebook}</p>
            <p className="text-sm break-all"><span className="text-gray-500">خرائط:</span> {CONTACT.maps}</p>
            <p className="text-sm break-all"><span className="text-gray-500">واتساب:</span> {CONTACT.whatsappUrl}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-3">
            <h3 className="font-bold">SEO</h3>
            <p className="text-sm text-gray-500">Sitemap: /sitemap.xml</p>
            <p className="text-sm text-gray-500">Robots: /robots.txt</p>
            <p className="text-sm text-gray-500">الموقع: click-phone.vercel.app</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
