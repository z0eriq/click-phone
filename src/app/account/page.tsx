"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocaleStore } from "@/store";
import { t } from "@/lib/i18n";
import { toast } from "sonner";

export default function AccountPage() {
  const { locale } = useLocaleStore();
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: isLogin ? "login" : "register",
          ...form,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error);
        return;
      }
      toast.success(
        isLogin
          ? locale === "ar" ? "تم تسجيل الدخول" : "Logged in"
          : locale === "ar" ? "تم إنشاء الحساب" : "Account created"
      );
      router.push("/account/dashboard");
    } catch {
      toast.error(locale === "ar" ? "حدث خطأ" : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container flex min-h-[70vh] items-center justify-center py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">
            {isLogin ? t(locale, "login") : t(locale, "register")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
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
                />
              </>
            )}
            <Input
              label={locale === "ar" ? "البريد الإلكتروني" : "Email"}
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
            <Input
              label={locale === "ar" ? "كلمة المرور" : "Password"}
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading
                ? t(locale, "loading")
                : isLogin
                  ? t(locale, "login")
                  : t(locale, "register")}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-brand-600 hover:underline"
            >
              {isLogin
                ? locale === "ar" ? "ليس لديك حساب؟ سجل الآن" : "Don't have an account? Register"
                : locale === "ar" ? "لديك حساب؟ سجل دخول" : "Have an account? Login"}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
