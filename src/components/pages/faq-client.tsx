"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useLocaleStore } from "@/store";
import { getLocalizedField } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface FAQ {
  id: string;
  question: string;
  questionAr: string | null;
  answer: string;
  answerAr: string | null;
  category: string;
}

export function FAQClient({ faqs }: { faqs: FAQ[] }) {
  const { locale } = useLocaleStore();
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="container py-12">
      <div className="mb-12 text-center">
        <h1 className="section-title">
          {locale === "ar" ? "الأسئلة الشائعة" : "FAQ"}
        </h1>
      </div>

      <div className="mx-auto max-w-3xl space-y-3">
        {faqs.length === 0 ? (
          <p className="text-center text-gray-500 py-10">
            {locale === "ar" ? "لا توجد أسئلة حالياً" : "No FAQs available"}
          </p>
        ) : (
          faqs.map((faq) => (
            <div
              key={faq.id}
              className="overflow-hidden rounded-2xl border dark:border-gray-800"
            >
              <button
                onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                className="flex w-full items-center justify-between p-5 text-start font-semibold hover:bg-gray-50 dark:hover:bg-gray-900"
              >
                {getLocalizedField(faq, "question", locale)}
                <ChevronDown
                  className={cn(
                    "h-5 w-5 shrink-0 transition-transform",
                    openId === faq.id && "rotate-180"
                  )}
                />
              </button>
              <AnimatePresence>
                {openId === faq.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="border-t px-5 py-4 text-sm text-gray-600 dark:border-gray-800 dark:text-gray-400">
                      {getLocalizedField(faq, "answer", locale)}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
