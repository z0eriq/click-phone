import prisma from "@/lib/prisma";
import { FAQClient } from "@/components/pages/faq-client";

export const metadata = {
  title: "الأسئلة الشائعة",
  description: "الأسئلة الشائعة - كليك فون",
};

export const dynamic = "force-dynamic";

export default async function FAQPage() {
  let faqs: Array<{
    id: string;
    question: string;
    questionAr: string | null;
    answer: string;
    answerAr: string | null;
    category: string;
  }> = [];

  try {
    faqs = await prisma.fAQ.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    });
  } catch {
    // DB not connected
  }

  return <FAQClient faqs={faqs} />;
}
