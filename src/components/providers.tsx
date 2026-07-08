"use client";

import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { useLocaleStore } from "@/store";
import { useEffect } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  const { locale } = useLocaleStore();

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
  }, [locale]);

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      {children}
      <Toaster
        position={locale === "ar" ? "top-left" : "top-right"}
        richColors
        closeButton
      />
    </ThemeProvider>
  );
}
