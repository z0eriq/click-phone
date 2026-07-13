"use client";

import { useEffect, useState } from "react";
import { MessageCircle, Phone, Tag } from "lucide-react";
import { useLocaleStore } from "@/store";
import { t } from "@/lib/i18n";
import { CONTACT, cn, formatPrice, calculateDiscount } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface PhoneLine {
  id: string;
  number: string;
  operator: string;
  price: number;
  comparePrice: number | null;
  title?: string | null;
  titleAr?: string | null;
  description?: string | null;
  descriptionAr?: string | null;
  isFeatured: boolean;
  isOnSale: boolean;
  isAvailable: boolean;
}

const OPERATORS = [
  { id: "all", ar: "الكل", en: "All" },
  { id: "zain", ar: "زين", en: "Zain" },
  { id: "orange", ar: "أورانج", en: "Orange" },
  { id: "umniah", ar: "أمنية", en: "Umniah" },
] as const;

const operatorColors: Record<string, string> = {
  zain: "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300",
  orange: "bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300",
  umniah: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300",
};

function operatorLabel(operator: string, locale: string) {
  const found = OPERATORS.find((o) => o.id === operator);
  if (!found || found.id === "all") return operator;
  return locale === "ar" ? found.ar : found.en;
}

export default function ContactLinesPage() {
  const { locale } = useLocaleStore();
  const [lines, setLines] = useState<PhoneLine[]>([]);
  const [loading, setLoading] = useState(true);
  const [operator, setOperator] = useState("all");
  const [onSaleOnly, setOnSaleOnly] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams();
    if (operator !== "all") params.set("operator", operator);
    if (onSaleOnly) params.set("onSale", "1");

    setLoading(true);
    fetch(`/api/phone-lines?${params.toString()}`)
      .then((r) => r.json())
      .then((d) => setLines(d.lines || []))
      .catch(() => setLines([]))
      .finally(() => setLoading(false));
  }, [operator, onSaleOnly]);

  const orderViaWhatsApp = (line: PhoneLine) => {
    const title = locale === "ar" ? line.titleAr || line.title : line.title || line.titleAr;
    const msg =
      locale === "ar"
        ? `مرحباً، أريد طلب خط الاتصال:\nالرقم: ${line.number}\nالشركة: ${operatorLabel(line.operator, locale)}\nالسعر: ${formatPrice(line.price)}${title ? `\nالعنوان: ${title}` : ""}`
        : `Hello, I'd like to order this contact line:\nNumber: ${line.number}\nOperator: ${operatorLabel(line.operator, locale)}\nPrice: ${formatPrice(line.price)}${title ? `\nTitle: ${title}` : ""}`;
    window.open(`${CONTACT.whatsappUrl}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <div className="container py-12">
      <div className="mb-10 text-center">
        <h1 className="section-title">{t(locale, "contactLines")}</h1>
        <p className="section-subtitle">{t(locale, "contactLinesSubtitle")}</p>
      </div>

      <div className="mb-8 flex flex-wrap items-center justify-center gap-2">
        {OPERATORS.map((op) => (
          <button
            key={op.id}
            type="button"
            onClick={() => setOperator(op.id)}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium transition-colors",
              operator === op.id
                ? "bg-brand-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
            )}
          >
            {locale === "ar" ? op.ar : op.en}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setOnSaleOnly(!onSaleOnly)}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors",
            onSaleOnly
              ? "bg-red-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
          )}
        >
          <Tag className="h-3.5 w-3.5" />
          {t(locale, "offersOnly")}
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-600 border-t-transparent" />
        </div>
      ) : lines.length === 0 ? (
        <p className="py-20 text-center text-gray-500">{t(locale, "noPhoneLines")}</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {lines.map((line) => {
            const discount =
              line.comparePrice && line.comparePrice > line.price
                ? calculateDiscount(line.price, line.comparePrice)
                : 0;
            const title =
              locale === "ar"
                ? line.titleAr || line.title
                : line.title || line.titleAr;
            const desc =
              locale === "ar"
                ? line.descriptionAr || line.description
                : line.description || line.descriptionAr;

            return (
              <Card key={line.id} className="overflow-hidden">
                <CardContent className="space-y-4 p-5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950">
                        <Phone className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-mono text-lg font-bold tracking-wide">{line.number}</p>
                        {title ? <p className="text-sm text-gray-500">{title}</p> : null}
                      </div>
                    </div>
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-0.5 text-xs font-semibold",
                        operatorColors[line.operator] || "bg-gray-100 text-gray-700"
                      )}
                    >
                      {operatorLabel(line.operator, locale)}
                    </span>
                  </div>

                  {desc ? <p className="text-sm text-gray-600 dark:text-gray-400">{desc}</p> : null}

                  <div className="flex items-end justify-between gap-3">
                    <div>
                      <p className="text-xl font-bold text-brand-600">{formatPrice(line.price)}</p>
                      {line.comparePrice && line.comparePrice > line.price ? (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-400 line-through">
                            {formatPrice(line.comparePrice)}
                          </span>
                          {discount > 0 && (
                            <span className="rounded bg-red-100 px-1.5 py-0.5 text-xs font-bold text-red-700">
                              -{discount}%
                            </span>
                          )}
                        </div>
                      ) : null}
                    </div>
                    <Button
                      size="sm"
                      className="gap-1.5 bg-green-600 hover:bg-green-700"
                      onClick={() => orderViaWhatsApp(line)}
                    >
                      <MessageCircle className="h-4 w-4" />
                      {t(locale, "orderWhatsapp")}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
