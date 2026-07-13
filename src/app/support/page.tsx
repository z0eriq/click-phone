"use client";

import { useLocaleStore } from "@/store";
import { CONTACT } from "@/lib/utils";
import { t } from "@/lib/i18n";
import { Phone, MessageCircle, MapPin, Facebook, Mail } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

export default function SupportPage() {
  const { locale } = useLocaleStore();
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    await new Promise((r) => setTimeout(r, 1000));
    toast.success(locale === "ar" ? "تم إرسال رسالتك بنجاح" : "Message sent successfully");
    setForm({ name: "", email: "", phone: "", message: "" });
    setSending(false);
  };

  const contactMethods = [
    {
      icon: Phone,
      label: t(locale, "callUs"),
      value: CONTACT.phone,
      href: `tel:${CONTACT.phone}`,
      color: "bg-brand-600",
    },
    {
      icon: MessageCircle,
      label: t(locale, "whatsapp"),
      value: "WhatsApp",
      href: `https://wa.me/${CONTACT.whatsapp}`,
      color: "bg-green-500",
      external: true,
    },
    {
      icon: MapPin,
      label: t(locale, "directions"),
      value: "Google Maps",
      href: CONTACT.maps,
      color: "bg-red-500",
      external: true,
    },
    {
      icon: Facebook,
      label: t(locale, "followUs"),
      value: "Facebook",
      href: CONTACT.facebook,
      color: "bg-blue-600",
      external: true,
    },
    {
      icon: Mail,
      label: "Email",
      value: CONTACT.email,
      href: `mailto:${CONTACT.email}`,
      color: "bg-gray-600",
    },
  ];

  return (
    <div className="container py-12">
      <div className="mb-12 text-center">
        <h1 className="section-title">{t(locale, "contact")}</h1>
        <p className="section-subtitle">
          {locale === "ar" ? "نحن هنا لمساعدتك" : "We're here to help"}
        </p>
      </div>

      <div className="mb-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {contactMethods.map((method) => (
          <a
            key={method.label}
            href={method.href}
            target={method.external ? "_blank" : undefined}
            rel={method.external ? "noopener noreferrer" : undefined}
          >
            <Card className="transition-all hover:shadow-lg hover:-translate-y-1">
              <CardContent className="flex flex-col items-center gap-3 p-6 text-center">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl text-white ${method.color}`}>
                  <method.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">{method.label}</p>
                  <p className="font-semibold">{method.value}</p>
                </div>
              </CardContent>
            </Card>
          </a>
        ))}
      </div>

      <div className="mx-auto max-w-2xl">
        <Card>
          <CardContent className="p-8">
            <h2 className="mb-6 text-xl font-bold">
              {locale === "ar" ? "أرسل لنا رسالة" : "Send us a message"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label={locale === "ar" ? "الاسم" : "Name"}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
                <Input
                  label={locale === "ar" ? "الهاتف" : "Phone"}
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  required
                />
              </div>
              <Input
                label={locale === "ar" ? "البريد الإلكتروني" : "Email"}
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  {locale === "ar" ? "الرسالة" : "Message"}
                </label>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  rows={5}
                  required
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-900"
                />
              </div>
              <Button type="submit" className="w-full" disabled={sending}>
                {sending
                  ? locale === "ar" ? "جاري الإرسال..." : "Sending..."
                  : locale === "ar" ? "إرسال" : "Send"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
